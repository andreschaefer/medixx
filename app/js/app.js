'use strict';

/* App Module */

var medixxApp = angular.module('medixxApp', [
    'ngRoute',
    'medixxAnimations',
    'medixxDirectives',
    'medixxControllers',
    'medixxFilters',
    'medixxServices'
]);

medixxApp.config(
    ['$routeProvider', function ($routeProvider) {
        $routeProvider.
            when('/medics', {
                templateUrl: 'partials/medic-list.html',
                controller: 'MedicListCtrl',
                name: 'Bestand'
            }).
            when('/medics/:medicId', {
                templateUrl: 'partials/medic-detail.html',
                controller: 'MedicDetailCtrl'
            }).
            otherwise({
                redirectTo: '/medics'
            });
    }]
);
