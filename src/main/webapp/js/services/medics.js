'use strict';

angular.module('Medixx').service('$medics', ['$log', 'config', '$q', '$rootScope', '$timeout',
    function ($log, config, $q, $rootScope, $timeout) {
        var filename = "medixx.json";
        var medics = {"stocks": []};

        $log.debug("initialize with current local version");
        medics = loadLocal() || medics;
        calculate();
        $log.debug("local item", medics);

        if (isDirty()) {
            // TODO raise alert / error
        } else {
            loadRemote(function (remotedata) {
                medics.stocks = remotedata.stocks;
                calculate();
                saveLocal();
                $rootScope.$digest();
            })
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

            function authorize() {
                var token = gapi.auth.getToken();
                var now = Date.now() / 1000;
                $log.debug("Avalialable token", token);
                if (token && ((token.expires_at - now) > (60))) {
                    $log.debug("valid token, resolve")
                    result.resolve(token)
                } else {
                    $log.debug("No valid token, authenticate")
                    var params = {
                        'client_id': CONFIG.clientId,
                        'scope': CONFIG.scopes,
                        'immediate': true,
                        'user_id': userId
                    };
                    gapi.auth.authorize(params,function (auth) {
                        $log.info(auth);
                        result.resolve(gapi.auth.getToken())
                    });
                }
            }

            return promise;
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

        function saveLocal() {
            if (medics) {
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
                    if (callback) {
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

        function loadRemote(callback) {
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
                driveClient().then(function () {
                    gapi.client.drive.files.list({'q': "'appfolder' in parents and title='" + filename + "'"})
                        .execute(function (resp) {
                            $log.debug(resp.items);
                            if (resp.items.length > 0) {
                                var metadata = resp.items[0];
                                load(metadata.downloadUrl, callback);
                            } else {
                                saveRemote(callback);
                            }
                        });
                });
            })
        }

        function driveClient() {
            if (gapi.client.drive) {
                $q.defer().resolve(gapi.client.drive);
            }
            else {
                return requireAuth().then(function () {
                    return gapi.client.load('drive', 'v2');
                })
            }
        }

        function get() {
            return medics;
        }

        function save(callback) {
            calculate();
            saveLocal();
            isDirty(true);
            saveRemote(callback);
        }

        function resetLocal() {
            medics = {"stocks": []};
            localStorage.clear()
        }


        function reset(callback) {
            resetLocal();
            saveRemote(callback);
        }

        return {
            get: get,
            save: save,
            requireAuth: requireAuth,
            resetLocal: resetLocal,
            reset: reset
        };
    }]);