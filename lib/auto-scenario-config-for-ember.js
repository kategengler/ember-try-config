'use strict';
var semver = require('semver');
var RSVP = require('rsvp');
var getEmberVersions = require('./get-ember-versions');
var getAvailabeDependencyVersions = require('./get-available-dependency-versions');
var findSatisfyingVersions = require('./find-satisfying-versions');
var fetchFileFromGithub = require('../lib/fetch-file-from-github');
var object = require('lodash/object');

var included = {
  npm: require('../data/include/npm'),
  bower: require('../data/include/bower'),
};

module.exports = function generateConfig(options) {
  return generateScenariosFromSemver(options.versionCompatibility, options.availableVersions).then(function(scenarios) {
    return { scenarios:  [].concat(baseScenarios(options.versionCompatibility.withEmberData), scenarios) };
  });
};

function generateScenariosFromSemver(semverStatements, availableVersions) {
  var withEmberData = semverStatements.withEmberData;
  var statement = semverStatements.ember;
  var versionsPromiseHash = {};
  var emberVersions = availableVersions ? RSVP.resolve(availableVersions) : getEmberVersions();
  var scenariosMap = {};
  var scenarios;

  return emberVersions.then(function(emberVersions) {
    var versions = findSatisfyingVersions(emberVersions, statement);
    var versionNum, scenario;

    /*
      Generate Ember scenarios
     */
     scenarios = versions.map(function(version) {
      versionNum = semver.clean(version);
      scenario = {
        name: 'ember-' + versionNum,
        bower: {
          dependencies: {
            ember: versionNum
          }
        },
        npm: {
          devDependencies: {}
        }
      };

      // Add the current scenario to the map so we can fetch it easily later
      scenariosMap[getMapKey(versionNum)] = scenario;

      return scenario;
    });

    return getAvailabeDependencyVersions();
  }).then(function(dependencyVersions) {
    var dependencies = [];

    if (withEmberData) {
      var versions = findSatisfyingVersions(dependencyVersions, statement);
      var versionNum, scenario;

      /*
        Inject dependencies
       */

       versions.forEach(function(version) {
         version = semver.clean(version);
         scenario = scenariosMap[getMapKey(version)];

         if (scenario && semver.gte(version, '1.13.0')) {
           var packageJson = fetchFileFromGithub('ember-new-output', version, 'package.json', { cache: true});
           var bowerJson = fetchFileFromGithub('ember-new-output', version, 'bower.json', { cache: true});

           packageJson.then(function(scenario, json) {
             scenario.npm.devDependencies = object.merge({}, getDependencies('npm', json.devDependencies), scenario.npm.devDependencies);
           }.bind(undefined, scenario));

           bowerJson.then(function(scenario, json) {
             scenario.bower.dependencies = object.merge({}, getDependencies('bower', json.dependencies), scenario.bower.dependencies);
           }.bind(undefined, scenario));

           dependencies.push(packageJson, bowerJson);
         }
       });
    }

    return RSVP.allSettled(dependencies);
  }).then(function() {
    return scenarios;
  });
}

function getDependencies(source, dependencies) {
  var deps = {};

  included[source].forEach(function(d) {
    if(dependencies[d]) {
      deps[d] = dependencies[d];
    }
  });

  return deps;
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

  /*
    Add ember-data to npm dependencies
   */
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
