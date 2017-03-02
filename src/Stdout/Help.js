"use strict";

const Text = require('./Text.js');

class Help extends Text {

    /**
     * @param {Cli} cli
     */
    constructor (cli) {
        super();
        
        this._cli = cli;
        this._output = "\n";
        this._length = 0;

        this.setIntro();
        this.setCommands();
        this.setOptions();
    }
 
    /**
     * Get help intro
     */
    setIntro () {
        this._output += this._cli.getName();

        if (this._cli.getVersion()) {
            this._output += ' v' + this._cli.getVersion();
        }

        if (this._cli.getDescription()) {
            this._output += "\n" + this._cli.getDescription();
        }

        this._output += "\n\n" + this.style("USAGE : ", "bold")  + "\n\n";
        this._output += " " + this._cli.getName();
        this._output += this.style(" [command]", "yellow");
        this._output += this.style(" [options]", "blue");
    }

    /**
     * Get command preformated
     */
    getCommands () {
        var parsedCommands = [],
            commands = this._cli.getCommands();

        Object.keys(commands).forEach((name) => {
            var command = commands[name],
                txt = "",
                length = 0,
                args = command.getArguments(),
                argDoc = [];

            length += command.getName().length;
            txt += " " + this.style(command.getName(), "yellow");

            args.forEach((arg) => {
                let name = arg.getName().split(',')[0];
                length += name.length + 1;
                txt += " "+ this.style(name, "blue");
                argDoc.push([
                    "  "+ this.style(name, "blue"),
                    arg.getDescription(),
                    name.length + 2
                ]);
            });

            if (length > this._length) {
                this._length = length;
            }
            
            parsedCommands.push([txt, command.getDescription(), length, argDoc]);
        });

        return parsedCommands;
    }

    /**
     * Get command list
     */
    setCommands () {
        var commands = this.getCommands();

        this._output += "\n\n" + this.style("COMMANDS :", "bold") + " \n\n";

        commands.forEach((command) => {
            this._output += command[0] + ' '.repeat(this._length-command[2]) + '\t' + command[1] + "\n";

            command[3].forEach((arg) => {
                this._output += arg[0] + ' '.repeat(this._length-arg[2]) + '\t' + arg[1] + "\n";
            });
        });
    }

    /**
     * Get option list
     */
    setOptions () {
        this._output += "\n" + this.style("OPTIONS :", "bold") + " \n\n";
        this._output += " " + this.style("--quiet", "green") + ' '.repeat(this._length - 8) + "\tQuiet node\n";
        this._output += " " + this.style("-v, --verbose", "green") + ' '.repeat(this._length - 14) + "\tVerbose node\n";

        this._output += "\n";
    }
    
    /**
     * Get help output
     */
    getHelp () {
        return this._output;
    }
}

module.exports = Help;