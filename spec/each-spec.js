'use strict';

const Promise = require('../index');
const { resolves, rejects } = require('./promises');

describe('each tests', () => {

  it('should process each record in array of promises', done => {
    const letters = 'abcde';
    let result = '';
    Promise.each([1,2,3,4,5].map(i => resolves(letters[i-1])), letter => result = letter)
    .then(r => {
      expect(r).toBeUndefined();
      expect(result).toBe('e');
    })
    .catch(fail)
    .finally(done);
  });

  it('should reject on the third promise', done => {
    const letters = 'abcde';
    let result = '';
    Promise.each([1,2,3,4,5].map(i => i==3?rejects('error'):resolves(i)), letter => result = letter)
    .then(fail)
    .catch(error => expect(error).toBe('error'))
    .finally(done);
  });

  it('should process promises which resolve in reverse order', done => {
    const letters = 'abcde';
    let result = '';
    Promise.each([1,2,3,4,5].map(i => resolves(letters[i-1], 100-20*i)), letter => result = `${result}${letter}`)
    .then(r => {
      expect(r).toBeUndefined();
      expect(result).toBe('edcba');
    })
    .catch(fail)
    .finally(done);
  });

  it('should process array of promises with concurrency of 2', done => {
    const letters = 'abcde';
    let result = '';
    Promise.each([1,2,3,4,5].map(i => resolves(letters[i-1])), letter => result = letter, { concurrency: 2 })
    .then(r => {
      expect(r).toBeUndefined();
      expect(result).toBe('e');
    })
    .catch(fail)
    .finally(done);
  });

  it('should process a mixed array of promises and values', done => {
    const letters = 'abcde';
    let result = '';
    Promise.each([1,2,3,4,5].map(i => i%2===0?letters[i-1]:Promise.resolve(letters[i-1])), letter => result = letter)
    .then(r => {
      expect(r).toBeUndefined();
      expect(result).toBe('e');
    })
    .catch(fail)
    .finally(done);
  });

});
