'use strict';

let expect = require('chai').expect;
let getEmberVersions = require('../lib/get-ember-versions');
let knownVersions = require('../lib/known-ember-versions');

describe('lib/get-ember-versions', () => {

  test('merges fetched versions with versions known locally', () => {
    return getEmberVersions(['house', 'car', 'truck', '2.0.0']).then(versions => {
      expect(versions).to.include.members(['house', 'car', 'truck']);
      expect(versions.length).to.equal(knownVersions.length + 3);
    });
  });

  test('sort versions by semver', () => {
    return getEmberVersions(['2.13.0', '2.10.0', '2.9.0', '2.8.0', '2.7.0']).then(versions => {
      expect(versions.indexOf('2.13.0')).to.be.below(versions.indexOf('2.10.0'));
      expect(versions.indexOf('2.10.0')).to.be.below(versions.indexOf('2.9.0'));
      expect(versions.indexOf('2.9.0')).to.be.below(versions.indexOf('2.8.0'));
      expect(versions.indexOf('2.8.0')).to.be.below(versions.indexOf('2.7.0'));
    });
  });

});
