'use strict';

var expect = require('chai').expect;
var sortVersions = require('../lib/sort-versions');

describe('lib/sort-versions', function() {

  it('sorts by semver with the most recent version on top', function() {
    var input = [
      '2.0.0',
      '2.13.0',
      '1.13.4',
      '2.0.1',
    ];

    var expected = [
      '2.13.0',
      '2.0.1',
      '2.0.0',
      '1.13.4',
    ];

    expect(sortVersions(input)).to.deep.equal(expected);
  });

  it('can handle "v" prefix', function() {
    var input = [
      '2.0.0',
      '2.13.0',
      '1.13.4',
      'v2.0.1',
    ];

    var expected = [
      '2.13.0',
      'v2.0.1',
      '2.0.0',
      '1.13.4',
    ];

    expect(sortVersions(input)).to.deep.equal(expected);
  });


  it('sorts non-semver versions alphabetically at the bottom', function() {
    var input = [
      '2.0.0',
      '2.13.0',
      'foo',
      'bar',
    ];

    var expected = [
      '2.13.0',
      '2.0.0',
      'bar',
      'foo',
    ];

    expect(sortVersions(input)).to.deep.equal(expected);
  });

});
