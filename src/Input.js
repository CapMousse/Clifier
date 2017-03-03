'use strict';

class Input {
    /**
     * @param {String}   name         input name
     * @param {Function} validator    input validator regexp
     */
    constructor (name, validator) {
        if (!validator) {
            throw new Error("Validator is mandatory");
        }

        this._name      = name;
        this._validator = new RegExp(validator, 'i');
    }

    /**
     * Get argument name
     * @return {String}
     */
    getName () { 
        return this._name;
    }

    /**
     * Get argument description
     * @return {String}
     */
    getValidator () { 
        return this._validator;
    }

    /**
     * Check if an argument il valid
     * @param {string} argument 
     */
    test (argument) {
        return this.getValidator().test(argument);
    }
}

module.exports = Input;