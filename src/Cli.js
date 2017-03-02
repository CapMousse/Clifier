'use strict';

const Command   = require('./Command.js');
const Text      = require('./Stdout/Text.js');
const Progress  = require('./Stdout/Progress.js');
const Table     = require('./Stdout/Table.js');
const Help      = require('./Stdout/Help.js');

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
        if (name === "help") {
            throw new Error("help is a reserved command");
        }

        let command = new Command(name, description);
        this._commands[command.getName()] = command;

        return command;
    }

    /**
     * Find a command
     * @param  {String} name
     * @return {Command}
     */
    findCommand (name) {
        if (undefined !== this._commands[name]) {
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
                if (option !== undefined) {
                    options.push([option]);             
                }

                option = arg;
                continue;
            } 

            if (undefined !== option && undefined !== arg) {
                options.push([option, arg]);
                option = undefined;
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
     * @param  {Command} command
     * @param  {Array}   options
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
     * Launch Cli
     * @return {void}
     */
    run () {
        let helpCmd = new Command("help", "Show help");

        this._commands[helpCmd.getName()] = helpCmd;

        helpCmd.action(_ => {
            let help = new Help(this);
            
            this.write(help.getHelp());
            this.end();
        });

        var args = Object.keys(arguments).length ? Array.prototype.slice.call(arguments) : process.argv.slice(2);
        
        args = this.checkVerbose(args);
        args = this.checkQuiet(args);

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
     * @param  {Array}  headers
     * @param  {Array}  rows
     * @return {Cli} 
     */
    table (headers, rows) {
        var table = new Table(headers, rows);
        this.write(table.getOutput());
        
        return this;
    }

    /**
     * Create a new progress bar
     * @param {String}  name
     * @param {Number}  total
     * @param {Boolean} displayTimer
     * @return {Progress}
     */
    progress (name, total, displayTimer) {
        return new Progress(name, total, displayTimer, this._quiet);
    }

    /**
     * Enable the verbose mode
     * @param {Array} args
     * @return {Array}
     */
    checkVerbose (args) {
        if (args.indexOf('-v') === -1 && args.indexOf('--verbose') == -1) {
            return args;
        } 

        this._verbose = true;

        if (args.indexOf('-v') !== -1) {
            args.splice(args.indexOf('-v'), 1);
        }

        if (args.indexOf('--verbose') !== -1) {
            args.splice(args.indexOf('--verbose'), 1);
        }
        
        return args;
    }

    /**
     * Enable the quiet mode
     * @param {Array} args
     * @return {Array}
     */
    checkQuiet (args) {
        if (args.indexOf('--quiet') === -1) {
            return args;
        }

        this._quiet = true;
        args.splice(args.indexOf('--quiet'), 1);
        
        return args;
    }
}

module.exports = Cli;