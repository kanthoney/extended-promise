'use strict';

const Promise = require('../extended-promise');
const { resolves, rejects } = require('./promises');

describe("Tap tests", () => {

  it('should return 5', done => {
    resolves(5)
    .tap(result => result + 1)
    .tap(result => Promise.resolve(result + 1))
    .then(result => {
      expect(result).toBe(5);
    })
    .catch(fail)
    .finally(done);
  });

  it('should reject', done => {
    rejects('error')
    .tap(result => fail('Expected rejection'))
    .catch(error => expect(error).toBe('error'))
    .finally(done);
  });

  it('Should reject on throw', done => {
    resolves(5)
    .tap(result => {
      throw('error');
    })
    .then(fail)
    .catch(error => expect(error).toBe('error'))
    .finally(done);
  });

  it('should reject with error thrown in tap', done => {
    resolves(5)
    .tap(result => {
      throw 'error';
    })
    .then(fail)
    .catch(error => expect(error).toBe('error'))
    .finally(done);
  });

});
