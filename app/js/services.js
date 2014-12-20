'use strict';

/* Services */

var medixxServices = angular.module('medixxServices', ['ngResource']);

medixxServices.factory(
    'Medic',
    [
        '$resource',
        function ($resource) {
            return $resource('medics/:userId.json', {}, {
                query: {method: 'GET', params: {userId: 'aschaefer'}}
            });
        }
    ]);

medixxServices.factory('routeNavigation', function ($route, $location) {
    var routes = [];
    angular.forEach($route.routes, function (route, path) {
        if (route.name) {
            routes.push({
                path: path,
                name: route.name
            });
        }
    });
    return {
        routes: routes,
        activeRoute: function (route) {
            return route.path === $location.path();
        }
    };
});