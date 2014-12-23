'use strict';

angular.module('Medixx').controller('DetailCtrl', ['$scope', '$routeParams', '$medics',
    function ($scope, $routeParams, $medics) {
        $medics.get($routeParams.userId, function (user) {
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
            $medics.save($scope.user);
        }
    }]);
