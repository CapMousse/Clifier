'use strict';

class Argument {
    /**
     * @param {String}   name         argument name
     * @param {String}   description  argument description
     * @param {String}   defaultValue default argument value
     * @param {Function} filter       argument callback when called       
     */
    constructor (name, description, defaultValue, filter) {
        this._name = name;
        this._description = description;
        this._defaultValue = defaultValue;
        this._filter = filter;
    }

    /**
     * Parse argument
     * @return {mixed}
     */
    parse (options) {
        var len = options.length,
            arg = this.getName().split(','),
            i = 0,
            name,
            value;

        for (; i < len; i++) {
            name = options[i][0];
            value = options[i][1] || void(0);

            if (arg.indexOf(name) === -1) {
                value = void(0);
                continue;
            }

            if (void(0) === value && null !== this.getDefaultValue()) {
                value = this.getDefaultValue();
            }

            if (typeof this.getFilter() === 'function') {
                value = this.getFilter().call(this, value);
            }

            return value;
        }

        if (void(0) !== value && typeof this.getFilter() === 'function') {
            value = this.getFilter().call(this, value);
        }

        if (void(0) === value && null !== this.getDefaultValue()) {
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
}

module.exports = Argument;