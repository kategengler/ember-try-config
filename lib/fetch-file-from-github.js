'use strict';

var fs = require('fs');
var path = require('path');
var fetch = require('node-fetch');
var RSVP = require('rsvp');
var semver = require('semver');

fetch.Promise = RSVP.Promise;

module.exports = function fetchFileFromGithub(repo, version, fileName, options) {
  options = options || {};
  var get = options.fetch || fetch;
  var owner = options.owner || 'ember-cli';
  version = semver.clean(version);

  if(options.cache) {
    var file =  path.join(__dirname, '../data/dependencies/' + version + '-' + fileName);
    var stats = fs.statSync(file);
    if(stats.isFile()) {
      return RSVP.resolve(require(file));
    }
  }

  return get('https://raw.githubusercontent.com/' + owner + '/' + repo + '/v' + version + '/' + fileName, { timeout: 1000 })
    .then(function(res) {
      return res.json();
    })
    .catch(function(err) {
      console.log(err);
      if (options.logErrors) {
        console.log(err.stack);
        throw err;
      }
      return {};
    });
};
