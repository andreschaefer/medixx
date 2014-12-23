'use strict';
angular.module('Medixx').controller('SettingsCtrl', ['$scope', '$routeParams', '$medics',
    function ($scope, $routeParams, $medics) {
        $scope.reset = function () {
            $medics.reset();
        }
        $scope.resetLocal = function () {
            $medics.resetLocal();
        }
        $scope.resetRemote = function () {
            $medics.resetRemote();
        }
    }]);

