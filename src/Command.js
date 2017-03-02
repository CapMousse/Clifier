'use strict';

const Argument = require("./Argument.js");
const Text = require("./Stdout/Text.js");

class Command extends Text {
    /**
     * Create a new command
     * @param {String}      name        command name
     * @param {String}      description descrption
     * @param {null|Action} action      command action
     */
    constructor (name, description, action) {
        super();
        this._name = name;
        this._description = description;
        this._action = action || null;
        this._arguments = [];
    }

    /**
     * @param  {String}   name
     * @param  {String}   description
     * @param  {String}   defaultValue
     * @param  {Function} filter
     * @return {Command}
     */
    argument (name, description, defaultValue, filter) {
        this._arguments.push(new Argument(name, description, defaultValue, filter));
        return this;
    }

    /**
     * Set command action
     * @param {Function} callback
     * @return {Command}
     */
    action (callback) {
        this._action = callback;
        return this;
    }

    /**
     * Launche the command
     * @param  {Array} args
     */
    runCommand (args) {
        if (typeof this.getAction() !== 'function') {
            throw new Error('The command ' + this.getName() + ' doesn\'t have a valid function callback.');
        }

        this.getAction().apply(this, args);
    }

    /**
     * Get arguments list
     * @return {Array}
     */
    getArguments () { 
        return this._arguments;
    }

    /**
     * Get command name
     * @return {String}
     */
    getName () { 
        return this._name;
    }

    /**
     * Get command description
     * @return {Srting}
     */
    getDescription () { 
        return this._description || false;
    }

    /**
     * Get command callback
     * @return {Function}
     */
    getAction () { 
        return this._action;
    }
}

module.exports = Command;