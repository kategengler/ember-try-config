#!/usr/bin/env node

var fs = require('fs');
var array = require('lodash/array');
var semver = require('semver');
var RSVP = require('rsvp');
var fetchVersions = require('../lib/fetch-repo-versions-from-github');
var fetchFile = require('../lib/fetch-file-from-github');

function writeToFile(file, content) {
  console.log('Writing to file', file);
  fs.writeFileSync(file, JSON.stringify(content, null, 2), { encoding: 'utf-8'});
}

function writeVersionsToFile(file, versions) {
  var uniqVersions = array.uniq(versions);
  console.log('Writing ' + uniqVersions.length + ' versions');
  writeToFile(file, uniqVersions);
}

console.log('Updating version lists...');
fetchVersions('ember', { logErrors: true })
  .then(function(versions) {
    writeVersionsToFile('data/versions/ember.json', versions);
  });

fetchVersions('ember-data', { logErrors: true })
  .then(function(versions) {
    writeVersionsToFile('data/versions/ember-data.json', versions);
  });

fetchVersions('ember-new-output', { logErrors: true, owner: 'ember-cli' })
  .then(function(versions) {
    var uniqVersions = array.uniq(versions);
    var files = [];

    console.log('Found ' + uniqVersions.length + ' possible dependencies');

    writeVersionsToFile('data/versions/ember-new-output.json', versions);

    uniqVersions.forEach(function(version) {
      version = semver.clean(version);
      if (semver.gte(version, '1.13.0')) {
        var filePrefix = 'data/dependencies/' + version;

        files.push(
          fetchFile('ember-new-output', version, 'package.json').then(function(json) {
            writeToFile(filePrefix + '-package.json', json);
          }),
          fetchFile('ember-new-output', version, 'bower.json').then(function(json) {
            writeToFile(filePrefix + '-bower.json', json);
          })
        );
      }
    });

    return RSVP.allSettled(files);
  });
