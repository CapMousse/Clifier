'use strict';

/**
 * Create a new progress bar
 * @param {String}
 * @param {Number}
 * @param {Boolean}
 */
function Progress (name, total, displayTimer) {
    if (void(0) === name) {
        throw new Error('Name required');
    }

    if (void(0) === total) {
        throw new Error('Total required');
    }

    this.name = name;
    this.start = 0;
    this.total = total;
    this.timer = new Date();
    this.displayTimer = displayTimer || false;
    this.readline = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout
    });
}


/**
 * Clear last line on Stdout
 */
Progress.prototype.clearLine = function () {
    if (process.platform === 'darwin') {
        this.readline.output.write('\r');
    } else {
        this.readline.write(null, {ctrl: true, name: 'u'});
    }
};

/**
 * Write a new line on stdout
 * @param  {String} string string to write
 */
Progress.prototype.write = function (string) {
    this.readline.write(string);
}

/**
 * Update progress bar
 * @param  {Number}
 */
Progress.prototype.tick = function (len) {
    var percent, elapsed, width, empty, output;

    if (void(0) === len) {
        len = 1;
    }

    this.start += len;

    percent = this.start / this.total * 100;
    elapsed = new Date() - this.timer;
    width = Math.round(this.start / this.total * 20);
    empty = 20 - width;

    output = this.name + " " + percent.toFixed(0) + "% [" + ("=").repeat(width) + (' ').repeat(empty) + "] ";

    if (this.displayTimer) {
        output += (elapsed / 1000).toFixed(1) + "s";
    }

    this.clearLine();
    this.write(output);
};

/**
 * Stop progress bar
 */
Progress.prototype.stop = function () {
    this.readline.resume();
    this.readline.close();
};

module.exports = Progress;