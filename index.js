"format cjs";

var engine = require('./engine');
var conventionalCommitTypes = require('conventional-commit-types');
var configLoader = require('commitizen').configLoader;
var config = configLoader.load();
module.exports = engine({
  types: config.types || conventionalCommitTypes.types
});
