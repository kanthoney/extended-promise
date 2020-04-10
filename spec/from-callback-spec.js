'use strict';

const Promise = require('../index');

const succeeds = (val, done) => {
  setTimeout(() => {
    done(null, val);
  }, 0);
}

const fails = (error, done) => {
  setTimeout(() => {
    done(error);
  }, 0);
}

describe('fromCallback tests', () => {

  it('should resolve with 5', done => {
    return Promise.fromCallback(finish => {
      succeeds(5, finish);
    })
    .then(result => expect(result).toBe(5))
    .catch(fail)
    .finally(done);
  });

  it('should reject with error', done => {
    return Promise.fromCallback(finish => {
      fails('error', done);
    })
    .then(fail)
    .catch(error => expect(error).toBe('error'))
    .finally(done);
  });

});
