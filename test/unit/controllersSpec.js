'use strict';

/* jasmine specs for controllers go here */
describe('medixx controllers', function() {

  beforeEach(function(){
    this.addMatchers({
      toEqualData: function(expected) {
        return angular.equals(this.actual, expected);
      }
    });
  });

  beforeEach(module('medixxApp'));
  beforeEach(module('medixxServices'));

  describe('MedicListCtrl', function(){
    var scope, ctrl, $httpBackend;

    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('medics/medics.json').
          respond([{name: 'Nexus S'}, {name: 'Motorola DROID'}]);

      scope = $rootScope.$new();
      ctrl = $controller('MedicListCtrl', {$scope: scope});
    }));


    it('should create "medics" model with 2 medics fetched from xhr', function() {
      expect(scope.medics).toEqualData([]);
      $httpBackend.flush();

      expect(scope.medics).toEqualData(
          [{name: 'Nexus S'}, {name: 'Motorola DROID'}]);
    });


    it('should set the default value of orderProp model', function() {
      expect(scope.orderProp).toBe('age');
    });
  });


  describe('MedicDetailCtrl', function(){
    var scope, $httpBackend, ctrl,
        xyzMedicData = function() {
          return {
            name: 'medic xyz',
                images: ['image/url1.png', 'image/url2.png']
          }
        };


    beforeEach(inject(function(_$httpBackend_, $rootScope, $routeParams, $controller) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('medics/xyz.json').respond(xyzMedicData());

      $routeParams.medicId = 'xyz';
      scope = $rootScope.$new();
      ctrl = $controller('MedicDetailCtrl', {$scope: scope});
    }));


    it('should fetch medic detail', function() {
      expect(scope.medic).toEqualData({});
      $httpBackend.flush();

      expect(scope.medic).toEqualData(xyzMedicData());
    });
  });
});
