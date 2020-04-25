'use strict';

angular.module('Medixx').service('$medics', ['$log', 'config', '$q', '$rootScope', '$timeout',
	function ($log, config, $q, $rootScope, $timeout) {
		let medics = {"stocks": []};
		let user = null;
		let status = STATUS.offline;
		let history = [];

		function reloadLocal() {
			medics = loadLocal() || medics;
			history = loadHistory();
		}

		function reload() {
			$log.debug("$medics.reload");
			reloadLocal();
			if (isDirty()) {
				calculate();
				addToHistory(medics);
				loadRemote(function (remotedata) {
					$log.debug("reload.dirty.loadRemote remotedata", remotedata);
					$log.debug("reload.dirty.loadRemote medics", medics);
					let lastRemote = remotedata;
					if (!lastRemote || !lastRemote.date || (medics && medics.date && medics.date > lastRemote.date)) {
						saveRemote(); // not relevant for result
					}
					$rootScope.$digest();
				})
			}
			loadRemote(function (remotedata) {
				$log.debug("reload.loadRemote remotedata", remotedata);
				$log.debug("reload.loadRemote medics", medics);
				if (remotedata && remotedata.stocks) {
					medics.stocks = remotedata.stocks;
				}
				calculate();
				saveLocal()
				saveRemote();
				$rootScope.$digest();
			});
		}

		reload();

		function requireOnline() {
			let deferred = $q.defer();
			Offline.on("confirmed-up", function () {
				$log.debug("up");
				deferred.resolve();
			});
			Offline.on("confirmed-down", function () {
				$log.debug("down");
				deferred.reject();
			});
			$log.debug("Check online status");
			Offline.check();
			return deferred.promise;
		}

		/**
		 * Checks to make sure the user is currently authorized and the access
		 * token hasn't expired.
		 *
		 */
		function requireAuth() {
			let result = $q.defer();
			let promise = result.promise;
			requireOnline()
				.then(function () {
					$.ajax({
						url: "/api/authenticated",
						dataType: "json",
						cache: false,
						success: function (data) {
							$log.debug("$medics.requireAuth", "/api/authenticated", "success", data);
							user = data;
							status = STATUS.online
							result.resolve();
						},
						error: function (error) {
							$log.debug("$medics.requireAuth", "/api/authenticated", "error", error);
							user = null;
							status = STATUS.unauthenticated
							result.reject();
						}
					});
				})
				.catch(function () {
					result.reject()
				});


			return promise;
		}

		function login() {
			$log.debug("$medics.login");
			let deferred = $q.defer();
			window.location.href = "/require/login";
			deferred.reject();
			return deferred.promise;
		}

		function calculate() {
			$log.debug("$medics.calculate");

			function daysBetween(first, second) {
				first = new Date(first);
				second = new Date(second);

				// Copy date parts of the timestamps, discarding the time parts.
				let one = new Date(first.getFullYear(), first.getMonth(), first.getDate());
				let two = new Date(second.getFullYear(), second.getMonth(), second.getDate());

				// Do the math.
				let millisecondsPerDay = 1000 * 60 * 60 * 24;
				let millisBetween = two.getTime() - one.getTime();
				let days = millisBetween / millisecondsPerDay;

				// Round down.
				return Math.floor(days);
			}

			function consumeCount(start, end, consumption) {
				return daysBetween(start, end) * consumption;
			}

			if (medics) {
				angular.forEach(medics.stocks, function (medic) {
					let today = new Date(Date.now());
					medic.stock = medic.stock - consumeCount(medic.date, today, medic.consumption);
					medic.date = today;
					medic.remainingDays = Math.floor(parseInt(medic.stock) / parseInt(medic.consumption));
					medic.depleted = new Date(today.getTime() + (medic.remainingDays * 24 * 60 * 60 * 1000));
				});
			}
		}

		function addToHistory(item) {
			if (history.length > 10) {
				let removed = history.splice(0, 1);
				$log.debug("History exceeds 10 items, removed oldest", removed);
			}
			let entry = {}
			entry.date = item.date;
			entry.id = entry.date;
			entry.medics = item;

			$log.debug("Add item to history", entry.date);
			if (!_.find(history, function (test) {
				return test.id === entry.id;
			})
			) {
				history.push(entry);
				localStorage.setItem(key("history"), JSON.stringify(history));
			}
		}

		function loadHistory() {
			let local = localStorage.getItem(key("history"));
			$log.debug("History in local storage")
			if (local && local !== "undefined") {
				try {
					return JSON.parse(local);
				} catch (e) {
					$log.warn("Could not load local history, replace entry with valid empty one", e);
					localStorage.setItem(key("history"), JSON.stringify([]));
				}
			}
			$log.debug("History could not be loaded, use empty array")
			return [];
		}

		function saveLocal() {
			$log.debug("$medics.saveLocal");
			if (medics) {
				medics.date = new Date();
				$log.debug('Store local', key("medics"), medics);
				localStorage.setItem(key("medics"), JSON.stringify(medics));
			}
		}

		function isDirty(toggle) {
			if (typeof (toggle) !== "undefined" && toggle !== null) {
				if (toggle) {
					$log.debug("Set dirty");
					localStorage.setItem(key("dirty"), "true");
				}
				else {
					$log.debug("Remove dirty");
					localStorage.removeItem(key("dirty"));
				}
			}
			else {
				// check if dirty when no toggle provide
				let dirty = localStorage.getItem(key("dirty"));
				dirty = typeof (dirty) !== "undefined" && dirty !== null && dirty;
				$log.debug("Is dirty", dirty);
				return dirty;
			}
		}

		function key(value) {
			return "medixx." + value;
		}

		function loadLocal() {
			$log.debug("$medics.loadLocal", key("medics"));
			let json = localStorage.getItem(key("medics"));
			if (json && json !== "undefined") {
				let local = JSON.parse(json);
				$log.debug('Loaded local', key("medics"), local);
				return local;
			}
		}

		/**
		 * Insert new file in the Application Data folder.
		 *
		 * @param {Function} callback Function to call when the request is complete.
		 */
		function saveRemote(callback) {
			$log.debug("$medics.saveRemote");
			status = STATUS.uploading;
			addToHistory(medics);
			$.ajax({
				url: "/api/stock/" + user,
				contentType: "application/json; charset=utf-8",
				data: JSON.stringify(medics),
				cache: false,
				method: "post",
				success: function () {
					$log.debug('Success: Save medics remote', medics);
					isDirty(false);
					status = STATUS.synced;
					$rootScope.$digest();
					if (callback) {
						callback()
					}
				},
				error: function (error) {
					$log.debug('Fail: Save medics remote', error, medics);
					status = STATUS.online;
					$rootScope.$digest();
					if (callback) {
						callback()
					}
				}
			});
		}

		function loadRemote(callback) {
			$log.debug("$medics.loadRemote");
			requireAuth().then(function () {
				status = STATUS.downloading;
				$.ajax(
					{
						url: "/api/stock/" + user,
						dataType: "json",
						cache: false,
						success: function (data) {
							status = STATUS.synced;
							callback(data)
						},
						error: function () {
							status = STATUS.online;
							callback(null)
						}
					});
			})
		}

		function save(callback) {
			$log.debug("$medics.save");
			calculate();
			saveLocal();
			isDirty(true);
			saveRemote(callback);
		}

		function resetLocal() {
			$log.debug("$medics.resetLocal");
			addToHistory(medics);
			medics = {"stocks": []};
			isDirty(false);
			reload();
		}

		function logout() {
			$log.debug("$medics.logout");
			medics = {"stocks": []};
			user = null;
			status = STATUS.offline;
			history = [];
			localStorage.removeItem(key("history"));
			localStorage.removeItem(key("medics"));
			isDirty(false);
			window.location.href="/logout";
		}

		function reset(callback) {
			$log.debug("$medics.reset");
			addToHistory(medics);
			medics = {"stocks": []};
			isDirty(false);
			saveRemote(callback);
		}

		function getHistory() {
			return history;
		}

		function setActiveMedics(activeMedics) {
			addToHistory(medics);
			medics = activeMedics;
			calculate();
			save();
		}

		return {
			get: function () {
				return medics;
			},
			save: save,
			resetLocal: resetLocal,
			reset: reset,
			status: function () {
				return status
			},
			reload: reload,
			auth: requireAuth,
			history: getHistory,
			replace: setActiveMedics,
			login: login,
			logout: logout
		};
	}])
;
