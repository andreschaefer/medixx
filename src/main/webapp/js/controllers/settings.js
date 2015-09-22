'use strict';
angular.module('Medixx').controller('SettingsCtrl', ['$scope', '$routeParams', '$medics', '$log',
    function ($scope, $routeParams, $medics, $log) {
        $scope.version = app.version;
        $scope.build = app.build;
        $scope.reset = function () {
            $medics.reset();
        };
        $scope.resetLocal = function () {
            $medics.resetLocal();
        };
        $scope.cacheReload = function () {
            window.location.reload(true);
        };
        $scope.logout = function () {
            window.location.href="https://accounts.google.com/Logout";
        };
    }]);

