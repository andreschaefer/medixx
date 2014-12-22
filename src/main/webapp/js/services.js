'use strict';

/* Services */

var medixxServices = angular.module('medixxServices', []);


medixxServices.factory('routeNavigation', function ($route, $location) {
    return {
        activeRoute: function (route) {
            return $location.path().indexOf(route) == 0;
        }
    };
});

medixxServices.factory('$users', function ($log) {
    function calculate(user) {
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


        angular.forEach(user.stocks, function (medic) {
            var today = new Date(Date.now());
            medic.stock = medic.stock - consumeCount(medic.date, today, medic.consumption);
            medic.date = today;
            medic.remainingDays = Math.floor(parseInt(medic.stock) / parseInt(medic.consumption));
            medic.depleted = new Date(today.getTime() + (medic.remainingDays * 24 * 60 * 60 * 1000));
        });
        return user;
    }

    function saveLocal(user) {
        $log.debug('Store local', key(user.id), user);
        localStorage.setItem(key(user.id), JSON.stringify(user));
    }

    function isDirty(userId, toggle) {
        if (typeof(toggle) !== "undefined" && toggle !== null) {
            if (toggle) {
                $log.debug("Set dirty", userId);
                localStorage.setItem(key(userId) + ".dirty", "true");
            }
            else {
                $log.debug("Remove dirty", userId);
                localStorage.removeItem(key(userId) + ".dirty");
            }
        } else {
            // check if dirty when no toggle provide
            var dirty = localStorage.getItem(key(userId) + ".dirty");
            $log.debug("Is dirty", userId, dirty);
            return dirty;
        }
    }


    function key(userId) {
        return "medixx.user." + userId;
    }

    function loadLocal(userId) {
        $log.debug('Load local', key(userId));
        var json = localStorage.getItem(key(userId));
        if (json) {
            var user = JSON.parse(json);
            $log.debug('Loaded local', key(userId), user);
            return user;
        }
    }

    function saveRemote(user, callback) {
        $log.debug('Save user remote', user);
        $.ajax({
            type: 'POST',
            dataType: "json",
            data: JSON.stringify(user),
            contentType: 'application/json',
            cache: false,
            url: '/medics/' + user.id
        })
            .done(function (user) {
                $log.debug('Success: Save user remote', user);
                isDirty(user.id, false);
                if (callback) {
                    callback()
                }
            })
            .fail(function () {
                $log.debug('Fail: Save user remote', user);
                if (callback) {
                    callback()
                }
            });
    }

    function get(userId, callback) {
        function load(userId) {
            $log.debug('Load remote', userId);

            var request = {
                type: 'GET',
                dataType: "json",
                cache: false,
                url: '/medics/' + userId
            };

            $.ajax(request)
                .done(function (user) {
                    $log.debug('Success: Load remote', userId, user);
                    calculate(user);
                    saveLocal(user);
                    if (callback) {
                        callback(user);
                    }
                })
                .fail(function () {
                    $log.debug('Fail: Load remote', userId, user);
                    var user = loadLocal(userId);
                    if (user) {
                        calculate(user);
                        if (callback) {
                            callback(user);
                        }
                    }
                });
        }

        if (!isDirty(userId)) {
            load(userId);
        } else {
            var localUser = loadLocal(userId);
            if (localUser) {
                $log.debug("Try to save dirty object", localUser);
                saveRemote(localUser, function () {
                    load(userId);
                });
            } else {
                isDirty(userId, false);
                load(userId);
            }
        }
    }

    return {
        get: get,
        save: function (user, callback) {
            saveLocal(user);
            isDirty(user.id, true);
            saveRemote(user, callback);
        }
    };
});