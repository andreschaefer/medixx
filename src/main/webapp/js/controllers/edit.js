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
                package: 20,
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
            if (!this.isNew) {
                this.medics.stocks.splice(this.medics.stocks.indexOf(this.medic), 1);
            }
            $medics.save();
            $location.path("/list");
        }
    }]);


