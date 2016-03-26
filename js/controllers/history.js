'use strict';
angular.module('Medixx').controller('HistoryCtrl', ['$scope', '$log', '$routeParams', '$medics', '$location',

    function ($scope, $log, $routeParams, $medics, $location) {
        $scope.history = $medics.history();
        $scope.restore = function (entry) {
            $medics.replace(entry.medics);
        };
    }
]);