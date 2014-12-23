'use strict';

angular.module('Medixx').controller('EditCtrl', ['$scope', '$routeParams', '$medics',
    function ($scope, $routeParams, $medics) {
        $medics.get($routeParams.userId, function (medics) {
            $scope.userId = $routeParams.userId;

            $scope.$apply(function () {
                $scope.medics = medics;
                $scope.medicId = $routeParams.medicId;
                $scope.isNew = false;

                $scope.medic = null;
                angular.forEach($scope.medics.stocks, function (value) {
                    if (value.id == $scope.medicId) {
                        $scope.medic = value;
                    }
                })

                if (!$scope.medic) {
                    $scope.medicId = (Math.random() + 1).toString(36)
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

        $scope.save = function () {
            if (this.isNew) {
                this.medics.stocks.push(this.medic);
            }
            $medics.save(this.medics);
        }
    }]);


