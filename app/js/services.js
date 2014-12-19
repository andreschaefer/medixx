'use strict';

/* Services */

var phonecatServices = angular.module('phonecatServices', ['ngResource']);

phonecatServices.factory(
    'Phone',
    [
        '$resource',
    function ($resource) {
        return $resource('phones/:phoneId.json', {}, {
            query: {method: 'GET', params: {phoneId: 'phones'}, isArray: true}
        });
    }
]);

phonecatServices.factory('routeNavigation', function($route, $location) {
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