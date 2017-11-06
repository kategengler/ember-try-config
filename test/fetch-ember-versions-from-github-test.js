'use strict';

let expect = require('chai').expect;
let fetchEmberVersionsFromGithub = require('../lib/fetch-ember-versions-from-github');
let RSVP = require('rsvp');

describe('lib/fetch-ember-versions-from-github', function() {
  this.timeout(10000);

  it('fetches versions', function() {
    return fetchEmberVersionsFromGithub({ logErrors: true }).then(versions => {
      expect(versions).to.contain('2.4.0');
    });
  });

  it('returns empty array on error/timeout', function() {
    function fakeRemoteGitTags() {
      return new RSVP.Promise(function() {
        throw new Error('Timeout');
      });
    }

    return fetchEmberVersionsFromGithub({ remoteGitTags: fakeRemoteGitTags }).then(versions => {
      expect(versions).to.deep.equal([]);
    });
  });
});
