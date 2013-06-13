/*
 * Clifier
 * https://github.com/CapMousse/clifier
 *
 * Copyright (c) 2013 Jeremy Barbe
 * Licensed under the WTFPL license.
 */

'use strict';

var helpers = require('./helpers');

/***************************/
/********* Helpers *********/
/***************************/
String.prototype.repeat = function(count) {
    if (count < 1){
        return '';  
    } 

    var result = '', pattern = this.valueOf();

    while (count > 0) {
        if (count & 1){
            result += pattern;
        }
        count >>= 1, pattern += pattern;
    }

    return result;
};


function Argument(name, description, defaultValue, filter) {
    this._name = name;
    this._description = description;
    this._defaultValue = defaultValue;
    this._filter = filter;
}

Argument.prototype.getName = function(){
    return this._name;
};

Argument.prototype.getDescription = function(){
    return this._description || false;
};

Argument.prototype.getDefaultValue = function(){
    return this._defaultValue;
};

Argument.prototype.getFilter = function(){
    return this._filter;
};

Argument.prototype.parse = function(options) {
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

    // Argument was not called by user, try "default" value and call filter
    if (void(0) === value && null !== this.getDefaultValue()) {
        value = this.getDefaultValue();
    }

    if (typeof this.getFilter() === 'function') {
        value = this.getFilter().call(this, value);
    }

    return value;
};



function Command(name, description, exec) {
    this._name = name;
    this._description = description;
    this._function = exec;
    this._arguments = [];

    return this;
}

Command.prototype.addArgument = function(name, description, defaultValue, filter) {
    var argument;

    if ("object" === name && void(0) !== name.constructor && "Argument" === name.constructor.name){
        argument = name;
    } else {
        argument = new Argument(name, description, defaultValue, filter);
    }

    this._arguments.push(argument);

    return this;
};

Command.prototype.getArguments = function() {
    return this._arguments;
};

Command.prototype.runCommand = function(args) {
    if (typeof this.getFunction() === 'function') {
        return this.getFunction().apply(this, args);
    }

    helpers.write('The command ' + this._name + ' doesn\'t have a valid function callback.');
    return;
};

Command.prototype.getName = function(){
    return this._name;
};

Command.prototype.getDescription = function(){
    return this._description || false;
};


Command.prototype.getFunction = function(){
    return this._function;
};


function Cli(name, version, description) {
    this._name = name;
    this._version = version;
    this._description = description;
    this._commands = {};

    return this;
}

Cli.prototype.getName = function() {
    return this._name;
};

Cli.prototype.getVersion = function() {
    return this._version || false;
};

Cli.prototype.getDescription = function() {
    return this._description || false;
};

Cli.prototype.addCommand = function(name, description, exec) {
    var command;

    if ("Command" === name.constructor.name){
        command = name;
    } else {
        command = new Command(name, description, exec);
    }

    this._commands[command.getName()] = command;

    return command;
};

Cli.prototype.getCommands = function(){
    return this._commands;
};

Cli.prototype.findCommand = function(name) {
    if (void(0) !== this._commands[name]) {
        return this._commands[name];
    }

    helpers.log.write('The command ' + name + ' doesn\'t exists. Try help to get the list of available commands');
    return;
};

Cli.prototype.parseCommand = function(args) {
    var command = args.shift(),
        options = [],
        len = args.length,
        i = 0,
        arg,
        option;

    for (; i < len; i++) {
        arg = args[i];

        if (/^[\-]{1,2}(.*)$/.test(arg)){
            if (void(0) !== option) {
                options.push([option]);             
            }

            option = arg;
            continue;
        } 

        if (void(0) !== option && void(0) !== arg) {
            options.push([option, arg]);
            option = void(0);
        }
    }

    if (option) {
        options.push([option]);
    }

    return {
        command: this.findCommand(command), 
        options: options
    };
};

Cli.prototype.orderOptions = function(command, options) {
    var ordered = [],
        args = command ? command.getArguments() : [],
        len = args.length,
        i = 0;

    for (; i < len; i++) {
        ordered.push(args[i].parse(options));
    }

    return ordered;
};

Cli.prototype.run = function() {
    var _this = this;

    this.addCommand('help', 'Show help for ' + this.getName(), function(){
        _this.displayHelp.call(_this);
    });

    var args = Object.keys(arguments).length ? Array.prototype.slice.call(arguments) : process.argv.slice(2);

    if (args.length === 0) {
        args.push('help');
    }

    var parsed = this.parseCommand(args);
    var parsedArgs = this.orderOptions(parsed.command, parsed.options);

    return parsed.command ? parsed.command.runCommand(parsedArgs) : this.end();
};

Cli.prototype.end = function() {
    process.exit();
};

Cli.prototype.displayHelp = function(){
    var help = "",
        commands = this.getCommands(),
        command,
        args,
        arg;

    help += "\n" + this.getName();

    if (this.getVersion()) {
        help += ' v' + this.getVersion();
    }

    if (this.getDescription()) {
        help += "\n" + this.getDescription();
    }

    help += "\n\nUsage : " + this.getName() + " [command] [options]";

    help += "\n\nCommand list : \n";

    for (command in commands) {
        command = commands[command];
        args = command.getArguments();

        if (args.length === 0) {
            help += "    " + command.getName() + '                ' + (command.getDescription() || '');
        } else {
            help += "    " + command.getName() + ' [options]      ' + (command.getDescription() || '');
        }
        

        for (arg in args) {
            arg = args[arg];

            help += "\n        " + arg.getName() + '\t' + (arg.getDescription() || '');
        }


        help += "\n";
    }

    helpers.log.write(help);
    process.exit(1);
};

/**
 * Expose Clifier.
 */

module.exports = {
    'Cli':  Cli,
    'Command':  Command,
    'Argument': Argument,
    'helpers': helpers
};
