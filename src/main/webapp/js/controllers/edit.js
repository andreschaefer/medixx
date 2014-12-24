'use strict';

angular.module('Medixx').controller('EditCtrl', ['$scope', '$routeParams', '$medics', '$location',
    function ($scope, $routeParams, $medics, $location) {
        $scope.medics = $medics.get();
        $scope.medicId = $routeParams.medicId;
        $scope.isNew = false;

        $scope.medic = null;
        angular.forEach($scope.medics.stocks, function (value) {
            if (value.id == $scope.medicId) {
                $scope.medic = value;
            }
        })

        if (!$scope.medic) {
            $scope.medicId = (Math.random() + 1).toString(36)
            var stock = {
                id: $scope.medicId,
                name: "",
                stock: 0,
                consumption: 1,
                package: 100,
                date: new Date()
            }
            $scope.medic = stock;
            $scope.isNew = true;
        }

        $scope.save = function () {
            if (this.isNew) {
                this.medic.id = this.medic.name.toLocaleLowerCase().replace(/\W/g, "-");
                this.medics.stocks.push(this.medic);
            }
            $medics.save();
            $location.path("/list");
        }
        $scope.delete = function () {
            console.log("before delete",$scope.medics);
            $scope.medics.stocks = $.grep($scope.medics.stocks, function (item) {
                return item.id != $scope.medicId;
            });
            console.log("after delete",$scope.medics);
            $medics.save();
            $location.path("/list");
        }
    }]);


