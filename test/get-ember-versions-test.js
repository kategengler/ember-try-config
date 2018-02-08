'use strict';

let getEmberVersions = require('../lib/get-ember-versions');
let knownBowerVersions = require('../lib/known-bower-ember-versions');
let knownEmberSourceVersions = require('../lib/known-ember-source-versions');

describe('lib/get-ember-versions', () => {

  test('merges fetched versions with versions known locally', () => {
    return getEmberVersions(['house', 'car', 'truck', '2.0.0']).then(versions => {
      expect(versions).toEqual(expect.arrayContaining(['house', 'car', 'truck']));
      expect(versions.length).toBe(knownBowerVersions.length + knownEmberSourceVersions.length + 3);
    });
  });

  test('sort versions by semver', () => {
    return getEmberVersions(['2.13.0', '2.10.0', '2.9.0', '2.8.0', '2.7.0']).then(versions => {
      expect(versions.indexOf('2.13.0')).toBeLessThan(versions.indexOf('2.10.0'));
      expect(versions.indexOf('2.10.0')).toBeLessThan(versions.indexOf('2.9.0'));
      expect(versions.indexOf('2.9.0')).toBeLessThan(versions.indexOf('2.8.0'));
      expect(versions.indexOf('2.8.0')).toBeLessThan(versions.indexOf('2.7.0'));
    });
  });

});
