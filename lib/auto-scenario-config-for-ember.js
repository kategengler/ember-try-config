'use strict';
let semver = require('semver');
let RSVP = require('rsvp');
let getEmberVersions = require('./get-ember-versions');
let findSatisfyingVersions = require('./find-satisfying-versions');

module.exports = function generateConfig(options) {
  return generateScenariosFromSemver(options.versionCompatibility, options.availableVersions).then(scenarios => ({ scenarios: [].concat(baseScenarios(), scenarios) }));
};

function generateScenariosFromSemver(semverStatements, availableVersions) {
  let statement = semverStatements.ember;
  let versionPromise;

  if (availableVersions) {
    versionPromise = RSVP.resolve(availableVersions);
  } else {
    versionPromise = getEmberVersions();
  }

  return versionPromise.then(possibleVersions => {
    let versions = findSatisfyingVersions(possibleVersions, statement);

    return versions.map(version => {
      let versionNum = semver.clean(version);
      return {
        name: `ember-${versionNum}`,
        bower: {
          dependencies: {
            ember: versionNum,
          },
        },
        npm: {
          devDependencies: {
            'ember-source': null,
          },
        },
      };
    });
  });
}

function baseScenarios() {
  return [
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
  ];
}
