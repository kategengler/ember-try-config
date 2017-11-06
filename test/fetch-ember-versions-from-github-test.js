'use strict';

let expect = require('chai').expect;
let fetchEmberVersionsFromGithub = require('../lib/fetch-ember-versions-from-github');
let RSVP = require('rsvp');

describe('lib/fetch-ember-versions-from-github', () => {
  jest.setTimeout(10000);

  test('fetches versions', () => {
    return fetchEmberVersionsFromGithub({ logErrors: true }).then(versions => {
      expect(versions).to.contain('2.4.0');
    });
  });

  test('returns empty array on error/timeout', () => {
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
