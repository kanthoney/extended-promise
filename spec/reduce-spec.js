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

});
