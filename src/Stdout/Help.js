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
     * Get help intro
     */
    setCommandIntro (command) {
        const inputs = command.getInputs();
        const args = command.getArguments();

        let txt = "";
        let length = 0;
            
        this._output += this._cli.getName();

        if (this._cli.getVersion()) {
            this._output += ' v' + this._cli.getVersion();
        }

        if (this._cli.getDescription()) {
            this._output += "\n" + this._cli.getDescription();
        }

        this._output += "\n\n" + this.style("COMMAND USAGE : ", "bold")  + "\n\n";

        length += command.getName().length;
        txt += " " + this.style(command.getName(), "yellow");

        inputs.forEach((input) => {
            let name = "<" + input.getName() + ">";
            length += name.length + 1;
            txt += " " + this.style(name, "red")
        });

        args.forEach((arg) => {
            let name = arg.getName().split(',')[0];
            length += name.length + 1;
            txt += " "+ this.style(name, "blue");
        });

        this._length = length;
        this._output += txt + ' '.repeat(this._length-length) + '\t' + command.getDescription() + "\n";

    }

    /**
     * Get command preformated
     */
    getCommands () {
        const commands = this._cli.getCommands();

        let parsedCommands  = [];

        Object.keys(commands).forEach((name) => {
            let command = commands[name];
            let txt     = "";
            let length  = 0;
            let inputs  = command.getInputs();
            let args    = command.getArguments();

            length += command.getName().length;
            txt += " " + this.style(command.getName(), "yellow");

            inputs.forEach((input) => {
                let name = "<" + input.getName() + ">";
                length += name.length + 1;
                txt += " " + this.style(name, "red");
            })

            args.forEach((arg) => {
                let name = arg.getName().split(',')[0];
                length += name.length + 1;
                txt += " "+ this.style(name, "blue");
            });

            if (length > this._length) {
                this._length = length;
            }
            
            parsedCommands.push([txt, command.getDescription(), length]);
        });

        return parsedCommands;
    }

    /**
     * Get command list
     */
    setCommands () {
        const commands = this.getCommands();

        this._output += "\n\n" + this.style("COMMANDS :", "bold") + " \n\n";

        commands.forEach((command) => {
            this._output += command[0] + ' '.repeat(this._length-command[2]) + '\t' + command[1] + "\n";
        });
    }

    setCommand (command) {
        const args = command.getArguments();

        this._output += "\n" + this.style("ARGUMENTS : ", "bold")  + "\n\n";

        args.forEach((arg) => {
            let name = arg.getName();
            this._output += this.style(name, "blue") + ' '.repeat(this._length-name.length) + '\t' + arg.getDescription() + "\n";
        });

        this._output += "\n";
    }

    /**
     * Get option list
     */
    setOptions () {
        this._output += "\n" + this.style("OPTIONS :", "bold") + " \n\n";
        this._output += " " + this.style("--quiet", "green") + ' '.repeat(this._length - 8) + "\tQuiet mode\n";
        this._output += " " + this.style("-v, --verbose", "green") + ' '.repeat(this._length - 14) + "\tVerbose mode\n";

        this._output += "\n";
    }
    
    /**
     * Get help output
     */
    getHelp (command) {
        if (command) {
            return this.getCommandHelp(command);
        }

        this.setIntro();
        this.setCommands();
        this.setOptions();

        return this._output;
    }

    getCommandHelp (command) {
        const commands = this._cli.getCommands();

        if (!commands[command]) {
            this._cli.error("Command " + command + " don't exists");
            return "";
        }

        this.setCommandIntro(commands[command]);
        this.setCommand(commands[command]);

        return this._output;
    }
}

module.exports = Help;