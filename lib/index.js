/*
 * Clifier
 * https://github.com/CapMousse/clifier
 *
 * Copyright (c) 2013 Jeremy Barbe
 * Licensed under the WTFPL license.
 */

'use strict';

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
    var argument = new Argument(name, description, defaultValue, filter);

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

    console.log('The command ' + this._name + ' doesn\'t have a valid function callback.');
    process.exit();
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


function Clifier(name, version, description) {
    this._name = name;
    this._version = version;
    this._description = description;
    this._commands = {};

    return this;
}

Clifier.prototype.getName = function() {
    return this._name;
};

Clifier.prototype.getVersion = function() {
    return this._version || false;
};

Clifier.prototype.getDescription = function() {
    return this._description || false;
};

Clifier.prototype.addCommand = function(name, description, exec) {
    var command = new Command(name, description, exec);

    this._commands[name] = command;

    return command;
};

Clifier.prototype.getCommands = function(){
    return this._commands;
};

Clifier.prototype.findCommand = function(name) {
    if (void(0) !== this._commands[name]) {
        return this._commands[name];
    }

    console.log('The command ' + name + ' doesn\'t exists. Try help to get the list of available commands');
    process.exit();
};

Clifier.prototype.parseCommand = function(args) {
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

Clifier.prototype.orderOptions = function(command, options) {
    var ordered = [],
        args = command.getArguments(),
        len = args.length,
        i = 0;

    for (; i < len; i++) {
        ordered.push(args[i].parse(options));
    }

    return ordered;
};

Clifier.prototype.run = function() {
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

    return parsed.command.runCommand(parsedArgs);
};

Clifier.prototype.displayHelp = function(){
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

    console.log(help);
};

/*****************************************************/
/****************** CONSOLE HELPERS ******************/
/*****************************************************/

Clifier.prototype.displayTable = function(headers, rows){
    if (void(0) === headers || void(0) === rows){
        return; 
    }

    var output = "";
    var colLength = headers.length;
    var rowLength = rows.length;
    var i = 0;
    var j = 0;
    var colsWidth = [];
    var str;

    for (; i < colLength; i++) {
        for(j = 0 ; j < rowLength; j++) {
            str = rows[j][i].toString().length;

            if (void(0) === colsWidth[i]) {
                colsWidth[i] = str;
                continue;
            }

            if (colsWidth[i] < str) {
                colsWidth[i] = str; 
            }
        }

        if (colsWidth[i] < headers[i].toString().length) {
            colsWidth[i] = headers[i].toString().length; 
        }
    }


    //setup header
    for (i = 0; i < 3; i++ ) {
        output += (1 !== i)  ? "+-" : "|";

        for (j = 0; j < colLength; j++){
            if (1 !== i) {
                if (0 !== j) {
                    output += "-";
                }

                output += '-'.repeat(colsWidth[j]) + "-+";
                continue;
            } else {
                output += ' ';
            }

            output += headers[j];
            str = headers[j].toString();

            if (colsWidth[j] > str.length) {
                output += ' '.repeat(colsWidth[j]-str.length);
            }

            output += (1 !== i)  ? "-+-" : " |";
        }

        output += "\n";
    }

    //setup body
    for (i = 0; i < rowLength; i++ ) {
        output += "| ";

        for (j = 0; j < colLength; j++){
            output += rows[i][j];
            str = rows[i][j].toString();

            if (colsWidth[j] > str.length) {
                output += ' '.repeat(colsWidth[j]-str.length);
            }

            if (j < colLength-1) {
                output += " | ";
            }
        }

        output += " |\n";
    }

    output += (output.split("\n").shift()) + "\n";

    console.log(output);
};

/**
 * Expose Clifier.
 */

exports = module.exports = Clifier;
