'use strict';

let expect = require('chai').expect;
let sortVersions = require('../lib/sort-versions');

describe('lib/sort-versions', function() {

  it('sorts by semver with the most recent version on top', function() {
    let input = [
      '2.0.0',
      '2.13.0',
      '1.13.4',
      '2.0.1',
    ];

    let expected = [
      '2.13.0',
      '2.0.1',
      '2.0.0',
      '1.13.4',
    ];

    expect(sortVersions(input)).to.deep.equal(expected);
  });

  it('can handle "v" prefix', function() {
    let input = [
      '2.0.0',
      '2.13.0',
      '1.13.4',
      'v2.0.1',
    ];

    let expected = [
      '2.13.0',
      'v2.0.1',
      '2.0.0',
      '1.13.4',
    ];

    expect(sortVersions(input)).to.deep.equal(expected);
  });


  it('sorts non-semver versions alphabetically at the bottom', function() {
    let input = [
      '2.0.0',
      '2.13.0',
      'foo',
      'bar',
    ];

    let expected = [
      '2.13.0',
      '2.0.0',
      'bar',
      'foo',
    ];

    expect(sortVersions(input)).to.deep.equal(expected);
  });

});
