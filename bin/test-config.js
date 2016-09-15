var util = require('util');
var generateConfig = require('../lib/auto-scenario-config-for-ember');

generateConfig({ versionCompatibility: { ember: '>1.11.0 <=2.5.0', includeDependencies: true }}).then(function(scenarios) {
  console.log(util.inspect(scenarios, false, null));
}, function() {
  console.log('error', arguments);
});
