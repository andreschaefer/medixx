'use strict';

/* Controllers */

var medixxControllers = angular.module('medixxControllers', []);

medixxControllers.controller('MedicListCtrl', ['$scope', '$log','Medic',
    function ($scope, $log, Medic) {
        $scope.user = Medic.query();
        $scope.orderProp = 'name';
    }]);

medixxControllers.controller('MedicDetailCtrl', ['$scope', '$routeParams', 'Medic',
    function ($scope, $routeParams, Medic) {
        $scope.medic = Medic.get({medicId: $routeParams.medicId}, function (medic) {
            $scope.mainImageUrl = medic.images[0];
        });

        $scope.setImage = function (imageUrl) {
            $scope.mainImageUrl = imageUrl;
        }
    }]);
