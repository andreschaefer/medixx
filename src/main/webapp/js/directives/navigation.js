'use strict';

angular.module('Medixx').directive('navigation', function ($route, $location) {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "js/directives/navigation.html",
        controller: function ($scope) {
            $scope.activeRoute = function (route) {
                return $location.path().indexOf(route) == 0;
            }
        }
    };
});
