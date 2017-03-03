'use strict';

const Argument = require("./Argument.js");
const Input = require("./Input.js");
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
        this._inputs = [];
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
     * @param  {String}   name
     * @param  {String}   validator
     * @return {Command}
     */
    input (name, validator) {
        this._inputs.push(new Input(name, validator));
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
    runCommand (inputs, args) {
        if (typeof this.getAction() !== 'function') {
            throw new Error('The command ' + this.getName() + ' doesn\'t have a valid function callback.');
        }
        
        this.getAction()(...inputs, ...args);
    }

    /**
     * Get arguments list
     * @return {Array}
     */
    getArguments () { 
        return this._arguments;
    }

    /**
     * Get arguments list
     * @return {Array}
     */
    getInputs () { 
        return this._inputs;
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