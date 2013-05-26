/*
 * Clifier
 * https://github.com/CapMousse/clifier
 *
 * Copyright (c) 2013 Jeremy Barbe
 * Licensed under the WTFPL license.
 */

'use strict';

var styles = {
    //styles
    'bold'      : ['\u001b[1m',  '\u001b[22m'],
    'italic'    : ['\u001b[3m',  '\u001b[23m'],
    'underline' : ['\u001b[4m',  '\u001b[24m'],

    //colors
    'white'     : ['\u001b[37m', '\u001b[39m'],
    'blue'      : ['\u001b[34m', '\u001b[39m'],
    'green'     : ['\u001b[32m', '\u001b[39m'],
    'red'       : ['\u001b[31m', '\u001b[39m'],
    'yellow'    : ['\u001b[33m', '\u001b[39m']
};

module.exports = {
    write: function(content) {
        process.stdout.write(content);
    },

    error: function(content) {
        this.write(styles['bold'][0] + styles['red'][0] + content + styles['red'][1] + styles['bold'][1]);
    },

    warning: function(content) {
        this.write(styles['bold'][0] + styles['yellow'][0] + content + styles['yellow'][1] + styles['bold'][1]);
    },

    style: function(content, style) {
        if (void(0) === styles[style]) {
            throw new Error('Style '+style+' doesn\'t exists');
        }

        return styles[style][0] + content + styles[style][1];
    }
};