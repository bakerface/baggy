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

describe('bag.resolve(name, done)', function () {
  var bag;

  beforeEach(function () {
    bag = new Bag();
  });

  describe('when the type is undefined', function () {
    it('should return an error', function (done) {
      bag.resolve('Type', function (error) {
        assert.equal(error.name, 'TypeError');
        assert.equal(error.message, 'Type');
        done();
      });
    });
  });

  describe('when the type rejects', function () {
    beforeEach(function () {
      bag.create('Type')
        .from(function (done) {
          done('error');
        });
    });

    it('should return the error', function (done) {
      bag.resolve('Type', function (error) {
        assert.equal(error, 'error');
        done();
      });
    });
  });

  describe('when the type resolves', function () {
    beforeEach(function () {
      bag.create('Type')
        .from(function (done) {
          done(null, 'value');
        });
    });

    it('should return the error', function (done) {
      bag.resolve('Type', function (error, value) {
        assert.equal(error, null);
        assert.equal(value, 'value');
        done();
      });
    });
  });

  describe('when a dependency rejects', function () {
    beforeEach(function () {
      bag.create('Dependency')
        .from(function (done) {
          done('error');
        });

      bag.create('Type')
        .from('Dependency', function (dependency, done) {
          done(null, dependency + dependency);
        });
    });

    it('should return the error', function (done) {
      bag.resolve('Type', function (error) {
        assert.equal(error, 'error');
        done();
      });
    });
  });

  describe('when the dependencies resolve', function () {
    beforeEach(function () {
      bag.create('Dependency')
        .from(function (done) {
          done(null, 'dependency');
        });

      bag.create('Type')
        .from('Dependency', function (dependency, done) {
          done(null, 'type:' + dependency);
        });
    });

    it('should return the error', function (done) {
      bag.resolve('Type', function (error, value) {
        assert.equal(error, null);
        assert.equal(value, 'type:dependency');
        done();
      });
    });
  });
});
