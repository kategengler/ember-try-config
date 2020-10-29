'use strict';

let fetchEmberVersions = require('../lib/fetch-ember-versions');

describe('lib/fetch-ember-versions', () => {
  jest.setTimeout(10000);

  test('fetches versions', () => {
    return fetchEmberVersions({ logErrors: true }).then((versions) => {
      expect(versions).toContain('2.12.0');
    });
  });

  test('returns empty array on error/timeout', () => {
    function fakePackageJSON() {
      return new Promise(() => {
        throw new Error('Timeout');
      });
    }

    return fetchEmberVersions({ packageJSON: fakePackageJSON }).then((versions) => {
      expect(versions).toEqual([]);
    });
  });
});
