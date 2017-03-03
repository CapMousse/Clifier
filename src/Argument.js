'use strict';

class Argument {
    /**
     * @param {String}   name         argument name
     * @param {String}   description  argument description
     * @param {String}   defaultValue default argument value
     * @param {Function} filter       argument callback when called       
     */
    constructor (name, description, defaultValue, filter) {
        this.checkNameValidity(name);

        this._name = name;
        this._description = description;
        this._defaultValue = defaultValue;
        this._filter = filter;
    }


    /**
     * Check if argument name is valid
     * @param {String} name
     */
    checkNameValidity (name) {
        const invalid = ['--quiet', '--verbose', '-v'];

        let nameArray = name.split(',');

        for (let i of nameArray) {
            if (invalid.indexOf(i) !== -1) {
                throw new Error(i + " is a reserved argument");
            }
        }
    }

    /**
     * Parse argument
     * @return {mixed}
     */
    parse (options) {
        let arg = new RegExp('(^'+this.getName().split(',').join('|^')+')$', 'ig');
        let name;
        let value;

        for (let option of options) {
            name    = option[0];
            value   = option[1] || undefined;

            if (!arg.test(name)) {
                value = undefined;
                continue;
            }

            if (undefined === value) {
                value = this.getDefaultValue();
            }

            if (typeof this.getFilter() === 'function') {
                value = this.getFilter().call(this, value);
            }

            return value;
        }

        if (undefined !== value && typeof this.getFilter() === 'function') {
            value = this.getFilter().call(this, value);
        }

        if (undefined === value) {
            value = this.getDefaultValue();
        }

        return value;
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
    getDescription () { 
        return this._description || false;
    }

    /**
     * Get argument default value
     * @return {String}
     */
    getDefaultValue () { 
        return this._defaultValue;
    }

    /**
     * Get argument callback
     * @return {Function}
     */
    getFilter () { 
        return this._filter;
    }

    /**
     * Check if an argument il valid
     * @param {string} argument 
     */
    test (argument) {
        let elems      = this.getName().split(',');
        let validation = new RegExp('(^'+elems.join('|^')+')$', 'ig');

        return validation.test(argument);
    }
}

module.exports = Argument;