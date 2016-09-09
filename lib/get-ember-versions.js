'use strict';

var array = require('lodash/array');
var RSVP = require('rsvp');
var fetchRepoVersionsFromGithub = require('./fetch-repo-versions-from-github');

module.exports = function getEmberDataVersions() {
  var fetchVersionsPromise;
  if (arguments[0]) {
    fetchVersionsPromise = RSVP.resolve(arguments[0]);
  } else {
    fetchVersionsPromise = fetchRepoVersionsFromGithub('ember');
  }
  return fetchVersionsPromise.then(function(versions) {
    return array.uniq([].concat(versionsFromBower(), versions));
  });
};

// jscs:disable
function versionsFromBower() {
  return require('./known-ember-versions');
}
// jscs:enable
