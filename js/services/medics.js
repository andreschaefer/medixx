'use strict';

angular.module('Medixx').service('$medics', ['$log', 'config', '$q', '$rootScope', '$timeout',
    function ($log, config, $q, $rootScope, $timeout) {
        var filename = "medixx.json";
        var medics = {"stocks": []};
        var status = STATUS.offline;
        var history = [];

        function reloadLocal() {
            $log.debug("initialize with current local version");
            medics = loadLocal() || medics;
            history = loadHistory();
            calculate();
            $log.debug("local item", medics);
        }

        reloadLocal();

        function reload() {
            reloadLocal();
            if (isDirty()) {
                addToHistory(medics);
                loadRemote(function (remotedata) {
                    var lastRemote = remotedata;
                    if (lastRemote.date && medics && medics.date && medics.date > lastRemote.date) {
                        saveRemote();
                    }
                    $rootScope.$digest();
                })
            }
            loadRemote(function (remotedata) {
                medics.stocks = remotedata.stocks;
                calculate();
                saveLocal();
                $rootScope.$digest();
            });
        }



        function requireOnline() {
            $log.debug("Require online");
            var deferred = $q.defer();
            Offline.on("confirmed-up", function () {
                $log.debug("up");
                if (gapiReady) {
                    $log.debug("gapiReady: " + gapiReady);
                    deferred.resolve();
                }
                else {
                    app.gapiCallback = function () {
                        $log.debug("gapi loaded");
                        deferred.resolve();
                    };
                    loadGapi();
                }
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
         * @param immediateMode
         * @param userId
         */
        function requireAuth(immediateMode, userId) {
            var result = $q.defer();
            var promise = result.promise;
            requireOnline()
                .then(function () {
                    if (!gapi.auth) {
                        $log.debug("gapi.load('auth:client'");
                        gapi.load('auth:client').then(function () {
                            gapi.client.setApiKey(config.apiKey);
                            authorize();
                        });
                    }
                    else {
                        authorize()
                    }
                })
                .catch(function () {
                    result.reject()
                });

            function authorize() {
                var token = gapi.auth.getToken();
                var now = Date.now() / 1000;
                $log.debug("Avalialable token", token);
                if (token && ((token.expires_at - now) > (60))) {
                    $log.debug("valid token, resolve")
                    result.resolve(token)
                } else {
                    $log.debug("No valid token, authenticate")
                    var conf = {
                        'client_id': CONFIG.clientId,
                        'scope': CONFIG.scopes,
                        'immediate': immediateMode == false ? CONFIG.isStandalone : true,
                        'user_id': userId
                    };
                    gapi.auth.authorize(conf, function (authResult) {
                        // if everything is ok go on
                        if (authResult && !authResult.error) {
                            result.resolve(authResult);
                        } else {
                            // can not do immediate login
                            // if we have on `apple-mobile-web-app-capable` mode we should redirect to google login page
                            //if (CONFIG.isStandalone && immediateMode !== false) {
                            //
                            //    // ios homescreen standalone webapp, no popup
                            //    var url = CONFIG.gapiAuthBaseUrl
                            //        + 'client_id=' + encodeURIComponent(CONFIG.clientId)
                            //        + '&scope=' + encodeURIComponent(CONFIG.scopes[0])
                            //        + '&redirect_uri=' + encodeURIComponent(CONFIG.returnTo);
                            //    window.location.href = url;
                            //
                            //} else {
                                // use usual login API from gapi.
                                var params = {
                                    'client_id': CONFIG.clientId,
                                    'scope': CONFIG.scopes,
                                    'immediate': immediateMode == false ? CONFIG.isStandalone : true,
                                    'user_id': userId
                                };

                                gapi.auth.authorize(params, function (auth) {
                                    var token = gapi.auth.getToken();
                                    $log.debug("authenticated", token);
                                    if (token) {
                                        status = STATUS.online;
                                        result.resolve(token)
                                    } else {
                                        status = STATUS.offline;
                                        result.reject();
                                    }
                                });
                            //}
                        }
                    });
                }
            }

            return promise;
        }

        function driveClient() {
            if (gapi.client.drive) {
                var deferred = $q.defer();
                deferred.resolve(gapi.client.drive);
                return deferred.promise;
            }
            else {
                return requireAuth().then(function () {
                    return gapi.client.load('drive', 'v2');
                })
            }
        }

        function calculate() {
            function daysBetween(first, second) {
                first = new Date(first);
                second = new Date(second);

                // Copy date parts of the timestamps, discarding the time parts.
                var one = new Date(first.getFullYear(), first.getMonth(), first.getDate());
                var two = new Date(second.getFullYear(), second.getMonth(), second.getDate());

                // Do the math.
                var millisecondsPerDay = 1000 * 60 * 60 * 24;
                var millisBetween = two.getTime() - one.getTime();
                var days = millisBetween / millisecondsPerDay;

                // Round down.
                return Math.floor(days);
            }

            function consumeCount(start, end, consumption) {
                return daysBetween(start, end) * consumption;
            }

            if (medics) {
                angular.forEach(medics.stocks, function (medic) {
                    var today = new Date(Date.now());
                    medic.stock = medic.stock - consumeCount(medic.date, today, medic.consumption);
                    medic.date = today;
                    medic.remainingDays = Math.floor(parseInt(medic.stock) / parseInt(medic.consumption));
                    medic.depleted = new Date(today.getTime() + (medic.remainingDays * 24 * 60 * 60 * 1000));
                });
            }
        }

        function addToHistory(item) {
            if (history.length > 10) {
                var removed = history.splice(0, 1);
                $log.debug("History exceeds 10 items, removed oldest", removed);
            }
            var entry = {}
            entry.date = item.date;
            entry.id = entry.date;
            entry.medics = item;

            $log.debug("Add item to history", entry.date);
            if (!_.find(history, function (test) {
                    return test.id == entry.id;
                })
            ) {
                history.push(entry);
                localStorage.setItem(key("history"), JSON.stringify(history));
            }
        }

        function loadHistory() {
            var local = localStorage.getItem(key("history"));
            $log.debug("History in local storage")
            if (local && local != "undefined") {
                try {
                    var parse = JSON.parse(local);
                    return parse;
                } catch (e) {
                    $log.warn("Could not load local history, replace entry with valid empty one", e);
                    localStorage.setItem(key("history"), JSON.stringify([]));
                }
            }
            $log.debug("History could not be loaded, use empty array")
            return [];
        }

        function saveLocal() {
            if (medics) {
                medics.date = new Date();
                $log.debug('Store local', key("medics"), medics);
                localStorage.setItem(key("medics"), JSON.stringify(medics));
            }
        }

        function isDirty(toggle) {
            if (typeof(toggle) !== "undefined" && toggle !== null) {
                if (toggle) {
                    $log.debug("Set dirty");
                    localStorage.setItem(key("dirty"), "true");
                }
                else {
                    $log.debug("Remove dirty");
                    localStorage.removeItem(key("dirty"));
                }
            } else {
                // check if dirty when no toggle provide
                var dirty = localStorage.getItem(key("dirty")) ? true : false;
                $log.debug("Is dirty", dirty);
                return dirty;
            }
        }


        function key(value) {
            return "medixx." + value;
        }

        function loadLocal() {
            $log.debug('Load local', key("medics"));
            var json = localStorage.getItem(key("medics"));
            if (json && json != "undefined") {
                var medics = JSON.parse(json);
                $log.debug('Loaded local', key("medics"), medics);
                return medics;
            }
        }

        /**
         * Insert new file in the Application Data folder.
         *
         * @param medics object
         * @param {Function} callback Function to call when the request is complete.
         */
        function saveRemote(callback) {
            status = STATUS.uploading;
            addToHistory(medics);

            var boundary = '-------314159265358979323846';
            var delimiter = "\r\n--" + boundary + "\r\n";
            var close_delim = "\r\n--" + boundary + "--";

            var contentType = 'application/json';
            var metadata = {
                'title': filename,
                'mimeType': contentType,
                'parents': [{'id': 'appfolder'}]
            };
            var multipartRequestBody =
                delimiter +
                'Content-Type: ' + contentType + '\r\n\r\n' +
                JSON.stringify(metadata) +
                delimiter +
                'Content-Type: ' + contentType + '\r\n\r\n' +
                JSON.stringify(medics) +
                close_delim;

            var request = gapi.client.request({
                'path': '/upload/drive/v2/files',
                'method': 'POST',
                'params': {'uploadType': 'multipart'},
                'headers': {
                    'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
                },
                'body': multipartRequestBody
            });

            request.execute(
                function (file) {
                    $log.debug('Success: Save medics remote', file);
                    isDirty(false);
                    status = STATUS.synced;
                    $rootScope.$digest();
                    if (callback) {
                        callback()
                    }
                },
                function (error) {
                    $log.debug('Fail: Save medics remote', error, medics);
                    status = STATUS.online;
                    $rootScope.$digest();
                    if (callback) {
                        callback()
                    }
                }
            );
        }

        function loadRemote(callback) {
            function load(url, callback) {
                var token = gapi.auth.getToken();
                status = STATUS.downloading;
                $.ajax(
                    {
                        url: url,
                        headers: {Authorization: 'Bearer ' + token.access_token},
                        dataType: "json",
                        cache: false,
                        success: function (data) {
                            status = STATUS.synced;
                            callback(data)
                        },
                        error: function () {
                            status = STATUS.online;
                        }
                    });
            }

            requireAuth().then(function () {
                status = STATUS.downloading;
                driveClient().then(function () {
                    gapi.client.drive.files.list({'q': "'appfolder' in parents and title='" + filename + "'"})
                        .execute(function (resp) {
                            status = STATUS.online;
                            if (resp && resp.items && resp.items.length > 0) {
                                var metadata = resp.items[0];
                                load(metadata.downloadUrl, callback);
                            } else {
                                saveRemote(callback);
                            }
                        });
                });
            })
        }


        function save(callback) {
            calculate();
            saveLocal();
            isDirty(true);
            saveRemote(callback);
        }

        function resetLocal() {
            addToHistory(medics);
            medics = {"stocks": []};
            isDirty(false);
            reload();
        }


        function reset(callback) {
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
            replace: setActiveMedics
        };
    }])
;