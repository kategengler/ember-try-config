'use strict';

let autoScenarioConfigForEmber = require('../lib/auto-scenario-config-for-ember');

let fakeGetChannelUrl = function(channel) {
  return Promise.resolve(`https://emberjs.example.com/${channel}-1234.tgz`);
};

describe('lib/auto-scenario-config-for-ember', () => {

  test('includes default scenarios and works with straight version #', () => {
    jest.setTimeout(10000);

    return autoScenarioConfigForEmber({ versionCompatibility: { ember: '2.0.0' }, getChannelURL: fakeGetChannelUrl }).then(config => {
      expect(config.scenarios).toEqual([
        {
          name: 'default',
          npm: {
            devDependencies: {},
          },
        },
        {
          name: 'ember-beta',
          allowedToFail: true,
          npm: {
            devDependencies: {
              'ember-source': 'https://emberjs.example.com/beta-1234.tgz',
            },
          },
        },
        {
          name: 'ember-canary',
          allowedToFail: true,
          npm: {
            devDependencies: {
              'ember-source': 'https://emberjs.example.com/canary-1234.tgz',
            },
          },
        },
        {
          name: 'ember-release',
          npm: {
            devDependencies: {
              'ember-source': 'https://emberjs.example.com/release-1234.tgz',
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

  test('works with complex semver statement', () => {
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

    return autoScenarioConfigForEmber({ versionCompatibility: { ember: '1.0.5 - 1.0.15 || >= 2.1.0 || ^1.11.0 || 1.1.0 - 2.0.0' }, availableVersions, getChannelURL: fakeGetChannelUrl }).then(config => {
      expect(config.scenarios).toEqual(expect.arrayContaining([
        { name: 'ember-1.0.15', bower: { dependencies: { ember: '1.0.15' } }, npm: { devDependencies: { 'ember-source': null } } },
        { name: 'ember-1.1.3', bower: { dependencies: { ember: '1.1.3' } }, npm: { devDependencies: { 'ember-source': null } } },
        { name: 'ember-2.0.0', bower: { dependencies: { ember: '2.0.0' } }, npm: { devDependencies: { 'ember-source': null } } },
        { name: 'ember-1.13.0', bower: { dependencies: { ember: '1.13.0' } }, npm: { devDependencies: { 'ember-source': null } } },
        { name: 'ember-2.1.1', bower: { dependencies: { ember: '2.1.1' } }, npm: { devDependencies: { 'ember-source': null } } },
        { name: 'ember-3.0.0', npm: { devDependencies: { 'ember-source': '3.0.0' } } },
        { name: 'ember-1.11.14', bower: { dependencies: { ember: '1.11.14' } }, npm: { devDependencies: { 'ember-source': null } } },
      ]));
    });
  });
});
