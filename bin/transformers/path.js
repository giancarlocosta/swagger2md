'use strict';

var inArray = require('../lib/inArray');
var transformResponses = require('./pathResponses');
var transformParameters = require('./pathParameters');
var security = require('./security');

/**
 * Allowed methods
 * @type {string[]}
 */
var ALLOWED_METHODS = ['head', 'get', 'post', 'put', 'patch', 'delete', 'options'];

module.exports = function (path, data, parameters) {
  var res = [];
  var pathParameters = null;

  if (path && data) {
    // Make path as a header
    res.push(`<br/>`);
    res.push('### ' + path);
    res.push('---');

    // Check if parameter for path are in the place
    if ('parameters' in data) {
      pathParameters = data.parameters;
    }

    // Go further method by methods
    Object.keys(data).map(function (method) {
      if (inArray(method, ALLOWED_METHODS)) {
        // Set method as a subheader
        res.push('## ***' + method.toUpperCase() + '***');
        var pathInfo = data[method];

        // Set summary
        if ('summary' in pathInfo) {
          res.push('**Summary:** ' + pathInfo.summary + '\n');
        }

        // Set description
        if ('description' in pathInfo) {
          res.push('**Description:** ' + pathInfo.description + '\n');
        }

        // Build parameters
        if ('parameters' in pathInfo || pathParameters) {
          res.push(transformParameters(pathInfo.parameters, pathParameters, parameters) + '\n');
        }

        // Request Example if any
        if ('requestExample' in pathInfo) {
          let desc;

          res.push('**Request Example:** \n');
          try {
            const obj = JSON.parse(pathInfo.requestExample.toString());
            desc = JSON.stringify(obj, null, 3);
          } catch (e) {
            desc = pathInfo.requestExample;
            console.log(`requestExample for path ${path} (method: ${method}) may not have been formatted correctly. If JSON, it needs to be escaped.`);
          }
          res.push('```');
          res.push(desc);
          res.push('```');
        }

        // Build responses
        if ('responses' in pathInfo) {
          res.push(transformResponses(pathInfo.responses) + '\n');
        }

        if ('responseExample' in pathInfo) {
          let desc;

          res.push('**Response Example:** \n');
          try {
            const obj = JSON.parse(pathInfo.responseExample.toString());
            desc = JSON.stringify(obj, null, 3);
          } catch (e) {
            desc = pathInfo.responseExample;
            console.log(`responseExample for path ${path} (method: ${method}) may not have been formatted correctly. If JSON, it needs to be escaped.`);
          }
          res.push('```');
          res.push(desc);
          res.push('```');
        }

        // Build security
        if ('security' in pathInfo) {
          res.push(security(pathInfo.security) + '\n');
        }
      }
    });
  }
  return res.length ? res.join('\n') : null;
};
