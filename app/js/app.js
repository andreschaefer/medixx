'use strict';

/* App Module */

var medixxApp = angular.module('medixxApp', [
    'ngRoute',
    'medixxAnimations',
    'medixxDirectives',
    'medixxControllers',
    'medixxFilters',
    'medixxServices',
    'ngCachedResource'
]);

medixxApp.config(
    ['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/medics', {
                templateUrl: 'partials/medic-list.html',
                controller: 'MedicListCtrl',
            })
            .when('/settings', {
                templateUrl: 'partials/settings.html',
                controller: 'SettingsCtrl',
            })
            .when('/logout', {
                templateUrl: 'partials/settings.html',
                controller: 'SettingsCtrl',
            })
            .when('/medics/:medicId', {
                templateUrl: 'partials/medic-detail.html',
                controller: 'MedicDetailCtrl'
            }).
            otherwise({
                redirectTo: '/medics'
            });
    }]
);
