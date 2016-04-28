/**
 * Copyright (c) 2016 Christopher M. Baker
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

var async = require('./async');

var Bag = module.exports = function (types) {
  this.types = types || [];
};

Bag.prototype.clone = function () {
  return new Bag(this.types.slice());
};

Bag.prototype.create = function (name) {
  return new Create(this, name);
};

function Create(bag, name) {
  this.bag = bag;
  this.name = name;
}

Create.prototype.from = function () {
  var dependencies = [].concat.apply([], arguments);
  var resolve = dependencies.pop();

  this.bag.types.push({
    name: this.name,
    dependencies: dependencies,
    resolve: resolve
  });

  return this.bag;
};

function isFunction(object) {
  return function (key) {
    return typeof object[key] === 'function';
  };
}

function createType(controller, bag) {
  return function (name) {
    var resolve = controller[name].bind(controller);
    var index = name.indexOf('From');

    if (name.slice(0, 3) === 'get') {
      if (index < 0) {
        return bag.create(name.slice(3)).from(resolve);
      }

      bag.create(name.slice(3, index))
        .from(name.slice(index + 4).split('And'), resolve);
    }
  };
}

Bag.prototype.use = function (controller) {
  Object.getOwnPropertyNames(controller)
    .filter(isFunction(controller))
    .map(createType(controller, this));

  return this;
};

Bag.prototype.given = function (name, value) {
  return this.clone()
    .create(name)
    .from(function (done) {
      done(null, value);
    });
};

function named(name) {
  return function (dependency) {
    return dependency.name === name;
  };
}

function resolveFromType(types) {
  return function (type) {
    return function (done) {
      var tasks = type.dependencies
        .map(resolveFromName(types));

      async.series(tasks, function (error, args) {
        if (error) {
          return done(error);
        }

        type.resolve.apply(this, args.concat(done));
      });
    };
  };
}

function resolveFromName(types) {
  return function (name) {
    return function (done) {
      var tasks = types
        .filter(named(name))
        .map(resolveFromType(types));

      if (tasks.length > 0) {
        return async.first(tasks, done);
      }

      return done(new TypeError(name));
    };
  };
}

Bag.prototype.resolve = function (name, done) {
  resolveFromName(this.types)(name)(done);
};
