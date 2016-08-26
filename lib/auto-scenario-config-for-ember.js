'use strict';
var semver = require('semver');
var RSVP = require('rsvp');
var getEmberVersions = require('./get-ember-versions');
var getEmberDataVersions = require('./get-ember-versions');
var findSatisfyingVersions = require('./find-satisfying-versions');

module.exports = function generateConfig(options) {
  return generateScenariosFromSemver(options.versionCompatibility, options.availableVersions, options.withEmberData).then(function(scenarios) {
    return { scenarios:  [].concat(baseScenarios(options.withEmberData), scenarios) };
  });
};

function generateScenariosFromSemver(semverStatements, availableVersions, withEmberData) {
  var statement = semverStatements.ember;
  var versionsPromiseHash = {};
  var versionPromise;

  if (availableVersions) {
    versionPromise = RSVP.resolve(availableVersions);
  } else {
    versionPromise = getEmberVersions();
  }

  if(withEmberData) {
    versionsPromiseHash.data = getEmberDataVersions();
  }

  versionsPromiseHash.ember = versionPromise;

  return RSVP.hash(versionsPromiseHash).then(function(possibleVersions) {
    var emberVersions = possibleVersions.ember;
    var emberDataVersions = possibleVersions.data;
    var versions = findSatisfyingVersions(emberVersions, statement);
    var scenariosMap = {};

    var scenarios = versions.map(function(version) {
      var versionNum = semver.clean(version);
      var scenario = {
        name: 'ember-' + versionNum,
        bower: {
          dependencies: {
            ember: versionNum
          }
        }
      };

      scenariosMap[getMapKey(versionNum)] = scenario;
      return scenario;
    });

    if(withEmberData) {
      versions = findSatisfyingVersions(emberDataVersions, statement);

      versions.forEach(function(version) {
        var versionNum = semver.clean(version);
        var scenario = scenariosMap[getMapKey(versionNum)];

        if(!scenario) { return; }

        scenario.npm = {
          devDependencies: {
            'ember-data': versionNum
          }
        };

        // Ember-Data is no longer needed as a bower dep. after 2.3
        if(semver.lt(versionNum, '2.3.0')) {
          scenario.bower.dependencies['ember-data'] = versionNum;
        }
      });
    }

    return scenarios;
  });
}

function getMapKey(v) {
  return semver.major(v) + '.' + semver.minor(v);
}

function baseScenarios(withEmberData) {
  var beta, canary;

  var scenarios = [{
    name: 'default',
    bower: {
      dependencies: {}
    }
  }];

  beta = {
    name: 'ember-beta',
    allowedToFail: true,
    bower: {
      dependencies: {
        ember: 'components/ember#beta'
      },
      resolutions: {
        ember: 'beta'
      }
    }
  };

  canary = {
    name: 'ember-canary',
    allowedToFail: true,
    bower: {
      dependencies: {
        ember: 'components/ember#canary'
      },
      resolutions: {
        ember: 'canary'
      }
    }
  };

  if (withEmberData) {
    beta.npm = {
      devDependencies: {
        'ember-data': 'components/ember-data#beta'
      },
      resolutions: {
        'ember-data': 'beta'
      }
    };

    canary.npm = {
      devDependencies: {
        'ember-data': 'components/ember-data#canary'
      },
      resolutions: {
        'ember-data': 'canary'
      }
    };
  }

  return scenarios.concat([beta, canary]);
}
