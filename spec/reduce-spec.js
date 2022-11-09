'use strict';

const Promise = require('../index');
const { resolves, rejects } = require('./promises');

describe('reduce tests', () => {

  it('should sum elements in array', done => {
    return Promise.reduce([1,2,3,4,5].map(i => resolves(i)), (acc, v) => acc+v)
    .then(result => {
      expect(result).toBe(15);
    })
    .catch(fail)
    .finally(done);
  });

  it('should concatenate strings', done => {
    const letters = 'abcde';
    return Promise.reduce([1,2,3,4,5].map(i => resolves(letters[i-1])), (acc, letter) => `${acc}${letter}`, '')
      .then(result => expect(result).toBe('abcde'))
      .catch(fail)
        .finally(done);
  });

  it('should concatenate strings with function that returns promise', done => {
    const letters = 'abcde';
    return Promise.reduce([1,2,3,4,5].map(i => resolves(letters[i-1])), (acc, letter) => Promise.resolve(`${acc}${letter}`), '')
      .then(result => expect(result).toBe('abcde'))
      .catch(fail)
        .finally(done);
  });

  describe("Promise tests", () => {
    it('should sum elements in array', done => {
      return Promise.reduce(Promise.resolve([1,2,3,4,5].map(i => resolves(i))), (acc, v) => acc+v)
        .then(result => {
          expect(result).toBe(15);
        })
        .catch(fail)
          .finally(done);
    });

    it('should concatenate strings', done => {
      const letters = 'abcde';
      return Promise.reduce(Promise.resolve([1,2,3,4,5].map(i => resolves(letters[i-1]))), (acc, letter) => `${acc}${letter}`, '')
        .then(result => expect(result).toBe('abcde'))
        .catch(fail)
          .finally(done);
    });

  });

  describe("method tests", () => {
    it('should sum elements in array', done => {
      return Promise.resolve([1,2,3,4,5].map(i => resolves(i))).reduce((acc, v) => acc+v)
        .then(result => {
          expect(result).toBe(15);
        })
        .catch(fail)
          .finally(done);
    });

    it('should concatenate strings', done => {
      const letters = 'abcde';
      return Promise.resolve([1,2,3,4,5].map(i => resolves(letters[i-1]))).reduce((acc, letter) => `${acc}${letter}`, '')
        .then(result => expect(result).toBe('abcde'))
        .catch(fail)
          .finally(done);
    });

  });

  describe('async iterator tests', () => {
    it('should add elements using an async iterator', done => {
      async function* g(items) {
        for(let item of items) {
          yield Promise.resolve(item);
        }
        return;
      }
      return Promise.reduce(g([1,2,3]), (acc, i) => acc+i, 0).then(result => {
        expect(result).toBe(6);
      }).catch(fail)
        .finally(done);
    });
  });

  it('should throw on trying to reduce non-iterable object', done => {
    return Promise.reduce(3, (acc, i) => acc.concat(i), []).then(fail).catch(error => expect(error instanceof TypeError).toBe(true)).finally(done);
  });

  it('should throw on trying to reduce promise of non-iterable object', done => {
    return Promise.reduce(Promise.resolve(3), (acc, i) => acc.concat(i), []).then(fail).catch(error => expect(error instanceof TypeError).toBe(true)).finally(done);
  });

});
