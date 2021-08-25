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

  each(f, options)
  {
    return this.then(result => ExtendedPromise.each(result, f, options));
  }

  map(f, options)
  {
    return this.then(result => ExtendedPromise.map(result, f, options));
  }

  mapSeries(f)
  {
    return this.then(result => ExtendedPromise.mapSeries(result, f));
  }

  reduce(f, acc)
  {
    return this.then(result => ExtendedPromise.reduce(result, f, acc));
  }

  filter(f)
  {
    return this.then(result => ExtendedPromise.filter(result, f));
  }

  all()
  {
    return this.then(result => ExtendedPromise.all(result));
  }

  props(options)
  {
    return this.then(result => ExtendedPromise.props(result, options));
  }

  static each(a, f, options)
  {
    if(a.then instanceof Function) {
      return a.then(a => ExtendedPromise.each(a, f, options));
    }
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
    if(a.then instanceof Function) {
      return a.then(a => ExtendedPromise.map(a, f, options));
    }
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
    if(a.then instanceof Function) {
      return a.then(a => ExtendedPromise.mapSeries(a, f, options));
    }
    return ExtendedPromise.map(a, f, { ...options, concurrency: 1 });
  }

  static reduce(a, f, acc)
  {
    if(a.then instanceof Function) {
      return a.then(a => ExtendedPromise.reduce(a, f, acc));
    }
    const it = a[Symbol.iterator]();
    const next = acc => {
      const n = it.next();
      if(n.done) {
        return ExtendedPromise.resolve(acc);
      }
      return ExtendedPromise.resolve(n.value).then(value => {
        return ExtendedPromise.resolve(f(acc, value)).then(next);
      });
    }
    return next(acc===undefined?0:acc);
  }

  static filter(a, f)
  {
    if(a.then instanceof Function) {
      return a.then(a => ExtendedPromise.filter(a, f));
    }
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
    if(a.then instanceof Function) {
      return a.then(a => ExtendedPromise.props(a, options));
    }
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

  static delay(t, value)
  {
    return new ExtendedPromise((resolve) => {
      setTimeout(() => resolve(value), t);
    });
  }

};

module.exports = ExtendedPromise;
