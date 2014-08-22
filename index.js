'use strict';
var path = require('path');
var LiveScriptPreprocessor = require('./lib/livescript-preprocessor');

function LiveScriptAddon(project) {
  this._project = project;
  this.name = 'Ember CLI LiveScript Addon';
}

/* Skip blueprints for the time being

LiveScriptAddon.prototype.blueprintsPath = function() {
  return path.join(__dirname, 'blueprints');
};
*/

LiveScriptAddon.prototype.included = function(app) {
  this.app = app;
  var plugin = new LiveScriptPreprocessor(this.app.options.liveScriptOptions);
  this.app.registry.add('js', plugin);
};

// This is just here because it was required in ember-cli v0.0.37.
// To be removed when compatibility breaks.
LiveScriptAddon.prototype.treeFor = function() {};

module.exports = LiveScriptAddon;
