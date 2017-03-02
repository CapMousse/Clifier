'use strict';

/**
 * Repeat a string
 * @param  {Number} count
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
const Clifier = require('./Cli.js');
const cli = new Clifier();

module.exports = cli;
