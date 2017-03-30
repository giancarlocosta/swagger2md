'use strict';

var anchor = require('../lib/anchor');
var dataTypeTransformer = require('./dataTypes');
var inArray = require('../lib/inArray');
var Schema = require('../models/schema');

/**
 * @param {type} name
 * @param {type} definition
 * @return {type} Description
 */
var processDefinition = function processDefinition(name, definition) {
  var res = [];
  var required = 'required' in definition ? definition.required : [];
  var linkAnchor = anchor(name);

  // Add anchor with name
  res.push('## <a name="' + linkAnchor + '"></a>**' + name + '**  ');
  res.push(definition.description);
  res.push('');
  res.push('| Name | Type | Required | Description |');
  res.push('| ---- | ---- | -------- | ----------- |');
  Object.keys(definition.properties).map(function (propName) {
    var prop = definition.properties[propName];
    var typeCell = '';
    if (prop.type === 'array' && prop.items.oneOf) {
      for (let i = 0; i < prop.items.oneOf.length; i++) {
        var obj = prop.items.oneOf[i];
        var t;
        var link;
        if (obj.$ref) {
          t = obj.$ref.match(/\/([^/]*)$/i)[1];
          link = anchor(t);
          typeCell += '[' + '[' + t + '](#' + link + ')' + ']';
        } else if (obj.type) {
          typeCell += '[' + obj.type + ']';
        }

        if (i + 1 < prop.items.oneOf.length) {
          typeCell += ' or ';
        }
      }
    } else {
      typeCell = dataTypeTransformer(new Schema(prop));
    }
    var requiredCell = inArray(propName, required) ? 'Yes' : 'No';
    var descriptionCell = 'description' in prop ? prop.description : '';
    res.push('| ' + propName + ' | ' + typeCell + ' | ' + requiredCell + ' | ' + descriptionCell + ' |');
  });

  return res.length ? res.join('\n') : null;
};
module.exports.processDefinition = processDefinition;

/**
 * @param {type} definitions
 * @return {type} Description
 */
module.exports = function (definitions) {
  var res = [];
  Object.keys(definitions).map(function (definitionName) {
    return res.push(processDefinition(definitionName, definitions[definitionName]));
  });
  if (res.length > 0) {
    res.unshift('---');
    res.unshift('# **MODELS**');
    res.unshift('<br/><br/>');
    return res.join('\n');
  }
  return null;
};
