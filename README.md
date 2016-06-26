# baggy
[![npm package](https://badge.fury.io/js/baggy.svg)](http://badge.fury.io/js/baggy)
[![build](https://travis-ci.org/bakerface/baggy.svg?branch=master)](https://travis-ci.org/bakerface/baggy)
[![code climate](https://codeclimate.com/github/bakerface/baggy/badges/gpa.svg)](https://codeclimate.com/github/bakerface/baggy)
[![coverage](https://codeclimate.com/github/bakerface/baggy/badges/coverage.svg)](https://codeclimate.com/github/bakerface/baggy/coverage)
[![issues](https://img.shields.io/github/issues/bakerface/baggy.svg)](https://github.com/bakerface/baggy/issues)
[![dependencies](https://david-dm.org/bakerface/baggy.svg)](https://david-dm.org/bakerface/baggy)
[![devDependencies](https://david-dm.org/bakerface/baggy/dev-status.svg)](https://david-dm.org/bakerface/baggy#info=devDependencies)
[![downloads](http://img.shields.io/npm/dm/baggy.svg)](https://www.npmjs.com/package/baggy)

This package has been deprecated. Please use
[ziploc](https://github.com/bakerface/ziploc) for new projects. The purpose of
this package is to provide a way to resolve types asynchronously.  Let's take a
look at the simplest example:

``` javascript
var Bag = require('baggy');
var bag = new Bag();

bag.create('One')
  .from(function (done) {
    done(null, 1);
  });

bag.resolve('One', function (error, one) {
  console.log(one); // 1
});
```

We can also create dependencies on other types:

``` javascript
var Bag = require('baggy');
var bag = new Bag();

bag.create('One')
  .from(function (done) {
    done(null, 1);
  });

bag.create('Two')
  .from('One', function (one, done) {
    done(null, one + one);
  });

bag.create('Three')
  .from('One', 'Two', function (one, two, done) {
    done(null, one + two);
  });

bag.resolve('Three', function (error, three) {
  console.log(three); // 3
});
```

The syntax is nice if you have a collection of static functions, but what if you
already have an object with methods? No worries. No need to repeat yourself.

``` javascript
var Bag = require('baggy');
var bag = new Bag();

bag.use({
  getOne: function (done) {
    done(null, 1);
  },

  getTwoFromOne: function (one, done) {
    done(null, one + one);
  },

  getThreeFromOneAndTwo: function (one, two, done) {
    done(null, one + two);
  }
});

bag.resolve('Three', function (error, three) {
  console.log(three); // 3
});
```

In some cases you will want to resolve a derived type without persisting its
dependencies. This is also supported.

``` javascript
var Bag = require('baggy');
var bag = new Bag();

bag.create('Power')
  .from('Base', 'Exponent', function (base, exponent, done) {
    done(null, Math.pow(base, exponent));
  });

bag.given('Base', 2)
  .given('Exponent', 3)
  .resolve('Power', function (error, power) {
    console.log(power); // 8
  });

bag.given('Base', 3)
  .given('Exponent', 2)
  .resolve('Power', function (error, power) {
    console.log(power); // 9
  });

bag.resolve('Base', function (error) {
  console.error(error); // [TypeError: Base]
});

bag.resolve('Exponent', function (error) {
  console.error(error); // [TypeError: Exponent]
});
```

Pull requests and bug reports are welcome, as always.
