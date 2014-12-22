'use strict';

var medixxControllers = angular.module('medixxControllers', []);

medixxControllers.controller('MedicListCtrl', ['$scope', '$log', '$routeParams', '$users',
    function ($scope, $log, $routeParams, $users) {
        $users.get($routeParams.userId, function (user) {
            $scope.$apply(function () {
                $scope.user = user;
            });
        });

        $scope.userId = $routeParams.userId;
        $scope.orderProp = 'name';
    }]);

medixxControllers.controller('MedicDetailCtrl', ['$scope', '$routeParams', '$users',
    function ($scope, $routeParams, $users) {
        $users.get($routeParams.userId, function (user) {
            $scope.$apply(function () {
                $scope.user = user;
            });
        });

        $scope.userId = $routeParams.userId;
        $scope.medicId = $routeParams.medicId;
        $scope.add = function (user,medic,amount) {
            medic.stock += amount;
            $users.save(user);
        }
    }]);

medixxControllers.controller('SettingsCtrl', ['$scope', '$routeParams',
    function ($scope, $routeParams) {

    }]);

medixxControllers.controller('LogoutCtrl', ['$scope', '$routeParams',
    function ($scope, $routeParams) {

    }]);


