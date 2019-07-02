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

class TimeToHeroImg extends Gatherer {
  async afterPass(options) {
    const driver = options.driver;
    // const runTime = await funct.evaluteScriptOnNewDocument('window.test="as";window.test2="ab"');
    // // const html = await driver.getElementsInDocument(true);
    const expression = `Array.from(document.querySelectorAll('.a-button-input')).map(v => v.scrollWidth)`;
    // const expression = `document.querySelectorAll('.a-button-input').scrollWidth`;
    // // // const expression = `function f() {const j={};Array.from(document.querySelectorAll('.a-button-input')).map(v => v.outerHTML).forEach((v, i) => {j[i] = v;});return j;}; f();`;
   let html=await driver.evaluateAsync(expression)
   console.log(html)
      // // // try {
    //  const html = await driver.querySelectorAll('.a-button-input');
    //console.log(html)
    //  console.log(html[0].element.nodeId);
    //  let prop=await driver.getObjectProperty(html[0].element.nodeId.toString(),'classname');
    // let prop=await driver.getObjectProperty('main','classname');
      // console.log(runTime)
      // const j = 0;
    
    // }
    // catch (error) {
    //   console.log(error);
    //   console.log("rejected")
    // }
    // if(html[0].scrollWidth>10 &&html[0].scrollHeight)
    // {
    //   console.log("greater")
    // }
    // const html=await driver.querySelectorAll('.a-button-input');
    // console.log(html)
    fs.writeFile("temp.txt", util.inspect(JSON.stringify(html)), 'utf-8', (err) => {
      if (err) console.log(err);
      console.log("Successfully Written to File.");
    });

    let loadMetrics = 1;
    return loadMetrics;
  }


}

module.exports = TimeToHeroImg;
