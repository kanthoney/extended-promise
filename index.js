'use strict';

class ExtendedPromise extends Promise
{

  tap(f)
  {
    return this.then(result => {
      return ExtendedPromise.resolve(f(result)).then(() => {
        return result;
      });
    });
  }

  tapCatch(f)
  {
    return this.catch(error => {
      return ExtendedPromise.resolve(f(error)).then(() => {
        return ExtendedPromise.reject(error);
      });
    });
  }

  delay(t)
  {
    return this.then(result => {
      return new ExtendedPromise(resolve => {
        setTimeout(() => resolve(result), t);
      });
    });
  }

  disposer(f)
  {
    const Disposer = require('./disposer');
    return new Disposer(this, f);
  }

  all(a)
  {
    return ExtendedPromise.all(a);
  }

  static each(a, f, options)
  {
    options = options || {};
    const it = a[Symbol.iterator]();
    const buffer = [];
    const next = () => {
      const n = it.next();
      if(n.done) {
        return;
      }
      return ExtendedPromise.resolve(n.value).then(value => f(value)).then(() => {
        return next();
      });
    }
    while(options.concurrency === undefined || buffer.length < options.concurrency) {
      const n = next();
      if(n === undefined) {
        break;
      } else {
        buffer.push(n);
      }
    }
    return ExtendedPromise.all(buffer).then(() => {});
  }

  static map(a, f, options)
  {
    options = options || {};
    const it = a[Symbol.iterator]();
    let buffer = [];
    let index = 0;
    let result = [];
    const next = i => {
      const n = it.next();
      if(!n.done) {
        return ExtendedPromise.resolve(n.value).then(value => {
          return f(value);
        }).then(r => {
          result[i] = r;
          return next(index++);
        });
      }
    }
    while(options.concurrency === undefined || index < options.concurrency) {
      const p = next(index++);
      if(p === undefined) {
        break;
      } else {
        buffer.push(p);
      }
    }
    return ExtendedPromise.all(buffer).then(() => {
      return result;
    });
  }

  static mapSeries(a, f, options)
  {
    return ExtendedPromise.map(a, f, { ...options, concurrency: 1 });
  }

  static reduce(a, f, acc)
  {
    const it = a[Symbol.iterator]();
    const next = acc => {
      const n = it.next();
      if(n.done) {
        return ExtendedPromise.resolve(acc);
      }
      return ExtendedPromise.resolve(n.value).then(value => {
        return next(f(acc, value));
      });
    }
    return next(acc===undefined?0:acc);
  }

  static filter(a, f)
  {
    const it = a[Symbol.iterator]();
    f = ExtendedPromise.method(f);
    const next = result => {
      const n = it.next();
      if(n.done) {
        return ExtendedPromise.resolve(result);
      }
      return ExtendedPromise.resolve(n.value).then(value => {
        return f(value).then(flag => {
          if(flag) {
            return next(result.concat(value));
          }
          return next(result);
        });
      });
    }
    return next([]);
  }

  static fromCallback(f)
  {
    return new ExtendedPromise((resolve, reject) => {
      const done = (err, result) => {
        if(err) {
          reject(err);
        } else {
          resolve(result);
        }
      };
      return f(done);
    });
  }

  static props(a, options)
  {
    options = options || {};
    const it = Object.keys(a)[Symbol.iterator]();
    const result = {};
    let buffer = [];
    const next = () => {
      const k = it.next();
      if(k.done) {
        return;
      }
      return ExtendedPromise.resolve(a[k.value]).then(value => {
        result[k.value] = value;
        return next();
      });
    }
    while(options.concurrency === undefined || buffer.length < options.concurrency) {
      const n = next();
      if(n === undefined) {
        break;
      }
      buffer.push(n);
    }
    return ExtendedPromise.all(buffer).then(() => {
      return result;
    });
  }

  static coroutine(f)
  {
    return (...args) => {
      const it = f(...args);
      const next = arg => {
        const n = it.next(arg);
        if(n.done) {
          return ExtendedPromise.resolve(n.value);
        }
        return ExtendedPromise.resolve(n.value).then(value => {
          return next(value);
        });
      }
      return next();
    };
  }

  static method(f)
  {
    return (...args) => {
      try {
        return ExtendedPromise.resolve(f(...args));
      } catch(error) {
        return ExtendedPromise.reject(error);
      }
    }
  }

  static using(disposer, f)
  {
    const Disposer = require('./disposer');
    if(disposer instanceof Disposer) {
      return disposer.item.then(item => f(item)).finally(() => disposer.dispose());
    }
    return ExtendedPromise.reject('Using requires a disposer as the first argument');
  }

};

module.exports = ExtendedPromise;
