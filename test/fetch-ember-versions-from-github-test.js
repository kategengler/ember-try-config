'use strict';

var expect = require('chai').expect;
var fetchEmberVersionsFromGithub = require('../lib/fetch-ember-versions-from-github');
var RSVP = require('rsvp');

describe('lib/fetch-ember-versions-from-github', function() {
  this.timeout(10000);

  it('fetches versions', function() {
    return fetchEmberVersionsFromGithub({logErrors: true}).then(function(versions) {
      expect(versions.indexOf('2.4.0')).not.to.equal(-1);
    });
  });

  it('returns empty array on error/timeout', function() {
    function fakeRemoteGitTags() {
      return new RSVP.Promise(function() {
        throw new Error('Timeout');
      });
    }

    return fetchEmberVersionsFromGithub({remoteGitTags: fakeRemoteGitTags}).then(function(versions) {
      expect(versions.length).to.equal(0);
    });
  });
});
