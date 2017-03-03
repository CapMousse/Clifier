# Clifier [![Build Status](https://secure.travis-ci.org/CapMousse/Clifier.png?branch=master)](http://travis-ci.org/CapMousse/Clifier)

Create cli utility for node.js easily, including:
 - Full command/argument parser
 - Consistant inputs and arguments 
 - Auto help generator
 - Progress and table generators

## Getting Started
Install the module with: `npm install clifier`

```javascript
var cli = require('clifier');

cli
    .name('testcommand')
    .version('0.0.1')
    .description('Hello command !');

cli
    .command('testcommand', 'description')
    .input('name', '[a-z]+')
    .argument('-a1, --arg1', 'foo', 'defaultValue', function(value){
        return "filtered value: " + value;
    })
    .argument('-a2, --arg2', 'bar')
    .action((name, arg1, arg2) => {
        cli.log(arg1);
        cli.success('Hello '+name);
        cli.warning("What is that?");
        cli.error(arg2);

        cli.table(['header', 1, 2], [['Content', 1, 2]]);

        var progress = cli.progress("Installing something", 100),
            i        = 0,
            interval = function () {
                i++;
                progress.tick(1);

                if (i == 100) {
                    progress.stop();
                    cli.end();
                } else {
                    setTimeout(interval, 10);
                }
            }

        interval();
    });

cli.run();
```

## API

#### `require('clifier')`

return a `Cli` instance.

### Cli API

#### `.version(string) : Cli`

Set the version of your cli utility

#### `.name(string) : Cli`

Set the name of your cli utility

#### `.description(string) : Cli`

Set the description of your cli utility

#### `.write(string)`

Write something on the stdout

#### `.style(content, style)`

Transform content with asked style. Need to be send to `write`.

#### `.success(string)`

Write a success text on the stdout

#### `.warning(string)`

Write a warning text on the stdout

#### `.error(string)`

Write an error text on the stderr

#### `.log(string)`

Write a log text on the stdout if verbose enabled

#### `.command(name, description) : Command`

Create a new command with name and description.

### Command API

#### `.input(name, validator) : Command`

Add an input to the command.
- **name** (string) : name of the input
- **validator** (string) : RegExp to validate the input

#### `.argument(name, description, defaultValue, filter) : Command`

Add an argument to the command.
- **name** (string) : name of the argument *(--arg, -arg)*
- **description** (string) : description of the argument
- **defaultValue** (mixed) : default value of the argument if empty
- **filter** (function) : filter function for the argument

#### `.action(function(...inputs, ...arguments)) : Command`

Action of the command when executed. Function will receive all inputs and arguments in define orders as parameters.

## License

See `LICENSE` file
