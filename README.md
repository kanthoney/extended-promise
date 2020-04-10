# extended-promise

Native promise extended with extra utilities like `map` and `reduce`

## Installation

```
npm install --save @kanthoney/extended-promise
```

## Usage

```
const Promise = require('@kanthoney/extended-promise');
```

## Methods

1. `tap(f)`

Calls f on the resolved value, returning the original value

```
Promise.resolve(5)
.tap(result => {
  return result + 1;
}).then(result => {
  // result is 5 not 6
})
```

1. `tapCatch(f)`

Like `tap` but for `catch`.

```
Promise.reject('error').tapCatch(error => {
  return 'success';
}).catch(error => {
  // error is 'error'
})
```

1. `delay(t)`

Introduces a delay in milliseconds

```
Promise.resolve(result)
.delay(500)
.then(result => {
  // called after 500 ms
});
```

1. <a name="disposer">`disposer(f)`</a>

Used with [`using`](#using) for disposing resources. `f` is a function which takes a resource and disposes of that resource.

1. `all`

Calls `Promise.all` on the resolved value. Assumes the resolved value is an array.

## static methods

1. `each(a, f, options)`

calls function `f`, which may return a promise, on each item of array or iterator `a`. Returns a promise resolving to `undefined` or the value of the first rejected promise in
the case of an error. `options` is an object for configuration parameters. There is currently one parameter, `concurrency`, which is the maximum number of promises called simultaneously.

1. `map(a, f, options)`

Calls function `f`, which may return a promise, on each of item of array or iterator `a`. Returns an array of the resolved values `f(item)`, in the same order as `a` even if the values
were resolved in a different order. `options` is a configuration object currently with one parameter `concurrency` which is the maximum number of promises called simultaneously.

1. `mapSeries(a, f)`

Like `map` but with a concurrency of 1.

1. `reduce(a, f, acc)`

For each `item` in array or iterator `a`, calls `f` with parameters `(acc, item)`. The return value of `f` is passed to the next call as the `acc` parameter. Returns the final `acc` value.
`acc` defaults to 0.

```
Promise.reduce([1, 2, 3], (acc, i) => Promise.resolve(acc + i), 0)
.then(result => {
  //result = 1 + 2 + 3 = 6
});
```  

1. `props(a)`

`a` is an object where the object properties can be promises. Returns an object of the same format with the properties resolved.

```
Promise.props({
  db: getDB(), // can return a promise
  config: getConfig() // can return a promise
}).then(({ db, config }) => {
  // db and config are the resolved values of getDB() and getConfig()
});
```

1. `filter(a, f)`

Returns an array of those items of `a` for which `f(item)` resolves to a truthy value.

```
Promise.filter([1,2,3,4,5], i => Promise.resolve(i%2 === 0))
.then(result => {
  // result = [2,4]
});
```

1. `fromCallback(f)`

Used to call a function that takes a callback and return a promise. `f` is a function the takes one parameter, a callback function. In the example below, `db.query` is a function
that takes a callback in the old node style and executes a database query q with parameter values v.

```
Promise.fromCallback(done => {
  db.query(q, v, done);
}).then(result => {
  // result contains the database query result
});
```

1. `coroutine(f)`

Used with generator functions which yield promises. `f` is a generator function.

Say we have a function `nextPage()` which calls a backend and returns a promise which resolves to the next page of results. We can use `coroutine` to concatenate up to `n` pages as follows:

```
const acc = Promise.coroutine(function*(n) {
  let a = [];
  for(let i = 0; i < n; i++) {
    let page = yield nextPage();
    if(!page) {
      break;
    }
    a = a.concat(page);
  }
  return a;
});

acc(5).then(pages => {
  // pages contains 5 pages
});
```

`coroutine` creates the function `acc`. When this is called, `acc` calls the generator function with its parameters. Each time the `nextPage` function yields a promise, `coroutine`
passes the resolved value to the `page` variable.

1. `method(f)`

Converts a function `f` which may return a promise into one that definitely does.

```
const f = Promise.method((a, b) => a + b);
f(5, 6).then(result => {
  // result = 11
});
```

1. <a name="using">`using(disposer, f)`</a>

Used to guarantee the disposal of a resource after it's been used. The first argument is an object of the `Disposer` class, obtained by calling the [`disposer`](#disposer) method, which takes a function
which will dispose of the resource after `using` is finished. `f` is a function which takes the resource and returns the required result.

Say `getDB` is a function which returns a database handle and we want to call a function with this handle, and close the handle afterwards whether or not the call was successful.
We would use something like the following:

```
Promise.using(
  getDB().disposer(db => db.close()),
  db => doQuery(q, v)
).then(result => {
  // result contains the result of the database query
})
```
