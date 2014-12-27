'use strict';
angular.module('Medixx').controller('SettingsCtrl', ['$scope', '$routeParams', '$medics', '$log',
    function ($scope, $routeParams, $medics, $log) {
        $scope.version = app.version;
        $scope.build = app.build;
        $scope.reset = function () {
            $medics.reset();
        }
        $scope.resetLocal = function () {
            $medics.resetLocal();
        }
        $scope.cacheReload = function () {
            $log.debug("Cache status", window.applicationCache);
            window.applicationCache.addEventListener('updateready', function () {
                $log.debug("Cache update ready received", window.applicationCache);
                window.location.reload(true);
            });

            $log.debug("Cache request update");
            window.applicationCache.update();
            window.location.reload(true);
        }
    }]);

