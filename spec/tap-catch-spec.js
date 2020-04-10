'use strict';

const { resolves, rejects } = require('./promises');

describe('tap-catch tests', () => {

  it('should not execute tap catch', done => {
    resolves(5)
    .tapCatch(fail)
    .then(result => expect(result).toBe(5))
    .finally(done);
  });

  it('should execute tapCatch on reject', done => {
    rejects('error')
    .tapCatch(error => {
      expect(error).toBe('error');
      return 'success';
    })
    .then(fail)
    .catch(error => {
      expect(error).toBe('error');
    })
    .finally(done);
  });

  it('should execute tapCatch on throw', done => {
    resolves('5')
    .then(result => {
      throw 'error';
    })
    .then(fail)
    .tapCatch(error => expect(error).toBe('error'))
    .then(fail)
    .catch(error => expect(error).toBe('error'))
    .finally(done);
  });

  it('should reject on error thrown in tapCatch', done => {
    rejects('error1')
    .tapCatch(error => {
      expect(error).toBe('error1');
      throw 'error2';
    })
    .then(fail)
    .catch(error => expect(error).toBe('error2'))
    .finally(done);
  });

});
