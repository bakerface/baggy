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

function series(tasks, done) {
  var values = [];

  function append(error, value) {
    if (error) {
      return done(error);
    }

    values.push(value);
    next();
  }

  function next() {
    if (tasks.length > 0) {
      return tasks.shift()(append);
    }

    done(null, values);
  }

  next();
}

exports.series = function (tasks, done) {
  series(tasks.slice(), done);
};

function first(tasks, done) {
  function next(error, value) {
    if (!error) {
      return done(null, value);
    }

    if (tasks.length > 0) {
      return tasks.shift()(next);
    }

    done(error);
  }

  next(new Error('Attempt to get first success of empty array'));
}

exports.first = function (tasks, done) {
  first(tasks.slice(), done);
};
