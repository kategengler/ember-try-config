
module.exports = {
  env: {
    mocha: true,
  },
  rules: {
    // JSHint "expr", disabled due to chai expect assertions
    'no-unused-expressions': 0,

    // disabled because describe(), it(), etc. should not use arrow functions
    'prefer-arrow-callback': 0,
  }
};
