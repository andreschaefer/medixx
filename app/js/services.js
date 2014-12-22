'use strict';

/* Services */

var medixxServices = angular.module('medixxServices', ['ngResource']);

medixxServices.factory(
    '$medicService',
    [
        '$resource',
        '$cachedResource',
        '$log',
        '$q',
        '$filter',
        function ($resource, $cachedResource, $log, $q, $filter) {
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


                angular.forEach(user.medics, function (medic) {
                    var today = new Date(Date.now());
                    medic.stock = medic.stock - consumeCount(medic.date, today, medic.consumption);
                    medic.date = today;
                    medic.remainingDays = Math.floor(parseInt(medic.stock) / parseInt(medic.consumption));
                    medic.depleted = new Date(today.getTime() + (medic.remainingDays * 24 * 60 * 60 * 1000));
                });
                return user;
            }

            return {
                medics: function (user) {
                    var $userData = $cachedResource('ch.aschaefer.medixx/medics', 'medics/:userId.json', {userId: '@id'}).get({userId: user});
                    $userData.$promise.then(function (user) {
                        return calculate(user);
                    });
                    $userData.$httpPromise.then(function (user) {
                        return calculate(user);
                    });
                    return $userData;
                }
            };
        }
    ])
;

medixxServices.factory('routeNavigation', function ($route, $location) {
    return {
        activeRoute: function (route) {
            return $location.path().indexOf(route) == 0;
        }
    };
});