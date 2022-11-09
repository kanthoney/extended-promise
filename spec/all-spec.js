'use strict';

const Promise = require('../index');
const { resolves, rejects } = require('./promises');

describe("all tests", () => {

  it("should execute all promises", done => {
    Promise.all([1,2,3,4,5].map(i => resolves(i))).then(result => {
      expect(result).toEqual([1,2,3,4,5]);
    }).catch(fail).finally(done);
  });

  it("should reject on third promise promises", done => {
    Promise.all([1,2,3,4,5].map(i => i===3?rejects(i):resolves(i)))
      .then(fail)
      .catch(error => {
        expect(error).toBe(3);
      }).finally(done);
  });

  describe("method tests", () => {
    it("should execute all promises", done => {
      Promise.resolve([1,2,3,4,5].map(i => resolves(i))).all().then(result => {
        expect(result).toEqual([1,2,3,4,5]);
      }).catch(fail).finally(done);
    });
    
    it("should reject on third promise promises", done => {
      Promise.resolve([1,2,3,4,5].map(i => i===3?rejects(i):resolves(i))).all()
        .then(fail)
        .catch(error => {
          expect(error).toBe(3);
        }).finally(done);
    });

  });

  it('should throw on trying to run all on non-iterable object', done => {
    return Promise.all(3).then(fail).catch(error => expect(error instanceof TypeError).toBe(true)).finally(done);
  });

  it('should throw on trying to run all on promise of non-iterable object', done => {
    return Promise.all(Promise.resolve(3)).then(fail).catch(error => expect(error instanceof TypeError).toBe(true)).finally(done);
  });

});
