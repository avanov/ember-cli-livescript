var Filter     = require('broccoli-filter');
var checker    = require('ember-cli-version-checker');
var defaults   = require('lodash').defaults;
var liveScript = require('LiveScript');

var LiveScriptFilter = function(inputTree, options) {
    if (!(this instanceof LiveScriptFilter))
        return new LiveScriptFilter(inputTree, options);

    Filter.call(this, inputTree, options);

    options = options || {bare: true};
    this.bare = options.bare;
};
LiveScriptFilter.prototype = Object.create(Filter.prototype);
LiveScriptFilter.prototype.constructor = LiveScriptFilter;
LiveScriptFilter.prototype.extensions = ['ls'];
LiveScriptFilter.prototype.targetExtension = 'js';
LiveScriptFilter.prototype.processString = function(string) {
    var liveScriptOptions = { bare: this.bare };
    try {
        return liveScript.compile(string, liveScriptOptions);
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
    return LiveScriptFilter(tree, options);
};

module.exports = {
    name: "Ember CLI LiveScript Addon",

    shouldSetupRegistryInIncluded: function() {
        return !checker.isAbove(this, '0.2.0');
    },

    getConfig: function() {
        var brocfileConfig = {};
        return defaults(
            this.project.config(process.env.EMBER_ENV).liveScriptOptions || {},
            brocfileConfig,
            {}
        );
    },

    setupPreprocessorRegistry: function(type, registry) {
        var plugin = new LiveScriptPreprocessor(this.getConfig());
        registry.add('js', plugin);
    },

    included: function(app) {
        this.app = app;
        if (this.shouldSetupRegistryInIncluded()) {
            this.setupPreprocessorRegistry('parent', app.registry);
        }
    }
};
