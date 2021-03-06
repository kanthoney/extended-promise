'use strict';

const Promise = require('../index');
const { resolves, rejects } = require('./promises');

describe('filter tests', () => {

  it('should filter even numbers', done => {
    Promise.filter([1,2,3,4,5], i => resolves(i%2 === 0))
    .then(result => expect(result).toEqual([2,4]))
    .catch(fail)
    .finally(done);
  });

  it('should reject on third promise', done => {
    Promise.filter([1,2,3,4,5], i => i===3?rejects('error'):resolves(i%2 === 0))
    .then(fail)
    .catch(error => expect(error).toBe('error'))
    .finally(done);
  });

  it('should throw error on third promise', done => {
    Promise.filter([1,2,3,4,5], i => {
      if(i===3) {
        throw 'error';
      }
      return resolves(i%2 === 0);
    })
      .then(fail)
      .catch(error => expect(error).toBe('error'))
        .finally(done);
  });

  describe("promise tests", () => {
    it('should filter even numbers', done => {
      Promise.filter(Promise.resolve([1,2,3,4,5]), i => resolves(i%2 === 0))
        .then(result => expect(result).toEqual([2,4]))
        .catch(fail)
          .finally(done);
    });

    it('should reject on third promise', done => {
      Promise.filter(Promise.resolve([1,2,3,4,5]), i => i===3?rejects('error'):resolves(i%2 === 0))
        .then(fail)
        .catch(error => expect(error).toBe('error'))
          .finally(done);
    });

    it('should throw error on third promise', done => {
      Promise.filter(Promise.resolve([1,2,3,4,5]), i => {
        if(i===3) {
          throw 'error';
        }
        return resolves(i%2 === 0);
      })
        .then(fail)
        .catch(error => expect(error).toBe('error'))
          .finally(done);
    });

  });

  describe("method tests", () => {
    it('should filter even numbers', done => {
      Promise.resolve([1,2,3,4,5]).filter(i => resolves(i%2 === 0))
        .then(result => expect(result).toEqual([2,4]))
        .catch(fail)
          .finally(done);
    });

    it('should reject on third promise', done => {
      Promise.resolve([1,2,3,4,5]).filter(i => i===3?rejects('error'):resolves(i%2 === 0))
        .then(fail)
        .catch(error => expect(error).toBe('error'))
          .finally(done);
    });

    it('should throw error on third promise', done => {
      Promise.resolve([1,2,3,4,5]).filter(i => {
        if(i===3) {
          throw 'error';
        }
        return resolves(i%2 === 0);
      })
        .then(fail)
        .catch(error => expect(error).toBe('error'))
          .finally(done);
    });

  });

});
