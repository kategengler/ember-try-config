'use strict';

var array = require('lodash/array');
var RSVP = require('rsvp');
var fetchRepoVersionsFromGithub = require('./fetch-repo-versions-from-github');

module.exports = function getEmberVersions() {
  var fetchVersionsPromise;
  if (arguments[0]) {
    fetchVersionsPromise = RSVP.resolve(arguments[0]);
  } else {
    fetchVersionsPromise = fetchRepoVersionsFromGithub('ember');
  }
  return fetchVersionsPromise.then(function(versions) {
    return array.uniq([].concat(localVersions(), versions));
  });
};

// jscs:disable
function localVersions() {
  return require('../data/versions/ember');
}
// jscs:enable
