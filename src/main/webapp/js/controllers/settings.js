'use strict';
angular.module('Medixx').controller('SettingsCtrl', ['$scope', '$routeParams', '$medics', '$log',
    function ($scope, $routeParams, $medics, $log) {
        $scope.reset = function () {
            $medics.reset();
        }
        $scope.resetLocal = function () {
            $medics.resetLocal();
        }
        $scope.cacheReload = function () {

            function forceReload() {
                $log.debug("Cache perform swap");
                window.applicationCache.swapCache();
                $log.debug("Cache trigger reload");
                window.location.reload(true);
            }

            $log.debug("Cache status", window.applicationCache.status);
            $log.debug("Cache register handler for updateready", window.applicationCache.status);
            window.applicationCache.addEventListener('updateready', function () {
                $log.debug("Cache updateready event");
                if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
                    forceReload()
                }
            });

            $log.debug("Cache status expect", window.applicationCache.UPDATEREADY, "actual", window.applicationCache.status);
            $log.debug("Cache request update");
            if (window.applicationCache.UPDATEREADY == window.applicationCache.status){
                window.applicationCache.update();
            }
            $log.debug("Cache status", window.applicationCache.status);

            window.location.reload(true);
        }
    }]);

