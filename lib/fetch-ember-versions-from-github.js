'use strict';

var remoteGitTags = require('remote-git-tags');
var RSVP = require('rsvp');

module.exports = function fetchEmberVersionsFromGithub(options) {
  options = options || {};
  var _remoteGitTags = options.remoteGitTags || remoteGitTags;

  return RSVP.resolve(_remoteGitTags('github.com/components/ember')).then(function(tags) {
    return Array.from(tags.keys());
  }).catch(function(err) {
    if (options.logErrors) {
      console.log(err.stack);
      throw err;
    }
    return [];
  });
};
