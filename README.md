# Clifier [![Build Status](https://secure.travis-ci.org/CapMousse/Clifier.png?branch=master)](http://travis-ci.org/CapMousse/Clifier)

Create cli utility for node.js easily, including:
 - Full command/argument parser
 - Consistant arguments : second argument will alway be the second parametter of command callback
 - Auto help generator
 - Table generator

## Getting Started
Install the module with: `npm install clifier`

```javascript
var Clifier = require('clifier');
var cli = new Clifier('name', 'version', 'description');

cli.addCommand('testcommand', 'description', function(arg1, arg2){
        console.log(arg1, arg2);

        cli.displayTable(['header', 1, 2], [['Content', 1, 2]]);
    })
    .addArgument('-a1, --arg1', 'description', 'defaultValue', function(value){
        return "filter value";
    })
    .addArgument('-a2, --arg2', 'desscription');

cli.run();
```

## Examples
Clifier is easy to use and to understand. You can create a tool for your project realy fast.
To see Clifier in action, you can look at the sources of [SetItUp](https://github.com/CapMousse/setitup)

## Doc

### 1.Clifer
- `new Clifier()` : Create a new instance of Clifier

#### Methods
- `addCommand(command | name, description, callback)` : Add a command to your CLI
  - *command* : a command object to add to your CLI
  
  **OR**
  - *name* : the name of the command
  - *description* : a description for your command, display in help
  - *callback*: function called when command launched


  Return `Command`

- `getName()` : return the CLI tool name
- `getVersion()` : return the CLI tool version
- `getDescription()` : return the description of the CLI tool
- `getCommands()` : return an array of `Command`
- `findCommand(name)` : return the asked command
- `run()` : launch the CLI tool


### Command

- `new Command()` : Create a new command

#### Methods

- `addArgument(argument | name, description, defaultValue, filter)`: Add a new argument to command
  - *argument* : a argument object to add to your CLI
  
  **OR**
  - *name* : the name of the argument, can be multiple -> `-v, --v, ----version`
  - *description* : description of the argument, for help
  - *defaultValue* : add a defaut value to your argument
  - *filter* : a callback launched before command to filter value
  
  return `Argument`
  
- `getArguments()` : return an array or `Argument`
- `getName()` : return the command name
- `getDescription()` : return the command description
- `getFunction()` : return the command callback


### Argument

- `new Argument(name, description, defaultValue, filter)` : Create a new argument
  - *name* : name of the argument, can be multiple -> `-v, --v, ----version`
  - *description* : description of the argument, for help
  - *defaultValue* : add a defaut value to your argument
  - *filter* : a callback launched before command to filter value

#### Methods

- `getName()` : return the argument name
- `getDescription()` : return the argument description
- `getDefaultValue()` : return the argument default value
- `getFilter()` : return the argument filter function

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
- 05/03/2013 : 0.0.1
- 23/05/2013 : 0.0.2

## License
Copyright (c) 2013 Jeremy Barbe  
Licensed under the WTFPL license.
