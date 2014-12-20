'use strict';

describe('service', function() {

  // load modules
  beforeEach(module('medixxApp'));

  // Test service availability
  it('check the existence of Medic factory', inject(function(Medic) {
      expect(Medic).toBeDefined();
    }));
});