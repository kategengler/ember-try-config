'use strict';

let remoteGitTags = require('remote-git-tags');
let RSVP = require('rsvp');

module.exports = function fetchEmberVersionsFromGithub(options) {
  options = options || {};
  let _remoteGitTags = options.remoteGitTags || remoteGitTags;

  return RSVP.resolve(_remoteGitTags('github.com/components/ember')).then(tags => Array.from(tags.keys())).catch(err => {
    if (options.logErrors) {
      console.log(err.stack);
      throw err;
    }
    return [];
  });
};
