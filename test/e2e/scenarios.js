'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('medixx App', function() {

  it('should redirect index.html to index.html#/medics', function() {
    browser.get('app/index.html');
    browser.getLocationAbsUrl().then(function(url) {
        expect(url.split('#')[1]).toBe('/medics');
      });
  });


  describe('Medic list view', function() {

    beforeEach(function() {
      browser.get('app/index.html#/medics');
    });


    it('should filter the medic list as a user types into the search box', function() {

      var medicList = element.all(by.repeater('medic in medics'));
      var query = element(by.model('query'));

      expect(medicList.count()).toBe(20);

      query.sendKeys('nexus');
      expect(medicList.count()).toBe(1);

      query.clear();
      query.sendKeys('motorola');
      expect(medicList.count()).toBe(8);
    });


    it('should be possible to control medic order via the drop down select box', function() {

      var medicNameColumn = element.all(by.repeater('medic in medics').column('medic.name'));
      var query = element(by.model('query'));

      function getNames() {
        return medicNameColumn.map(function(elm) {
          return elm.getText();
        });
      }

      query.sendKeys('tablet'); //let's narrow the dataset to make the test assertions shorter

      expect(getNames()).toEqual([
        "Motorola XOOM\u2122 with Wi-Fi",
        "MOTOROLA XOOM\u2122"
      ]);

      element(by.model('orderProp')).element(by.css('option[value="name"]')).click();

      expect(getNames()).toEqual([
        "MOTOROLA XOOM\u2122",
        "Motorola XOOM\u2122 with Wi-Fi"
      ]);
    });


    it('should render medic specific links', function() {
      var query = element(by.model('query'));
      query.sendKeys('nexus');
      element.all(by.css('.medics li a')).first().click();
      browser.getLocationAbsUrl().then(function(url) {
        expect(url.split('#')[1]).toBe('/medics/nexus-s');
      });
    });
  });


  describe('Medic detail view', function() {

    beforeEach(function() {
      browser.get('app/index.html#/medics/nexus-s');
    });


    it('should display nexus-s page', function() {
      expect(element(by.binding('medic.name')).getText()).toBe('Nexus S');
    });


    it('should display the first medic image as the main medic image', function() {
      expect(element(by.css('img.medic.active')).getAttribute('src')).toMatch(/img\/medics\/nexus-s.0.jpg/);
    });


    it('should swap main image if a thumbnail image is clicked on', function() {
      element(by.css('.medic-thumbs li:nth-child(3) img')).click();
      expect(element(by.css('img.medic.active')).getAttribute('src')).toMatch(/img\/medics\/nexus-s.2.jpg/);

      element(by.css('.medic-thumbs li:nth-child(1) img')).click();
      expect(element(by.css('img.medic.active')).getAttribute('src')).toMatch(/img\/medics\/nexus-s.0.jpg/);
    });
  });
});
