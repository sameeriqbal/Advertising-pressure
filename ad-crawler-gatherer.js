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
fs.readFile('./adv_elements_selectors.txt', (err, data) => {
  if (err) {
    console.log(err); require('process').exit();
  }
  defSelectors = data.toString('utf8').split(/\n/g);
});

class AdCrawlerGatherer extends Gatherer {
  async afterPass(options) {

    const driver = options.driver;
    const expression = `Array.from(document.querySelectorAll('*')).map(v => { return {clientWidth: v.clientWidth, clientHeight: v.clientHeight, className: v.className, id: v.id} })`;
    
    const considerables = [];

    let html = await driver.evaluateAsync(expression);
    const bodyDimen = html.map(v => { return v.clientWidth * v.clientHeight; });
    let bodyTot = 0;
    if (bodyDimen.length > 0) {
      bodyTot = bodyDimen.reduce((t,a) => {return t+a;});
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

    // fs.writeFile('./sandbox/dump.json', JSON.stringify(considerables), 'utf-8', (err) => { if (err) return console.log(err); });

    // fs.writeFile("temp.json", JSON.stringify(removed), 'utf-8', (err) => {
    //   if (err) console.log(err);
    //   console.log("Successfully Written to File.");
    // });

    const adDimen = considerables.map(v => { return v.clientWidth * v.clientHeight; });
    let adTot = 0;
    if (adDimen.length > 0) {
      adTot = adDimen.reduce((t,a) => {return t+a;});
    }

    return {
      count: considerables.length,
      // ratio: considerables.length / totalElem,
      dimensionRatio: adTot / bodyTot
    };
  }
}


module.exports = AdCrawlerGatherer;
