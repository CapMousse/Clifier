'use strict';

/**
 * Repeat a string
 * @param  {Number}
 * @return {String}
 */
String.prototype.repeat = function (count) {
    if (count < 1){
        return '';  
    } 

    var result = '', pattern = this.valueOf();

    while (count > 0) {
        if (count & 1){
            result += pattern;
        }
        count >>= 1, pattern += pattern;
    }

    return result;
};


/**
 * Expose Clifier.
 */

module.exports = {
    'Cli':      require('./Cli.js'),
    'Command':  require('./Command.js'),
    'Argument': require('./Argument.js'),
    'Stdout':   {
        'Text':     require('./Stdout/Text.js'),
        'Progress': require('./Stdout/Progress.js'),
        'Table':    require('./Stdout/Table.js'),
    }
};
