/**
 * @license Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';
var util = require('util');
const Gatherer = require('lighthouse').Gatherer;
const pageFunctions = require('lighthouse/lighthouse-core/lib/page-functions.js');
const funct = require('lighthouse/lighthouse-core/gather/driver');
var fs = require("fs");

let defSelectors = [];
let attrTagSelectors = [];
let balancerQuery = '';

fs.readFile('./adv_elements_selectors.txt', (err, data) => {
  if (err) {
    console.log(err); require('process').exit();
  }
  defSelectors = data.toString('utf8').split(/\n/g)
    .filter(s => {
      if (s[0] !== '.' && s[0] !== '#') {
        attrTagSelectors.push(s);
      } else {
        return s;
      }
    });
  balancerQuery = attrTagSelectors.reduce((t, a) => t.toString().concat(a).concat(','));
  balancerQuery = balancerQuery.replace(/[']/g, '\\\'');
  for (; (balancerQuery.substr(-1, 1) == ',' || balancerQuery.substr(-1, 1) == ' ');) {
    balancerQuery = balancerQuery.slice(0, -1);
  }
  // masterQuery = data.toString('utf8').replace(/\n/g, ',');
});

// let masterQuery = fs.readFileSync('./adv_elements_selectors.txt').toString('utf8').replace(/\n/g, ',');
// masterQuery = (masterQuery.substr(-1,1) == ',') ? masterQuery.slice(0,-1) : masterQuery;

class AdCrawlerGatherer extends Gatherer {
  async afterPass(options) {

    const driver = options.driver;

    // const encapsulation = `Array.from(document.querySelectorAll('*')).map(v => { return {clientWidth: v.clientWidth, clientHeight: v.clientHeight, className: v.className, id: v.id} })`;
    // const expression = `Array.from(document.querySelectorAll('${masterQuery}')).map(v => { return {clientWidth: v.clientWidth, clientHeight: v.clientHeight, className: v.className, id: v.id} })`;
    const expression = `Array.from(document.querySelectorAll('*')).map(v => { return {clientWidth: v.clientWidth, clientHeight: v.clientHeight, className: v.className, id: v.id} })`;
    const balanceExpression = `Array.from(document.querySelectorAll('${balancerQuery}')).map(v => { return {clientWidth: v.clientWidth, clientHeight: v.clientHeight, className: v.className, id: v.id} })`;

    const considerables = [];

    // let capsule = await driver.evaluateAsync(encapsulation);

    let html = await driver.evaluateAsync(expression);
    let attrBased = await driver.evaluateAsync(balanceExpression);

    const bodyDimen = html.map(v => { return v.clientWidth * v.clientHeight; });
    bodyDimen.concat(attrBased.map(a => { return a.clientWidth * a.clientHeight; }));
    let bodyTot = 0;
    if (bodyDimen.length > 0) {
      bodyTot = bodyDimen.reduce((t, a) => { return t + a; });
    }

    let removed = [];

    html = html.map(e => {
      e.classNames = [];
      if (e.className !== '') {
        const arr = e.className.split(' ').filter(f => { if (f !== '') { return f; } });
        e.classNames = arr;
      }
      return e;
    })
      .filter(m => {
        // if (m !== undefined) {
        if ((m.clientWidth * m.clientHeight) > 100) {
          return m;
        } else {
          removed.push(m);
        }
        // }
      });

      
      html.forEach(el => {
        if (defSelectors.indexOf('#'.concat(el.id)) >= 0) {
        considerables.push(el);
      }
    });
    
    html.forEach(el => {
      el.classNames.forEach(e => {
        if (defSelectors.indexOf('.'.concat(e)) >= 0) {
          considerables.push(el);
          return;
        }
      });
    });

    considerables.concat(attrBased);
    // considerables = html;

    // fs.writeFile('./sandbox/dump.json', JSON.stringify(considerables), 'utf-8', (err) => { if (err) return console.log(err); });

    // fs.writeFile("temp.json", JSON.stringify(removed), 'utf-8', (err) => {
    //   if (err) console.log(err);
    //   console.log("Successfully Written to File.");
    // });

    const adDimen = considerables.map(v => { return v.clientWidth * v.clientHeight; });
    let adTot = 0;
    if (adDimen.length > 0) {
      adTot = adDimen.reduce((t, a) => { return t + a; });
    }

    return {
      count: considerables.length,
      // ratio: considerables.length / totalElem,
      dimensionRatio: adTot / bodyTot
    };
  }
}


module.exports = AdCrawlerGatherer;
