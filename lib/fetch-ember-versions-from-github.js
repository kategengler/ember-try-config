'use strict';

var fetch = require('make-fetch-happen');
var RSVP = require('rsvp');

module.exports = function fetchEmberVersionsFromGithub(options) {
  options = options || {};
  var get = options.fetch || fetch;
  var perPage = options.perPage || 100;
  var page = options.page || 0;
  var tags = options.tags || [];
  var accessToken = options.accessToken || process.env.GITHUB_TOKEN;

  var params = 'per_page=' + perPage + '&page=' + page;

  if (accessToken) {
    params += '&access_token=' + accessToken;
  }

  var url = 'https://api.github.com/repos/components/ember/tags?' + params;

  var fetchOptions = {
    cacheManager: __dirname + '/../.http-cache',
    timeout: 1000
  };

  return RSVP.resolve(get(url, fetchOptions))
    .then(function(res) {
      return res.json();
    }).then(function(json) {
      if (!Array.isArray(json)) {
        throw new Error('Expected array result, received: ' + JSON.stringify(json, null, 2));
      }

      json.forEach(function(tag) {
        tags.push(tag.name);
      });

      if (json.length === perPage) {
        return fetchEmberVersionsFromGithub({
          accessToken: accessToken,
          perPage: perPage,
          page: page + 1,
          tags: tags
        });
      }

      return tags;
    }).catch(function(err) {
      if (options.logErrors) {
        console.log(err.stack);
        throw err;
      }
      return [];
    });
};
