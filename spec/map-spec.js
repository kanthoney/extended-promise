'use strict';

const Promise = require('../index');
const { resolves, rejects } = require('./promises');

describe('map tests', () => {

  it('should resolve array of promises', done => {
    Promise.map([1,2,3,4,5].map(i => resolves(i)), val => 2*val)
    .then(result => {
      expect(result).toEqual([2,4,6,8,10]);
    })
    .catch(fail)
    .finally(done);
  });

  it('should resolve an array of values', done => {
    Promise.map([1,2,3,4,5], i => resolves(2*i))
    .then(result => expect(result).toEqual([2,4,6,8,10]))
    .catch(fail)
    .finally(done);
  });

  it('should resolve array of promises which resolve in reverse order', done => {
    Promise.map([1,2,3,4,5].map(i => resolves(i, 100-20*i)), val => 2*val)
    .then(result => {
      expect(result).toEqual([2,4,6,8,10]);
    })
    .catch(fail)
    .finally(done);
  });

  it('should map an array of values to promises, which resolve in reverse order', done => {
    Promise.map([1,2,3,4,5], i => resolves(2*i, 100-20*i))
    .then(result => expect(result).toEqual([2,4,6,8,10]))
    .catch(fail)
    .finally(done);
  });

  it('should map an array of values to promises which resolve in reverse order with concurrency of 2', done => {
    Promise.map([1,2,3,4,5], i => resolves(2*i, 100-20*i), { concurrency: 2})
    .then(result => expect(result).toEqual([2,4,6,8,10]))
    .catch(fail)
    .finally(done);
  });

  it('should reject on third promise', done => {
    Promise.map([1,2,rejects('error'),4,5].map(i => Promise.resolve(i)), val => 2*val)
    .then(fail)
    .catch(error => {
      expect(error).toBe('error');
    })
    .finally(done);
  });

  it('should reject on third value', done => {
    Promise.map([1,2,3,4,5], val => val===3?rejects('error'):resolves(2*val))
    .then(fail)
    .catch(error => {
      expect(error).toBe('error');
    })
    .finally(done);
  });

  it('should resolve array of promises with a concurrency of 2', done => {
    return Promise.map([1,2,3,4,5].map(i => resolves(i)), val => 2*val, { concurrency: 2 })
    .then(result => {
      expect(result).toEqual([2,4,6,8,10]);
    })
    .catch(fail)
    .finally(done);
  });

  it('should resolve array of promises which resolve in reverse order with a concurrency of 2', done => {
    return Promise.map([1,2,3,4,5].map(i => resolves(i, 100-20*i)), val => 2*val, { concurrency: 2 })
    .then(result => {
      expect(result).toEqual([2,4,6,8,10]);
    })
    .catch(fail)
    .finally(done);
  });

  describe('mapSeries tests', () => {

    it('should resolve array of promises', done => {
      Promise.mapSeries([1,2,3,4,5].map(i => resolves(i)), val => 2*val)
      .then(result => {
        expect(result).toEqual([2,4,6,8,10]);
      })
      .catch(fail)
      .finally(done);
    });

    it('should resolve an array of values', done => {
      Promise.mapSeries([1,2,3,4,5], i => resolves(2*i))
      .then(result => expect(result).toEqual([2,4,6,8,10]))
      .catch(fail)
      .finally(done);
    });

    it('should resolve array of promises which resolve in reverse order', done => {
      Promise.mapSeries([1,2,3,4,5].map(i => resolves(i, 100-20*i)), val => 2*val)
      .then(result => {
        expect(result).toEqual([2,4,6,8,10]);
      })
      .catch(fail)
      .finally(done);
    });

    it('should map an array of values to promises, which resolve in reverse order', done => {
      Promise.mapSeries([1,2,3,4,5], i => resolves(2*i, 100-20*i))
      .then(result => expect(result).toEqual([2,4,6,8,10]))
      .catch(fail)
      .finally(done);
    });

    it('should reject on third promise', done => {
      Promise.mapSeries([1,2,rejects('error'),4,5].map(i => Promise.resolve(i)), val => 2*val)
      .then(fail)
      .catch(error => {
        expect(error).toBe('error');
      })
      .finally(done);
    });

  });

  describe("promise tests", () => {

    it('should resolve array of promises', done => {
    Promise.map(Promise.resolve([1,2,3,4,5].map(i => resolves(i))), val => 2*val)
        .then(result => {
          expect(result).toEqual([2,4,6,8,10]);
        })
        .catch(fail)
          .finally(done);
    });

    it('should resolve an array of values', done => {
      Promise.map(Promise.resolve([1,2,3,4,5]), i => resolves(2*i))
        .then(result => expect(result).toEqual([2,4,6,8,10]))
        .catch(fail)
          .finally(done);
    });
    
    it('should map an array of values to promises, which resolve in reverse order', done => {
      Promise.map(Promise.resolve([1,2,3,4,5]), i => resolves(2*i, 100-20*i))
        .then(result => expect(result).toEqual([2,4,6,8,10]))
        .catch(fail)
          .finally(done);
    });

    it('should map an array of values to promises which resolve in reverse order with concurrency of 2', done => {
      Promise.map(Promise.resolve([1,2,3,4,5]), i => resolves(2*i, 100-20*i), { concurrency: 2})
        .then(result => expect(result).toEqual([2,4,6,8,10]))
        .catch(fail)
          .finally(done);
    });

    it('should reject on third promise', done => {
      Promise.map(Promise.resolve([1,2,rejects('error'),4,5].map(i => Promise.resolve(i))), val => 2*val)
        .then(fail)
        .catch(error => {
          expect(error).toBe('error');
        })
          .finally(done);
    });

    it('should reject on third value', done => {
      Promise.map(Promise.resolve([1,2,3,4,5]), val => val===3?rejects('error'):resolves(2*val))
        .then(fail)
        .catch(error => {
          expect(error).toBe('error');
        })
          .finally(done);
    });

    it('should resolve array of promises with a concurrency of 2', done => {
      return Promise.map(Promise.resolve([1,2,3,4,5].map(i => resolves(i))), val => 2*val, { concurrency: 2 })
        .then(result => {
          expect(result).toEqual([2,4,6,8,10]);
        })
        .catch(fail)
          .finally(done);
    });

    it('should resolve array of promises which resolve in reverse order with a concurrency of 2', done => {
      return Promise.map(Promise.resolve([1,2,3,4,5].map(i => resolves(i, 100-20*i))), val => 2*val, { concurrency: 2 })
        .then(result => {
          expect(result).toEqual([2,4,6,8,10]);
        })
        .catch(fail)
          .finally(done);
    });

    describe('mapSeries tests', () => {

      it('should resolve array of promises', done => {
        Promise.mapSeries(Promise.resolve([1,2,3,4,5].map(i => resolves(i))), val => 2*val)
          .then(result => {
            expect(result).toEqual([2,4,6,8,10]);
          })
          .catch(fail)
            .finally(done);
      });

      it('should resolve an array of values', done => {
        Promise.mapSeries(Promise.resolve([1,2,3,4,5]), i => resolves(2*i))
          .then(result => expect(result).toEqual([2,4,6,8,10]))
          .catch(fail)
            .finally(done);
      });

      it('should resolve array of promises which resolve in reverse order', done => {
        Promise.mapSeries(Promise.resolve([1,2,3,4,5].map(i => resolves(i, 100-20*i))), val => 2*val)
          .then(result => {
            expect(result).toEqual([2,4,6,8,10]);
          })
          .catch(fail)
            .finally(done);
      });

      it('should map an array of values to promises, which resolve in reverse order', done => {
        Promise.mapSeries(Promise.resolve([1,2,3,4,5]), i => resolves(2*i, 100-20*i))
          .then(result => expect(result).toEqual([2,4,6,8,10]))
          .catch(fail)
            .finally(done);
      });

      it('should reject on third promise', done => {
        Promise.mapSeries(Promise.resolve([1,2,rejects('error'),4,5].map(i => Promise.resolve(i))), val => 2*val)
          .then(fail)
          .catch(error => {
            expect(error).toBe('error');
          })
            .finally(done);
      });

    });
  });

  describe("method tests", () => {

    it('should resolve array of promises', done => {
      Promise.resolve([1,2,3,4,5].map(i => resolves(i))).map(val => 2*val)
        .then(result => {
          expect(result).toEqual([2,4,6,8,10]);
        })
        .catch(fail)
          .finally(done);
    });

    it('should resolve an array of values', done => {
      Promise.resolve([1,2,3,4,5]).map(i => resolves(2*i))
        .then(result => expect(result).toEqual([2,4,6,8,10]))
        .catch(fail)
          .finally(done);
    });

    it('should resolve array of promises which resolve in reverse order', done => {
      Promise.resolve([1,2,3,4,5].map(i => resolves(i, 100-20*i))).map(val => 2*val)
        .then(result => {
          expect(result).toEqual([2,4,6,8,10]);
        })
        .catch(fail)
          .finally(done);
    });

    it('should map an array of values to promises, which resolve in reverse order', done => {
      Promise.resolve([1,2,3,4,5]).map(i => resolves(2*i, 100-20*i))
        .then(result => expect(result).toEqual([2,4,6,8,10]))
        .catch(fail)
          .finally(done);
    });

    it('should map an array of values to promises which resolve in reverse order with concurrency of 2', done => {
      Promise.resolve([1,2,3,4,5]).map(i => resolves(2*i, 100-20*i), { concurrency: 2})
        .then(result => expect(result).toEqual([2,4,6,8,10]))
        .catch(fail)
          .finally(done);
    });

    it('should reject on third promise', done => {
      Promise.resolve([1,2,rejects('error'),4,5].map(i => Promise.resolve(i))).map(val => 2*val)
        .then(fail)
        .catch(error => {
          expect(error).toBe('error');
        })
          .finally(done);
    });

    it('should reject on third value', done => {
      Promise.resolve([1,2,3,4,5]).map(val => val===3?rejects('error'):resolves(2*val))
        .then(fail)
        .catch(error => {
          expect(error).toBe('error');
        })
          .finally(done);
    });

    it('should resolve array of promises with a concurrency of 2', done => {
      return Promise.resolve([1,2,3,4,5].map(i => resolves(i))).map(val => 2*val, { concurrency: 2 })
        .then(result => {
          expect(result).toEqual([2,4,6,8,10]);
        })
        .catch(fail)
          .finally(done);
    });

    it('should resolve array of promises which resolve in reverse order with a concurrency of 2', done => {
      return Promise.resolve([1,2,3,4,5].map(i => resolves(i, 100-20*i))).map(val => 2*val, { concurrency: 2 })
        .then(result => {
          expect(result).toEqual([2,4,6,8,10]);
        })
        .catch(fail)
          .finally(done);
    });

    describe('mapSeries tests', () => {

      it('should resolve array of promises', done => {
        Promise.resolve([1,2,3,4,5].map(i => resolves(i))).mapSeries(val => 2*val)
          .then(result => {
            expect(result).toEqual([2,4,6,8,10]);
          })
          .catch(fail)
            .finally(done);
      });

      it('should resolve an array of values', done => {
        Promise.resolve([1,2,3,4,5]).mapSeries(i => resolves(2*i))
          .then(result => expect(result).toEqual([2,4,6,8,10]))
          .catch(fail)
            .finally(done);
      });

      it('should resolve array of promises which resolve in reverse order', done => {
        Promise.resolve([1,2,3,4,5].map(i => resolves(i, 100-20*i))).mapSeries(val => 2*val)
          .then(result => {
            expect(result).toEqual([2,4,6,8,10]);
          })
          .catch(fail)
            .finally(done);
      });

      it('should map an array of values to promises, which resolve in reverse order', done => {
        Promise.resolve([1,2,3,4,5]).mapSeries(i => resolves(2*i, 100-20*i))
          .then(result => expect(result).toEqual([2,4,6,8,10]))
          .catch(fail)
            .finally(done);
      });

      it('should reject on third promise', done => {
        Promise.resolve([1,2,rejects('error'),4,5].map(i => Promise.resolve(i))).mapSeries(val => 2*val)
          .then(fail)
          .catch(error => {
            expect(error).toBe('error');
          })
            .finally(done);
      });

    });

    describe('async iterator tests', () => {
      async function* g(items)
      {
        for(let item of items) {
          if(item > 3) {
            yield rejects(item);
          } else {
            yield resolves(item);
          }
        }
      }

      it('should square each value of array using async iterator', done => {
        return Promise.map(g([1,2,3]), i => i*i).then(result => {
          expect(result).toEqual([1,4,9]);
        }).catch(fail).finally(done);
      });

      it('should fail to square each value of array using async iterator', async done => {
        return Promise.map(g([1,2,4]), i => i*i).then(fail).catch(error => {
          expect(error).toBe(4);
        }).finally(done);
        
      });

    });
  });

  it('should throw on trying to map non-iterable object', done => {
    return Promise.map(3).then(fail).catch(error => expect(error instanceof TypeError).toBe(true)).finally(done);
  });

  it('should throw on trying to map promise of non-iterable object', done => {
    return Promise.map(Promise.resolve(3)).then(fail).catch(error => expect(error instanceof TypeError).toBe(true)).finally(done);
  });

});
