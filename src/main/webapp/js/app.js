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
        $routeProvider
            .when('/user/:userId/medics', {
                templateUrl: 'partials/medic-list.html',
                controller: 'MedicListCtrl'
            })
            .when('/user/:userId/settings', {
                templateUrl: 'partials/settings.html',
                controller: 'SettingsCtrl'
            })
            .when('/user/:userId/logout', {
                templateUrl: 'partials/logout.html',
                controller: 'LogoutCtrl'
            })
            .when('/user/:userId/medics/:medicId', {
                templateUrl: 'partials/medic-detail.html',
                controller: 'MedicDetailCtrl'
            })
            .when('/user/:userId/edit/:medicId', {
                templateUrl: 'partials/medic-edit.html',
                controller: 'MedicEditCtrl'
            })
            .otherwise({
                redirectTo: '/user/aschaefer/medics'
            });
    }]
);
