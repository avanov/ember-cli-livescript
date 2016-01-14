var Filter     = require('broccoli-filter');
var checker    = require('ember-cli-version-checker');
var defaults   = require('lodash').defaults;
var liveScript = require('livescript');


LiveScript.prototype = Object.create(Filter.prototype);

/**
   * Abstract base-class for filtering purposes.
   *
   * Enforces that it is invoked on an instance of a class which prototypically
   * inherits from Filter, and which is not itself Filter.
   */
LiveScript.prototype.constructor = LiveScript;
function LiveScript(inputNode, options) {
    Filter.call(this, inputNode, options);
    options = options || {bare: true};
    this.bare = options.bare;
}

// An array of file extensions to process
LiveScript.prototype.extensions = ['ls'];

// The file extension of the corresponding output files
LiveScript.prototype.targetExtension = 'js';

/**
   * Abstract method `processString`: must be implemented on subclasses of
   * Filter.
   *
   * The return value is written as the contents of the output file
   */
LiveScript.prototype.processString = function(content, relativePath) {
    var liveScriptOptions = {
        bare: this.bare
    };
    try {
        return liveScript.compile(content, liveScriptOptions);
    } catch (err) {
        err.line = err.location && err.location.first_line;
        err.column = err.location && err.location.first_column;
        throw err;
    }
};



var LiveScriptPreprocessor = function(options) {
    this.name = 'ember-cli-livescript';
    this.ext = 'ls';
    this.options = options || {bare: true};
};


LiveScriptPreprocessor.prototype.toTree = function(tree, inputPath, outputPath) {
    var options = {
        bare: true
    };
    return new LiveScript(tree, options);
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
