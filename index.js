var Filter = require('broccoli-filter');
var liveScript = require('LiveScript');

var LiveScriptFilter = function(inputTree, options) {
    if (!(this instanceof LiveScriptFilter))
        return new LiveScriptFilter(inputTree, options);

    Filter.call(this, inputTree, options);

    options = options || {};
    this.bare = options.bare;
};
LiveScriptFilter.prototype = Object.create(Filter.prototype);
LiveScriptFilter.prototype.constructor = LiveScriptFilter;

LiveScriptFilter.prototype.extensions = ['ls'];
LiveScriptFilter.prototype.targetExtension = 'js';

LiveScriptFilter.prototype.processString = function(string) {
    var liveScriptOptions = { bare: this.bare };
    try {
        var compiledJS = liveScript.compile(string, liveScriptOptions);
        return compiledJS;
    } catch (err) {
        err.line = err.location && err.location.first_line;
        err.column = err.location && err.location.first_column;
        throw err;
    }
};


var LiveScriptPreprocessor = function(options) {
    this.name = 'ember-cli-livescript';
    this.ext = 'js';
    this.options = options || {bare: true};
};

LiveScriptPreprocessor.prototype.toTree = function(tree, inputPath, outputPath) {
    var options = {
        bare: true,
        srcDir: inputPath,
        destDir: outputPath
    };
    var liveScriptTree = LiveScriptFilter(tree, options);
    return liveScriptTree;
};


var LiveScriptAddon = function(project) {
    this.project = project;
    this.name = 'Ember CLI LiveScript Addon';
};

LiveScriptAddon.prototype.included = function(app) {
    this.app = app;
    var plugin = new LiveScriptPreprocessor(this.app.options.liveScriptOptions);
    this.app.registry.add('js', plugin);
};

// This is just here because it was required in ember-cli v0.0.37.
// To be removed when compatibility breaks.
LiveScriptAddon.prototype.treeFor = function() {};

module.exports = LiveScriptAddon;
