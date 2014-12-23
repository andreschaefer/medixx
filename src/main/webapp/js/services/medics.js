'use strict';

angular.module('Medixx').service('$medics', ['$log', 'config', '$q', '$rootScope',
    function ($log, config, $q, $rootScope) {
        var filename = "medixx.json";

        function calculate(medics) {
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


            angular.forEach(medics.stocks, function (medic) {
                var today = new Date(Date.now());
                medic.stock = medic.stock - consumeCount(medic.date, today, medic.consumption);
                medic.date = today;
                medic.remainingDays = Math.floor(parseInt(medic.stock) / parseInt(medic.consumption));
                medic.depleted = new Date(today.getTime() + (medic.remainingDays * 24 * 60 * 60 * 1000));
            });
            return medics;
        }

        /**
         * Checks to make sure the user is currently authorized and the access
         * token hasn't expired.
         *
         * @param immediateMode
         * @param userId
         * @returns {angular.$q.promise}
         */
        function requireAuth(immediateMode, userId) {
            var token = gapi.auth.getToken();
            var now = Date.now() / 1000;
            if (token && ((token.expires_at - now) > (60))) {
                return $q.when(token);
            } else {
                var params = {
                    'client_id': config.clientId,
                    'scope': config.scopes,
                    'immediate': immediateMode,
                    'user_id': userId
                };
                var deferred = $q.defer();
                gapi.auth.authorize(params, function (result) {
                    if (result && !result.error) {
                        deferred.resolve(result);
                    } else {
                        deferred.reject(result);
                    }
                    $rootScope.$digest();
                });
                return deferred.promise;
            }
        }

        function saveLocal(medics) {
            $log.debug('Store local', key("medics"), medics);
            localStorage.setItem(key("medics"), JSON.stringify(user));
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
                var dirty = localStorage.getItem(key("dirty"));
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
            if (json) {
                var user = JSON.parse(json);
                $log.debug('Loaded local', key("medics"), user);
                return user;
            }
        }

        /**
         * Insert new file in the Application Data folder.
         *
         * @param medics object
         * @param {Function} callback Function to call when the request is complete.
         */
        function saveRemote(medics, callback) {
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

            request.execute().then(
                function (file) {
                    $log.debug('Success: Save medics remote', file);
                    isDirty(false);
                    localStorage.setItem(key("file"), file.id);
                    if (!callback) {
                        callback()
                    }
                },
                function (error) {
                    $log.debug('Fail: Save medics remote', error, medics);
                    if (callback) {
                        callback()
                    }
                }
            );
        }

        function readFromDrive(callback) {
            function load(url, callback) {
                var token = gapi.auth.getToken();
                $.ajax(
                    {
                        url: url,
                        headers: {Authorization: 'Bearer ' + token.access_token},
                        dataType: "json",
                        cache: false,
                        success: function (data) {
                            callback(data)
                        }
                    });
            }

            requireAuth().then(function () {
                gapi.client.load('drive', 'v2', function () {
                    var query = "'appfolder' in parents and title = '" + filename + "'";

                    gapi.client.drive.files.list({'q': query})
                        .execute(function (resp) {
                            $log.debug(resp.items);
                            if (resp.items.length == 0) {
                                load(resp.items[0].downloadUrl, callback);
                            } else {

                            }
                        });
                })
            });
        }

        function get(callback) {
            function load() {
                $log.debug('Load remote');
                readFromDrive(function (medics) {
                    calculate(medics)
                    if (callback) {
                        callback(medics);
                    }
                })
            }

            if (!isDirty()) {
                load();
            } else {
                var localUser = this.loadLocal();
                if (localUser) {
                    $log.debug("Try to save dirty object", localUser);
                    this.saveRemote(localUser, function () {
                        load();
                    });
                } else {
                    isDirty(false);
                    load();
                }
            }
        }

        function save(medics, callback) {
            saveLocal(medics);
            isDirty(true);
            saveRemote(medics, callback);
        }

        return {
            get: get,
            save: save,
            requireAuth: requireAuth
        };
    }]);