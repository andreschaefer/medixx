'use strict';

angular.module('Medixx').directive('navigation', function ($route, $location, $medics, $rootScope) {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "js/directives/navigation.html",
        controller: function ($scope) {
            $scope.online = function () {
                return $medics.isOnline()
            };
            $scope.activeRoute = function (route) {
                return $location.path().indexOf(route) == 0;
            }
            $scope.login = function () {
                $medics.requireAuth(false).then(function () {
                    $location.path("/list");
                });
            }
        }
    };
});
