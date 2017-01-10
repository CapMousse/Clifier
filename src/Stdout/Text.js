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
    /**
     * Write content to stdout
     * @param {String} content
     */
    write: (content) => {
        process.stdout.write(content);
    },

    /**
     * Transform string with style for stdout
     * @param {String} content
     */
    style: function (content, style) {
        if (void(0) === styles[style]) {
            throw new Error('Style '+style+' doesn\'t exists');
        }

        return styles[style][0] + content + styles[style][1];
    },

    /**
     * Write success message
     * @param {String} content
     */
    success: function (content) {
        this.write(this.style(this.style(content + "\r\n", "green"), "bold"));
    },

    /**
     * Write warning message
     * @param {String} content
     */
    warning: function (content) {
        this.write(this.style(this.style(content + "\r\n", "yellow"), "bold"));
    },

    /**
     * Write error message
     * @param {String} content
     */
    error: function (content) {
        this.write(this.style(this.style(content + "\r\n", "red"), "bold"));
    }
};