'use strict';

const Command   = require('./Command.js');
const Text      = require('./Stdout/Text.js');
const Progress  = require('./Stdout/Progress.js');
const Table     = require('./Stdout/Table.js');

class Cli extends Text {
    constructor() {
        super();
        this._name = "";
        this._version = "";
        this._description = "";
        this._commands = {};
        this._defaultCommand = null;
    }

    /**
     * @param {String} name
     * @return {Cli}
     */
    name (name) {
        this._name = name;
        return this;
    }

    /**
     * @param {String} version
     * @return {Cli}
     */
    version (version) {
        this._version = version;
        return this;
    }

    /**
     * @param {String} description
     * @return {Cli}
     */
    description (description) {
        this._description = description;
        return this;
    }

    /**
     * @param  {String}   name
     * @param  {String}   description
     * @return {Command}
     */
    command (name, description) {
        var command;

        if ("Command" === name.constructor.name){
            command = name;
        } else {
            command = new Command(name, description);
        }

        this._commands[command.getName()] = command;

        return command;
    }

    /**
     * Find a command
     * @param  {String} name
     * @return {Command}
     */
    findCommand (name) {
        if (void(0) !== this._commands[name]) {
            return this._commands[name];
        }

        this.write('The command ' + name + ' doesn\'t exists. Try help to get the list of available commands');
        return;
    }


    /**
     * Parse cli command
     * @param  {String} args
     * @return {Object}
     */
    parseCommand (args) {
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
    }

    /**
     * Order option by alphabetical order
     * @param  {Array}
     * @param  {Object}
     * @return {Array}
     */
    orderOptions (command, options) {
        var ordered = [],
            args = command ? command.getArguments() : [],
            len = args.length,
            i = 0;

        for (; i < len; i++) {
            ordered.push(args[i].parse(options));
        }

        return ordered;
    }

    /**
     * Display help text
     */
    displayHelp () {
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

        this.write(help);
        this.end()
    }

    /**
     * Launch Cli
     */
    run () {
        var _this = this;

        this.command('help', 'Show help for ' + this.getName()).action(() => {
            this.displayHelp.call(_this);
        });

        var args = Object.keys(arguments).length ? Array.prototype.slice.call(arguments) : process.argv.slice(2);

        if (args.length === 0) {
            args.push('help');
        }

        var parsed = this.parseCommand(args);
        var parsedArgs = this.orderOptions(parsed.command, parsed.options);

        parsed.command ? parsed.command.runCommand(parsedArgs) : this.end();
    }

    /**
     * Stop Cli
     */
    end () {
        process.exit();
    }

    /**
     * Get Cli name
     */
    getName () {
        return this._name;
    }

    /**
     * Get Cli version
     */
    getVersion () {
        return this._version || false;
    }

    /**
     * Get Cli description
     */
    getDescription () {
        return this._description || false;
    }

    /**
     * Get Cli commands
     */
    getCommands () {
        return this._commands;
    }

    /**
     * Display or create a table
     * @param  {Array}
     * @param  {Array}
     * @param  {Boolean}
     */
    table (headers, rows) {
        var table = new Table(headers, rows);
        this.write(table.getOutput());
        
        return this;
    }

    /**
     * Create a new progress bar
     * @param {String}
     * @param {Number}
     * @param {Boolean}
     */
    progress (name, total, displayTimer) {
        return new Progress(name, total, displayTimer);
    }
}

module.exports = Cli;