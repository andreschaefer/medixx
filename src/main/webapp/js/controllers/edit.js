'use strict';

angular.module('Medixx').controller('EditCtrl', ['$scope', '$routeParams', '$medics',
    function ($scope, $routeParams, $medics) {
        $medics.get($routeParams.userId, function (user) {
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
                $medics.save($scope.user);
            }
            else {
                $medics.save($scope.user);
            }
        }
    }]);


