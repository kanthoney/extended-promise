'use strict';

const Promise = require('../index');
const { resolves, rejects } = require('./promises');

describe('props tests', () => {

  it('should resolve object of promises', done => {
    const letters = 'abcde';
    Promise.props([1,2,3,4,5].reduce((acc, i) => Object.assign(acc, { [letters[i-1]]: resolves(i) }), {}))
    .then(result => {
      expect(result).toEqual({ a: 1, b: 2, c: 3, d: 4, e: 5 });
    })
    .catch(fail)
    .finally(done);
  });

  it('should reject on third promise', done => {
    const letters = 'abcde';
    Promise.props([1,2,3,4,5].reduce((acc, i) => Object.assign(acc, { [letters[i-1]]: i==3?rejects('error'):resolves(i) }), {}))
    .then(fail)
    .catch(error => expect(error).toBe('error'))
    .finally(done);
  });

  it('should resolve object of promises which resolve in reverse order', done => {
    const letters = 'abcde';
    Promise.props([1,2,3,4,5].reduce((acc, i) => Object.assign(acc, { [letters[i-1]]: resolves(i, 100-20*i) }), {}))
    .then(result => {
      expect(result).toEqual({ a: 1, b: 2, c: 3, d: 4, e: 5 });
    })
    .catch(fail)
    .finally(done);
  });

  it('should resolve object of promises with concurrency of 2', done => {
    const letters = 'abcde';
    Promise.props([1,2,3,4,5].reduce((acc, i) => Object.assign(acc, { [letters[i-1]]: resolves(i, 100-20*i) }), {}), { concurrency: 2 })
    .then(result => {
      expect(result).toEqual({ a: 1, b: 2, c: 3, d: 4, e: 5 });
    })
    .catch(fail)
    .finally(done);
  });

});
