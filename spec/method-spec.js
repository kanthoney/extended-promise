'use strict';

const Promise = require('../extended-promise.js');
const { resolves, rejects } = require('./promises');

describe('method tests', () => {

  it('should produce a function that returns a promise', done => {
    const f = Promise.method(i => 2*i);
    f(1)
    .then(result => {
      expect(result).toBe(2);
    })
    .catch(fail)
    .finally(done);
  });

  it('should produce a promise returning function from a function that already returns a promise', done => {
    const f = Promise.method(i => resolves(2*i));
    f(1)
    .then(result => expect(result).toBe(2))
    .catch(fail)
    .finally(done);
  });

  it('should reject when function throws', done => {
    const f = Promise.method(i => {
      throw 'error';
    });
    f(1)
    .then(fail)
    .catch(error => expect(error).toBe('error'))
    .finally(done);
  });

  it('should reject when function rejects', done => {
    const f = Promise.method(i => rejects('error'));
    f(1)
    .then(fail)
    .catch(error => expect(error).toBe('error'))
    .finally(done);
  });

});
