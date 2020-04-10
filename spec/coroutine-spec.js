'use strict';

const Promise = require('../index');
const { resolves, rejects } = require('./promises');

describe('coroutine tests', () => {

  it('should process generator function', done => {
    const f = function*(i, n) {
      let a = 0;
      while(i < n) {
        a += yield resolves(i++);
      }
      return a;
    }
    Promise.coroutine(f)(1,50)
    .then(result => {
      expect(result).toBe(1225);
    })
    .catch(fail)
    .finally(done);
  });

  it('should process generator function which returns a mixture of promises and values', done => {
    const f = function*(i, n) {
      let a = 0;
      while(i < n) {
        a += yield i%3==0?i++:resolves(i++);
      }
      return a;
    }
    Promise.coroutine(f)(1, 50)
    .then(result => {
      expect(result).toBe(1225);
    })
    .catch(fail)
    .finally(done);
  });

  it('should reject on 10th yielded promise', done => {
    const f = function*(i, n) {
      let a = 0;
      while(i < n) {
        a += yield i%3==0?i++:i==10?rejects('error'):resolves(i++);
      }
      return a;
    }
    Promise.coroutine(f)(1, 50)
    .then(fail)
    .catch(error => expect(error).toBe('error'))
    .finally(done);
  });

  it('should reject on first yielded promise', done => {
    const f = function*(i, n) {
      let a = 0;
      while(i < n) {
        a += yield rejects(`error${i++}`);
      }
      return a;
    }
    Promise.coroutine(f)(1, 50)
    .then(fail)
    .catch(error => expect(error).toBe('error1'))
    .finally(done);
  });

  it('should reject on throw in generator function', done => {
    const f = function*(i, n) {
      let a = 0;
      while(i < n) {
        a += yield resolves(i);
        if(a > 10) {
          throw 'error';
        }
      }
      return a;
    }
    Promise.coroutine(f)(1, 50)
    .then(fail)
    .catch(error => expect(error).toBe('error'))
    .finally(done);
  });

  it('should reject after final result obtained', done => {
    const f = function*(i, n) {
      let a = 0;
      while(i < n) {
        a += yield resolves(i++);
      }
      return rejects('error');
    }
    Promise.coroutine(f)(1, 50)
    .then(fail)
    .catch(error => expect(error).toBe('error'))
    .finally(done);
  });

});
