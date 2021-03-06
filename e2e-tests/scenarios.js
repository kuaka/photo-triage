'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

/* Note: this runs against the app, for real, as it were - as started by 'npm start'.
   It uses the photos in sample-photos (see package.json).
*/

var path = require('path'), fs = require('fs');

describe('my app', function() {

  browser.get('index.html');

  it('should automatically redirect to / when location hash/fragment is empty', function() {
    expect(browser.getLocationAbsUrl()).toMatch("/");
  });


  describe('view1', function() {

    beforeEach(function() {
      browser.get('index.html#/').then(function() {
          element(by.css('body')).sendKeys("r");  // reset all ratings at beginning of each test
        }
      );
    });


    it('should render view1 when user navigates to /', function() {
      expect(element(by.css('.caption .info')).isDisplayed()).toEqual(true);
    });

    it('should render the first photo at /', function() {
      expect(element(by.css('.photo')).isDisplayed()).toEqual(true);
      expect(element(by.css('.caption .info')).getText()).toEqual('1 of 2');
    });

    // tests for next/prev
    it('should step next/prev', function() {
      element(by.css('body')).sendKeys(protractor.Key.ARROW_RIGHT);
      expect(element(by.css('.caption .info')).getText()).toEqual('2 of 2');

      element(by.css('body')).sendKeys(protractor.Key.ARROW_RIGHT);
      expect(element(by.css('.caption .info')).getText()).toEqual('1 of 2');

      element(by.css('body')).sendKeys(protractor.Key.ARROW_LEFT);
      expect(element(by.css('.caption .info')).getText()).toEqual('2 of 2');

      element(by.css('body')).sendKeys(protractor.Key.ARROW_LEFT);
      expect(element(by.css('.caption .info')).getText()).toEqual('1 of 2');
    });

    // tests for star clicks
    it('should rate photos', function() {
      expect(element.all(by.css('.glyphicon-star-empty')).count()).toEqual(3);
      
      element(by.css('.star1')).click();  // equivalent to rating 2
      expect(element.all(by.css('.glyphicon-star')).count()).toEqual(2);
      expect(element.all(by.css('.glyphicon-star-empty')).count()).toEqual(1);

      element(by.css('body')).sendKeys(protractor.Key.ARROW_RIGHT);
      expect(element.all(by.css('.glyphicon-star-empty')).count()).toEqual(3);

      element(by.css('.star2')).click();  // equivalent to rating 3
      expect(element.all(by.css('.glyphicon-star')).count()).toEqual(3);
      expect(element.all(by.css('.glyphicon-star-empty')).count()).toEqual(0);

      element(by.css('body')).sendKeys(protractor.Key.ARROW_LEFT);
      expect(element.all(by.css('.glyphicon-star')).count()).toEqual(2);
      expect(element.all(by.css('.glyphicon-star-empty')).count()).toEqual(1);

    });

    //tests for keyboard
    it('should react to keyboard', function() {
      expect(element(by.css('.caption .info')).getText()).toEqual('1 of 2');
      element(by.css('body')).sendKeys(protractor.Key.ARROW_RIGHT);
      expect(element(by.css('.caption .info')).getText()).toEqual('2 of 2');
      expect(element.all(by.css('.glyphicon-star')).count()).toEqual(0);

      element(by.css('body')).sendKeys("2");
      expect(element.all(by.css('.glyphicon-star')).count()).toEqual(2);

      element(by.css('body')).sendKeys("0");
      expect(element.all(by.css('.glyphicon-star')).count()).toEqual(0);

    });

    // test for .save
    it('should save to ratings.json', function(done) {
      var ratingsJson = path.resolve(__dirname + '/../sample-photos/ratings.json');
      // ratings are all zero to begin with
      // delete ratings.json if it exists
      if (fs.existsSync(ratingsJson)) {
        fs.unlinkSync(ratingsJson);
      }
      expect(fs.existsSync(ratingsJson)).toEqual(false);

      // rate photo 1 with 2 stars
      element(by.css('.star1')).click();  // equivalent to rating 2
      expect(element.all(by.css('.glyphicon-star')).count()).toEqual(2);

      // hit save
      expect(element(by.css('.save')).getText()).toEqual('Save');
      element(by.css('.save')).click();  // s for save
      
      // ensure ratings.json.  Yuck - have to wait 1 sec for fs.existsSync to behave
      setTimeout(function() {
        expect(fs.existsSync(ratingsJson)).toEqual(true);
        // tidy up
        fs.unlinkSync(ratingsJson);
        done();
      }, 1000);
      

    });


  });


});
