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
  res.push('<a name="' + linkAnchor + '"></a>**' + name + '**  ');
  res.push('');
  res.push('| Name | Type | Required | Description |');
  res.push('| ---- | ---- | -------- | ----------- |');
  Object.keys(definition.properties).map(function (propName) {
    var prop = definition.properties[propName];
    var typeCell = dataTypeTransformer(new Schema(prop));
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
