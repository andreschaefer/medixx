'use strict';
angular.module('Medixx').controller('ListCtrl', ['$scope', '$log', '$routeParams', '$medics',

    function ($scope, $log, $routeParams, $medics) {
        $medics.get( function (medics) {
            $scope.$apply(function () {
                $scope.medics = medics;
            });
        });
        $scope.orderProp = 'name';
    }
]);