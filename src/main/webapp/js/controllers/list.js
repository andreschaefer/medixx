'use strict';
angular.module('Medixx').controller('ListCtrl', ['$scope', '$log', '$routeParams', '$medics',

    function ($scope, $log, $routeParams, $medics) {
        $medics.get($routeParams.userId, function (user) {
            $scope.$apply(function () {
                $scope.user = user;
            });
        });

        $scope.userId = $routeParams.userId;
        $scope.orderProp = 'name';
    }
]);