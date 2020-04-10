'use strict';

const Promise = require('../index');
const { resolves, rejects } = require('./promises');

describe('using tests', () => {

  it('should call disposer after function resolves', done => {
    const resource = {};
    Promise.using(
      resolves(resource).disposer(item => item.closed = true),
      item => {
        expect(item).toEqual({});
        return resolves('success');
      })
      .then(result => {
        expect(result).toBe('success');
        expect(resource).toEqual({ closed: true });
      })
      .catch(fail)
      .finally(done);
  });

  it('should call disposer after function rejects', done => {
    const resource = {};
    Promise.using(
      resolves(resource).disposer(item => item.closed = true),
      item => {
        expect(item).toEqual({});
        return rejects('error');
      })
      .then(fail)
      .catch(error => {
        expect(error).toBe('error');
        expect(resource).toEqual({ closed: true });
      })
      .finally(done);
  });

  it('should call disposer after function throws', done => {
    const resource = {};
    Promise.using(
      resolves(resource).disposer(item => item.closed = true),
      item => {
        expect(item).toEqual({});
        throw 'error';
        return resolves('success');
      })
      .then(fail)
      .catch(error => {
        expect(error).toBe('error');
        expect(resource).toEqual({ closed: true });
      })
      .finally(done);
  });

});
