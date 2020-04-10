'use strict';

const Promise = require('../index');

module.exports.resolves = (result, time) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(result), time || 0);
  });
};

module.exports.rejects = (error, time) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(error), time || 0);
  });
};
