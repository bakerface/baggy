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
