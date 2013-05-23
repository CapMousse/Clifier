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
var cli = new Clifier.Cli('name', 'version', 'description');

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

### 1.Cli
- `new Clifier.Cli(name, version, description)` : Create a new instance of Clifier
  - *name* : the name of the cli
  - *version* : the version of the cli
  - *decription*: the description of the cli

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


### 2.Command

- `new Command(name, description, callback)` : Create a new command
  - *name* : the name of the command
  - *description* : a description for your command, display in help
  - *callback*: function called when command launched

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


### 3.Argument

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

## Helpers

Clifier provide you some helpers to rapidely show usefull elements to the user

### table
Display a table

`Clifer.helpers.table(headers, content)`

- *headers* : array of title -> `["title1", "title2"]`
- *content* : 2d array of data to display -> `[[1, 2], ["mixed", 3], ...]`

**Example :**

```javascript
Clifier.helpers.table(
    ['Lorem', 'Ipsum', 'dolor', 'sit', 1],
    [
        ['Lorem ipsum dolor', 'sit amet est', 1, 2, 3],
        ['Lorem ipsum dolor', 1, 2, 3, 'sit amet est']
    ]
);
```

```
+-------------------+--------------+-------+-----+--------------+
| Lorem             | Ipsum        | dolor | sit | 1            |
+-------------------+--------------+-------+-----+--------------+
| Lorem ipsum dolor | sit amet est | 1     | 2   | 3            |
| Lorem ipsum dolor | 1            | 2     | 3   | sit amet est |
+-------------------+--------------+-------+-----+--------------+
```

### progress
Display a progess bar on the cli

`new Clifier.helpers.progress(name, total, displayTimer, returnAsString)` :

- *name* : name of the progress bar
- *total* : maximum of the progres bar
- *displayTimer* : [true|false] display a timer to the end of the progress bar
- *returnAsString* : [true|false] return the progress bar as a string

***Return :*** `Progress` object

To update the progress bar, use the tick function

`yourProgress.tick([updateValue])` :

- `updateValue` : value to add to the progress counter | **default to 1**

***Return :*** `String` if returnAsString is true

**Example :**

```javascript
progress = new Clifier.helpers.progress("test", 10, true);
progress.tick();
```

`test 10% [==                  ] 0.0s`


```javascript
progress.tick(80);
```

`test 90% [==================  ] 0.1s`

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
- 05/03/2013 : 0.0.1
- 23/05/2013 : 0.0.2
- 23/05/2013 : 0.0.3

## License
Copyright (c) 2013 Jeremy Barbe  
Licensed under the WTFPL license.
