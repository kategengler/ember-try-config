#!/usr/bin/env node

var fs = require('fs');
var array = require('lodash/array');
var fetchVersions = require('../lib/fetch-repo-versions-from-github');

function writeVersionsToFile(file, versions) {
  var uniqVersions = array.uniq(versions);
  console.log('Writing ' + uniqVersions.length + ' versions to ' + file);

  fs.writeFileSync(file, JSON.stringify(uniqVersions, null, 2), { encoding: 'utf-8'});
}

console.log('Updating version lists...');
fetchVersions('ember', { logErrors: true })
  .then(function(versions) {
    writeVersionsToFile('lib/known-ember-versions.json', versions);
  });

fetchVersions('ember-data', { logErrors: true })
  .then(function(versions) {
    writeVersionsToFile('lib/known-ember-data-versions.json', versions);
  });
