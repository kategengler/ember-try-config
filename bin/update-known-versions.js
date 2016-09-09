#!/usr/bin/env node

var fs = require('fs');
var array = require('lodash/array');
var fetchVersions = require('../lib/fetch-repo-versions-from-github');

function writeVersionsToFile(file, versions) {
  var uniqVersions = array.uniq(versions);
  console.log('versions found: ', uniqVersions.length);

  fs.writeFileSync(file, JSON.stringify(uniqVersions, null, 2), { encoding: 'utf-8'});
}

console.log('Updating list of ember versions');
fetchVersions('ember', { logErrors: true })
  .then(function(versions) {
    writeVersionsToFile('lib/known-ember-versions.json', versions);
  });

console.log('Updating list of ember-data versions');
fetchVersions('ember-data', { logErrors: true })
  .then(function(versions) {
    writeVersionsToFile('lib/known-ember-data-versions.json', versions);
  });
