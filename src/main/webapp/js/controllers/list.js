'use strict';
angular.module('Medixx').controller('ListCtrl', ['$scope', '$log', '$routeParams', '$medics','$location',

    function ($scope, $log, $routeParams, $medics,$location) {
        $scope.medics = $medics.get();
        $scope.orderProp = 'name';
        $scope.go = function (path) {
            $location.path(path);
        };
    }
]);