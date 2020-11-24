'use strict';

const Promise = require('../index');
const { resolves, rejects } = require('./promises');

describe('delay tests', () => {

  it('should create a promise delayed by 100ms', done => {
    const now = new Date();
    Promise.delay(100, 'test').then(value => {
      const d = (new Date()).getTime() - now.getTime()
      expect(Math.abs(d - 100)).toBeLessThan(20);
      expect(value).toBe('test');
    }).catch(fail).finally(done);
  });

  it('should delay a promise by 100ms', done => {
    let start;
    resolves('test')
      .tap(() => start = new Date()).delay(100)
      .then(value => {
        expect(value).toBe('test');
        expect(Math.abs((new Date()).getTime() - start.getTime() - 100)).toBeLessThan(20);
      }).catch(fail).finally(done);
  });
});
