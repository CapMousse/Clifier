/*
 * Clifier
 * https://github.com/CapMousse/clifier
 *
 * Copyright (c) 2013 Jeremy Barbe
 * Licensed under the WTFPL license.
 */

'use strict';

var readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.clearLine = function() {
    if (process.platform === 'darwin') {
        this.output.write('\r');
    } else {
        this.write(null, {ctrl: true, name: 'u'});
    }
};

function Progress(name, total, displayTimer, asString) {
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
    this.asString = asString || false;
}

Progress.prototype.tick = function(len) {
    var percent, elapsed, width, empty, output;

    if (void(0) === len) {
        len = 1;
    }

    this.start += len;

    if (this.start >= this.total) {
        readline.resume();
        readline.close();
    }

    percent = this.start / this.total * 100;
    elapsed = new Date() - this.timer;
    width = Math.round(this.start / this.total * 20);
    empty = 20 - width;

    output = this.name + " " + percent.toFixed(0) + "% [" + ("=").repeat(width) + (' ').repeat(empty) + "] ";

    if (this.displayTimer) {
        output += (elapsed / 1000).toFixed(1) + "s";
    }

    if (this.asString) {
        return output;
    } else {
        readline.clearLine();
        readline.write(output);   
    }
};

Progress.prototype.stop = function(){
    readline.resume();
    readline.close();
};

module.exports = Progress;