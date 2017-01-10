# Clifier [![Build Status](https://secure.travis-ci.org/CapMousse/Clifier.png?branch=master)](http://travis-ci.org/CapMousse/Clifier)

Create cli utility for node.js easily, including:
 - Full command/argument parser
 - Consistant arguments 
 - Auto help generator
 - Progress and table generators

## Getting Started
Install the module with: `npm install clifier`

```javascript
var Clifier = require('../src/index');
var cli = new Clifier.Cli('name', 'version', 'description');

cli.addCommand('testcommand', 'description', function (arg1, arg2) {
        Clifier.Stdout.Text.success(arg1);
        Clifier.Stdout.Text.warning("What is that?");
        Clifier.Stdout.Text.error(arg2);

        new Clifier.Stdout.Table(['header', 1, 2], [['Content', 1, 2]]);

        var progress = new Clifier.Stdout.Progress("Installing something", 100),
            i        = 0;
        var interval = function () {
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
    })
    .addArgument('-a1, --arg1', 'description', 'defaultValue', function(value){
        return "filtered value: " + value;
    })
    .addArgument('-a2, --arg2', 'desscription');

cli.run();
```

## Doc

All the code is documented, and the example above use all available API.

## Release History
- 05/03/2013 : 0.0.1
- 23/05/2013 : 0.0.2
- 23/05/2013 : 0.0.3
- 26/05/2013 : 0.0.4
- 10/01/2016 : 1.0.0

## License
Copyright (c) 2013 Jeremy Barbe 
Licensed under the WTFPL license.
