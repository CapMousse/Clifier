'use strict';

/**
 * @param {String}   name         argument name
 * @param {String}   description  argument description
 * @param {String}   defaultValue default argument value
 * @param {Function} callback     argument callback when called       
 */
function Argument(name, description, defaultValue, callback) {
    this._name = name;
    this._description = description;
    this._defaultValue = defaultValue;
    this._callback = callback;
}

/**
 * Parse argument
 * @return {mixed}
 */
Argument.prototype.parse = function (options) {
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

        if (typeof this.getCallback() === 'function') {
            value = this.getCallback().call(this, value);
        }

        return value;
    }

    if (void(0) !== value && typeof this.getCallback() === 'function') {
        value = this.getCallback().call(this, value);
    }

    if (void(0) === value && null !== this.getDefaultValue()) {
        value = this.getDefaultValue();
    }


    return value;
};

/**
 * Get argument name
 * @return {String}
 */
Argument.prototype.getName = function () { 
    return this._name;
};

/**
 * Get argument description
 * @return {String}
 */
Argument.prototype.getDescription = function () { 
    return this._description || false;
};

/**
 * Get argument default value
 * @return {String}
 */
Argument.prototype.getDefaultValue = function () { 
    return this._defaultValue;
};

/**
 * Get argument callback
 * @return {Function}
 */
Argument.prototype.getCallback = function () { 
    return this._callback;
};

module.exports = Argument;