'use strict';

var Command = require('./Command.js');
var Text    = require('./Stdout/Text.js');

/**
 * Create a new Cli
 * @param {String} name
 * @param {String} version
 * @param {String} description
 */
function Cli(name, version, description) {
    this._name = name;
    this._version = version;
    this._description = description;
    this._commands = {};

    return this;
}

/**
 * @param  {String}   name
 * @param  {String}   description
 * @param  {Function} callback
 * @return {Command}
 */
Cli.prototype.addCommand = function (name, description, callback) {
    var command;

    if ("Command" === name.constructor.name){
        command = name;
    } else {
        command = new Command(name, description, callback);
    }

    this._commands[command.getName()] = command;

    return command;
};

/**
 * Find a command
 * @param  {String} name
 * @return {Command}
 */
Cli.prototype.findCommand = function (name) {
    if (void(0) !== this._commands[name]) {
        return this._commands[name];
    }

    Text.write('The command ' + name + ' doesn\'t exists. Try help to get the list of available commands');
    return;
};

/**
 * Parse cli command
 * @param  {String} args
 * @return {Object}
 */
Cli.prototype.parseCommand = function (args) {
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

/**
 * Order option by alphabetical order
 * @param  {Array}
 * @param  {Object}
 * @return {Array}
 */
Cli.prototype.orderOptions = function (command, options) {
    var ordered = [],
        args = command ? command.getArguments() : [],
        len = args.length,
        i = 0;

    for (; i < len; i++) {
        ordered.push(args[i].parse(options));
    }

    return ordered;
};

/**
 * Display help text
 */
Cli.prototype.displayHelp = function () {
    var help        = "",
        commands    = this.getCommands(),
        length      = 0,
        command, args, arg;

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

        help += command.getName() + (args.length ? ' [options]\t' : '          \t') + (command.getDescription() || '');
        
        args.filter(function(elem) {
            if (elem.getName().length > length) {
                length = elem.getName().length;
            }
        });

        for (arg in args) {
            arg = args[arg];


            help += "\n " + arg.getName() + ' '.repeat(length - arg.getName().length) + '\t' + (arg.getDescription() || '');
        }


        help += "\n";
    }

    Text.write(help);
    this.end()
};

/**
 * Launch Cli
 */
Cli.prototype.run = function () {
    var _this = this;

    this.addCommand('help', 'Show help for ' + this.getName(), () => {
        this.displayHelp.call(_this);
    });

    var args = Object.keys(arguments).length ? Array.prototype.slice.call(arguments) : process.argv.slice(2);

    if (args.length === 0) {
        args.push('help');
    }

    var parsed = this.parseCommand(args);
    var parsedArgs = this.orderOptions(parsed.command, parsed.options);

    parsed.command ? parsed.command.runCommand(parsedArgs) : this.end();
};

/**
 * Stop Cli
 */
Cli.prototype.end = () => {
    process.exit();
};

/**
 * Get Cli name
 */
Cli.prototype.getName = function () {
    return this._name;
};

/**
 * Get Cli version
 */
Cli.prototype.getVersion = function () {
    return this._version || false;
};

/**
 * Get Cli description
 */
Cli.prototype.getDescription = function () {
    return this._description || false;
};

/**
 * Get Cli commands
 */
Cli.prototype.getCommands = function () {
    return this._commands;
};

module.exports = Cli;