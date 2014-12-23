'use strict';
angular.module('Medixx').controller('ListCtrl', ['$scope', '$log', '$routeParams', '$medics',

    function ($scope, $log, $routeParams, $medics) {
        $scope.medics = $medics.get();
        $scope.orderProp = 'name';
    }
]);