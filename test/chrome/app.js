import webdriver from 'selenium-webdriver';
import expect from 'expect';
import { check, doBefore, doAfter } from '../shared/functions';
import * as Test from '../shared/tests';
import { appName, appTitle } from '../config';

let appHandle;

describe('Chrome app window', function() {
  this.timeout(15000);

  before(function(done) {
    doBefore.call(this, done, () => {
      this.timeout(30000);
      return this.driver.get('chrome://extensions-frame').then(() => {
        const launchLink = this.driver.findElement(webdriver.By.className('launch-link'));
        launchLink.getText().then((val) => {
          expect(val).toBe('Launch');
        });
        launchLink.click();
        return this.driver.wait(() =>
            this.driver.getAllWindowHandles()
              .then(windows => {
                if (windows.length > 1) {
                  appHandle = windows[1];
                  return true;
                }
                launchLink.click();
                return false;
              })
          , 25000, 'Chrome app not launched');
      });
    }, './build/app');
  });

  after(doAfter);

  it('should switch to app\'s handle', function(done) {
    expect(appHandle).toExist();

    this.driver.switchTo().window(appHandle).then(() => {
      this.driver.getWindowHandle().then(
          (handle) => {
            expect(handle).toEqual(appHandle);
            done();
          });
    });
  });

  Test.hasTitle(appTitle);
  Test.hasValue(0);
  Test.clickButtons(0);

});
