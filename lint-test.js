'use strict';

let glob = require('glob').sync;

let paths = glob('test/**/*.js').filter(path => !(/fixtures/).test(path));

paths = paths.concat(glob('lib/**/*.js'));

require('mocha-eslint')(paths);
