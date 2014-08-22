var livescript = require('broccoli-livescript');

function LiveScriptPreprocessor(options) {
  this.name = 'ember-cli-livescript';
  this.ext = 'js';
  this.options = options || {};
}

LiveScriptPreprocessor.prototype.toTree = function(tree, inputPath, outputPath) {
  var options = {
    bare: true,
    srcDir: inputPath,
    destDir: outputPath
  };

  return livescript(tree, options);
};

module.exports = LiveScriptPreprocessor;
