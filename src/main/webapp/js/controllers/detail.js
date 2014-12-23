'use strict';

angular.module('Medixx').controller('DetailCtrl', ['$scope', '$routeParams', '$medics',
    function ($scope, $routeParams, $medics) {

        $medics.get($routeParams.userId, function (medics) {
            $scope.$apply(function () {
                $scope.medics = medics;
                $scope.medic = null;
                angular.forEach($scope.medics.stocks, function (value) {
                    if (value.id == $scope.medicId) {
                        $scope.medic = value;
                    }
                })
            });
        });

        $scope.medicId = $routeParams.medicId;
        $scope.add = function (amount) {
            this.medic.stock += amount;
            $medics.save(this.medics);
        }
    }]);
