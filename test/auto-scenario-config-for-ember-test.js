'use strict';

let expect = require('chai').expect;
let autoScenarioConfigForEmber = require('../lib/auto-scenario-config-for-ember');

describe('lib/auto-scenario-config-for-ember', function() {

  it('includes default scenarios and works with straight version #', function() {
    this.timeout(10000);

    return autoScenarioConfigForEmber({ versionCompatibility: { ember: '2.0.0' } }).then(config => {
      expect(config.scenarios).to.eql([
        {
          name: 'default',
          bower: {
            dependencies: {},
          },
        },
        {
          name: 'ember-beta',
          allowedToFail: true,
          bower: {
            dependencies: {
              ember: 'components/ember#beta',
            },
            resolutions: {
              ember: 'beta',
            },
          },
          npm: {
            devDependencies: {
              'ember-source': null,
            },
          },
        },
        {
          name: 'ember-canary',
          allowedToFail: true,
          bower: {
            dependencies: {
              ember: 'components/ember#canary',
            },
            resolutions: {
              ember: 'canary',
            },
          },
          npm: {
            devDependencies: {
              'ember-source': null,
            },
          },
        },
        {
          name: 'ember-2.0.0',
          bower: {
            dependencies: {
              ember: '2.0.0',
            },
          },
          npm: {
            devDependencies: {
              'ember-source': null,
            },
          },
        },
      ]);
    });
  });

  it('works with complex semver statement', function() {
    let availableVersions = [
      'v1.0.0',
      'v1.0.5',
      'v1.0.8',
      'v1.0.15',
      'v1.0.16',
      'v1.1.3',
      'v2.0.0',
      '1.13.0',
      'v2.0.0',
      'v2.1.1',
      'v3.0.0',
      'v1.11.0',
      'v1.11.14',
    ];

    return autoScenarioConfigForEmber({ versionCompatibility: { ember: '1.0.5 - 1.0.15 || >= 2.1.0 || ^1.11.0 || 1.1.0 - 2.0.0' }, availableVersions }).then(config => {
      expect(config.scenarios).to.deep.include.members(
        [
          { name: 'ember-1.0.15', bower: { dependencies: { ember: '1.0.15' } }, npm: { devDependencies: { 'ember-source': null } } },
          { name: 'ember-1.1.3', bower: { dependencies: { ember: '1.1.3' } }, npm: { devDependencies: { 'ember-source': null } } },
          { name: 'ember-2.0.0', bower: { dependencies: { ember: '2.0.0' } }, npm: { devDependencies: { 'ember-source': null } } },
          { name: 'ember-1.13.0', bower: { dependencies: { ember: '1.13.0' } }, npm: { devDependencies: { 'ember-source': null } } },
          { name: 'ember-2.1.1', bower: { dependencies: { ember: '2.1.1' } }, npm: { devDependencies: { 'ember-source': null } } },
          { name: 'ember-3.0.0', bower: { dependencies: { ember: '3.0.0' } }, npm: { devDependencies: { 'ember-source': null } } },
          { name: 'ember-1.11.14', bower: { dependencies: { ember: '1.11.14' } }, npm: { devDependencies: { 'ember-source': null } } },
        ]
      );
    });
  });
});
