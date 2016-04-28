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

var Bag = require('..');
var assert = require('assert');

describe('bag.use(controller)', function () {
  var bag;

  beforeEach(function () {
    bag = new Bag();

    bag.use({
      ignoredFunction: function () { },

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
  });

  it('should create types from the functions', function (done) {
    bag.resolve('Three', function (error, three) {
      assert.equal(three, 3);
      done();
    });
  });
});
