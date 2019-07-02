/**
 * @license Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

module.exports = {
  // 1. Run your custom tests along with all the default Lighthouse tests.
  // extends: 'lighthouse:default',
  
  scoreDisplayMode: "numeric",
  // 2. Add gatherer to the default Lighthouse load ('pass') of the page.
  passes: [{
    passName: 'defaultPass',
    gatherers: [
      'ad-crawler-gatherer',
    ],
  }],

  // 3. Add custom audit to the list of audits 'lighthouse:default' will run.
  audits: [
    'ad-count-audit',
    'ad-dimen-ratio-audit'
  ],

  // 4. Create a new 'My site metrics' section in the default report for our results.
  categories: {
    mysite: {
      title: 'Number of Ads',
      description: 'It will show the number of Advertising banner on site.',
      auditRefs: [
        // When we add more custom audits, `weight` controls how they're averaged together.
        {id: 'ad-count-audit', weight: 1},
      ],
    },
    mysite1: {
      title: 'Ad to document ratio',
      description: 'It will show the ratio between advertising document to total doucment size',
      auditRefs: [
        // When we add more custom audits, `weight` controls how they're averaged together.
        {id: 'ad-dimen-ratio-audit', weight: 1},
      ],
    },
    mysite2: {
      title: 'Count/Ratio Weights',
      description: 'This will show metrics with combined advertisment pressure weights and weights from dimension ratios',
      auditRefs: [
        // When we add more custom audits, `weight` controls how they're averaged together.
        {id: 'ad-count-audit', weight: 1},
        {id: 'ad-dimen-ratio-audit', weight: 1}
      ],
    },
  },
};
