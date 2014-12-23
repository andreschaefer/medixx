'use strict';

angular.module('Medixx').controller('DetailCtrl', ['$scope', '$routeParams', '$medics',
    function ($scope, $routeParams, $medics) {
        $scope.medics = $medics.get();
        $scope.medicId = $routeParams.medicId;
        $scope.medic = null;
        angular.forEach($scope.medics.stocks, function (value) {
            if (value.id == $scope.medicId) {
                $scope.medic = value;
            }
        })
        $scope.add = function (amount) {
            this.medic.stock += amount;
            $medics.save();
        }
    }]);
