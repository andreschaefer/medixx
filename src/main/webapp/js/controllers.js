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
                $scope.medic = null;
                angular.forEach($scope.user.stocks, function (value) {
                    if (value.id == $scope.medicId) {
                        $scope.medic = value;
                    }
                })
            });
        });

        $scope.userId = $routeParams.userId;
        $scope.medicId = $routeParams.medicId;
        $scope.add = function (amount) {
            $scope.medic.stock += amount;
            $users.save($scope.user);
        }
    }]);

medixxControllers.controller('MedicEditCtrl', ['$scope', '$routeParams', '$users',
    function ($scope, $routeParams, $users) {
        $users.get($routeParams.userId, function (user) {
            $scope.userId = $routeParams.userId;

            $scope.$apply(function () {
                $scope.user = user;
                $scope.medicId = $routeParams.medicId;
                $scope.isNew = false;

                $scope.medic = null;
                angular.forEach($scope.user.stocks, function (value) {
                    if (value.id == $scope.medicId) {
                        $scope.medic = value;
                    }
                })

                if (!$scope.medic) {
                    $scope.medicId = $scope.userId + '-' + (Math.random() + 1).toString(36).substring(7)
                    var stock = {
                        id: $scope.medicId,
                        name: "",
                        stock: 0,
                        consumption: 1,
                        date: new Date()
                    }
                    $scope.medic = stock;
                    $scope.isNew = true;
                }
            });
        });

        $scope.userId = $routeParams.userId;
        $scope.save = function () {
            if ($scope.isNew) {
                $scope.user.stocks.push($scope.medic);
                $users.save($scope.user);
            }
            else {
                $users.save($scope.user);
            }
        }
    }]);

medixxControllers.controller('SettingsCtrl', ['$scope', '$routeParams',
    function ($scope, $routeParams) {

    }]);

medixxControllers.controller('LogoutCtrl', ['$scope', '$routeParams',
    function ($scope, $routeParams) {

    }]);


