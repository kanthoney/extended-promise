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

  describe("promise tests", () => {
    it('should process each record in array of promises', done => {
      const letters = 'abcde';
      let result = '';
      Promise.each(Promise.resolve([1,2,3,4,5].map(i => resolves(letters[i-1]))), letter => result = letter)
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
      Promise.each(Promise.resolve([1,2,3,4,5].map(i => i==3?rejects('error'):resolves(i))), letter => result = letter)
        .then(fail)
        .catch(error => expect(error).toBe('error'))
          .finally(done);
    });

    it('should process promises which resolve in reverse order', done => {
      const letters = 'abcde';
      let result = '';
      Promise.each(Promise.resolve([1,2,3,4,5].map(i => resolves(letters[i-1], 100-20*i))), letter => result = `${result}${letter}`)
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
      Promise.each(Promise.resolve([1,2,3,4,5].map(i => resolves(letters[i-1]))), letter => result = letter, { concurrency: 2 })
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
      Promise.each(Promise.resolve([1,2,3,4,5].map(i => i%2===0?letters[i-1]:Promise.resolve(letters[i-1]))), letter => result = letter)
        .then(r => {
          expect(r).toBeUndefined();
          expect(result).toBe('e');
        })
        .catch(fail)
          .finally(done);
    });

  });

  describe("method tests", () => {
    it('should process each record in array of promises', done => {
      const letters = 'abcde';
      let result = '';
      Promise.resolve([1,2,3,4,5].map(i => resolves(letters[i-1]))).each(letter => result = letter)
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
      Promise.resolve([1,2,3,4,5].map(i => i==3?rejects('error'):resolves(i))).each(letter => result = letter)
        .then(fail)
        .catch(error => expect(error).toBe('error'))
          .finally(done);
    });

    it('should process promises which resolve in reverse order', done => {
      const letters = 'abcde';
      let result = '';
      Promise.resolve([1,2,3,4,5].map(i => resolves(letters[i-1], 100-20*i))).each(letter => result = `${result}${letter}`)
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
      Promise.resolve([1,2,3,4,5].map(i => resolves(letters[i-1]))).each(letter => result = letter, { concurrency: 2 })
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
      Promise.resolve([1,2,3,4,5].map(i => i%2===0?letters[i-1]:Promise.resolve(letters[i-1]))).each(letter => result = letter)
        .then(r => {
          expect(r).toBeUndefined();
          expect(result).toBe('e');
        })
        .catch(fail)
          .finally(done);
    });

  });

  describe('Async iterator tests', () => {

    async function* g(items)
    {
      for(let item of items) {
        yield Promise.resolve(item);
      }
      return;
    }

    it('should copy array using async iterator', done => {
      let result = [];
      return Promise.each(g([1, resolves(2), 3]), item => {
        result.push(item);
      }).then(() => {
        expect(result).toEqual([1,2,3]);
      }).catch(fail).finally(done);
    });

    it('should fail to copy array using async iterator', done => {
      let result = [];
      return Promise.each(g([1, rejects(2), 3]), item => {
        result.push(item);
      }).then(fail).catch(error => expect(error).toBe(2)).finally(done);
    });

  });

  it('should throw on trying to run each non-iterable object', done => {
    return Promise.each(3, i => {}).then(fail).catch(error => expect(error instanceof TypeError).toBe(true)).finally(done);
  });

  it('should throw on trying to run each on promise of non-iterable object', done => {
    return Promise.each(Promise.resolve(3), i => {}).then(fail).catch(error => expect(error instanceof TypeError).toBe(true)).finally(done);
  });

});

