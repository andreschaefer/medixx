'use strict';

/* Controllers */

var medixxControllers = angular.module('medixxControllers', []);

medixxControllers.controller('MedicListCtrl', ['$scope', '$log', '$medicService',
    function ($scope, $log, $medicService) {
        $scope.medics = $medicService.medics('aschaefer').medics;
        $scope.orderProp = 'name';
    }]);

medixxControllers.controller('MedicDetailCtrl', ['$scope', '$routeParams', 'Medic',
    function ($scope, $routeParams, Medic) {

    }]);

medixxControllers.controller('SettingsCtrl', ['$scope', '$routeParams',
    function ($scope, $routeParams) {

    }]);

medixxControllers.controller('LogoutCtrl', ['$scope', '$routeParams',
    function ($scope, $routeParams) {

    }]);


