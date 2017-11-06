'use strict';

let array = require('lodash/array');
let RSVP = require('rsvp');

let sortVersions = require('./sort-versions');
let fetchEmberVersionsFromGithub = require('./fetch-ember-versions-from-github');

module.exports = function getEmberVersions() {
  let fetchVersionsPromise;
  if (arguments[0]) {
    fetchVersionsPromise = RSVP.resolve(arguments[0]);
  } else {
    fetchVersionsPromise = fetchEmberVersionsFromGithub();
  }
  return fetchVersionsPromise.then(versions => sortVersions(array.uniq([].concat(versionsFromBower(), versions))));
};

function versionsFromBower() {
  return require('./known-ember-versions');
}
