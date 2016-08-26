'use strict';

var array = require('lodash/array');
var RSVP = require('rsvp');
var fetchRepoVersionsFromGithub = require('./fetch-repo-versions-from-github');

module.exports = function getEmberDataVersions() {
  var fetchVersionsPromise;
  if (arguments[0]) {
    fetchVersionsPromise = RSVP.resolve(arguments[0]);
  } else {
    fetchVersionsPromise = fetchRepoVersionsFromGithub('ember-data');
  }
  return fetchVersionsPromise.then(function(versions) {
    return array.uniq([].concat(versionsFromBower(), versions));
  });
};

// jscs:disable
function versionsFromBower() {
  return [
    "2.7.0",
    "2.7.0",
    "2.6.2",
    "2.6.2",
    "2.6.1",
    "2.6.1",
    "2.6.0",
    "2.6.0",
    "2.5.5",
    "2.5.5",
    "2.5.4",
    "2.5.4",
    "2.5.3",
    "2.5.3",
    "2.5.2",
    "2.5.2",
    "2.5.1",
    "2.5.1",
    "2.5.0",
    "2.5.0",
    "2.4.3",
    "2.4.3",
    "2.4.2",
    "2.4.2",
    "2.4.1",
    "2.4.1",
    "2.4.0",
    "2.4.0",
    "2.3.3",
    "2.3.3",
    "2.3.2",
    "2.3.2",
    "2.3.1",
    "2.3.1",
    "2.3.0",
    "2.3.0",
    "2.2.1",
    "2.2.1",
    "2.2.0",
    "2.2.0",
    "2.1.0",
    "2.1.0",
    "2.0.1",
    "2.0.1",
    "2.0.0",
    "2.0.0",
    "1.13.16",
    "1.13.16",
    "1.13.15",
    "1.13.15",
    "1.13.14",
    "1.13.14",
    "1.13.13",
    "1.13.13",
    "1.13.12",
    "1.13.12",
    "1.13.11",
    "1.13.11",
    "1.13.10",
    "1.13.10",
    "1.13.9",
    "1.13.9",
    "1.13.8",
    "1.13.8",
    "1.13.7",
    "1.13.7",
    "1.13.6",
    "1.13.6",
    "1.13.5",
    "1.13.5",
    "1.13.4",
    "1.13.4",
    "1.13.3",
    "1.13.3",
    "1.13.2",
    "1.13.2",
    "1.13.1",
    "1.13.1",
    "1.13.0",
    "1.13.0",
    "0.0.14",
    "0.0.13",
    "0.0.12"
  ];
}
// jscs:enable
