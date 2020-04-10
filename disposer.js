'use strict';

const Promise = require('./extended-promise');

class Disposer
{
  constructor(item, disposer)
  {
    this.item = item;
    this.disposer = disposer;
  }

  dispose()
  {
    return this.item.then(item => {
      return this.disposer(item);
    });
  }
};

module.exports = Disposer;
