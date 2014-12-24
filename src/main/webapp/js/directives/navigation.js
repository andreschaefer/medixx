'use strict';

angular.module('Medixx').directive('navigation', function ($route, $location, $medics, $rootScope) {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "js/directives/navigation.html",
        controller: function ($scope) {
            $scope.status = function (status) {
                return $medics.status() == status;
            };
            $scope.activeRoute = function (route) {
                return $location.path().indexOf(route) == 0;
            }
            $scope.reload = function () {
                $medics.requireAuth(false).then(function () {
                    $medics.reload();
                    $location.path("/list");
                });
            }
        }
    };
});
