'use strict';

angular.module('Medixx').controller('DetailCtrl', ['$scope', '$routeParams', '$medics',
    function ($scope, $routeParams, $medics) {
        $scope.medics = $medics.get();
        $scope.medicId = $routeParams.medicId;
        $scope.add = function (amount) {
            this.medic.stock += amount;
            $medics.save();
        }
    }]);
