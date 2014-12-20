'use strict';

/* Directives */
var medixxDirectives = angular.module('medixxDirectives',['medixxServices']);

medixxDirectives.directive('navigation', function (routeNavigation) {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "partials/navigation-directive.html",
        controller: function ($scope) {
            $scope.routes = routeNavigation.routes;
            $scope.activeRoute = routeNavigation.activeRoute;
        }
    };
});
