'use strict';
angular.module('Medixx').controller('ListCtrl', ['$scope', '$log', '$routeParams', '$medics', '$location',

    function ($scope, $log, $routeParams, $medics, $location) {
        $scope.medics = $medics.get();
        $scope.orderProp = 'name';
        $scope.go = function (path) {
            $location.path(path);
        };
        $scope.sort = function (propery) {
            $scope.orderProp = propery;
        };
        $scope.sorted = function(property){
            return $scope.orderProp == property;
        }
    }
]);