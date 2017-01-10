'use strict';

var Argument = require("./Argument.js");

/**
 * Create a new command
 * @param {String}   command name
 * @param {String}   command descrption
 * @param {Function} command callback
 */
function Command(name, description, callback) {
    this._name = name;
    this._description = description;
    this._callback = callback;
    this._arguments = [];

    return this;
}

/**
 * @param  {String}   name
 * @param  {String}   description
 * @param  {String}   defaultValue
 * @param  {Function} callback
 * @return {Command}
 */
Command.prototype.addArgument = function (name, description, defaultValue, callback) {
    if ("object" === name && void(0) !== name.constructor && "Argument" === name.constructor.name){
        this._arguments.push(argument);
    } else {
        this._arguments.push(new Argument(name, description, defaultValue, callback));    
    }

    return this;
};

/**
 * Launche the command
 * @param  {Array} args
 */
Command.prototype.runCommand = function (args) {
    if (typeof this.getCallback() === 'function') {
        return this.getCallback().apply(this, args);
    }

    helpers.log.write('The command ' + this.getName() + ' doesn\'t have a valid function callback.');
};

/**
 * Get arguments list
 * @return {Array}
 */
Command.prototype.getArguments = function () { 
    return this._arguments;
};

/**
 * Get command name
 * @return {String}
 */
Command.prototype.getName = function () { 
    return this._name;
};

/**
 * Get command description
 * @return {Srting}
 */
Command.prototype.getDescription = function () { 
    return this._description || false;
};

/**
 * Get command callback
 * @return {Function}
 */
Command.prototype.getCallback = function () { 
    return this._callback;
}

module.exports = Command;