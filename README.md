# Clifier [![Build Status](https://secure.travis-ci.org/CapMousse/Clifier.png?branch=master)](http://travis-ci.org/CapMousse/Clifier)

Create cli utility for node.js easily, including:
 - Full command/argument parser
 - Consistant arguments 
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
    .argument('-a1, --arg1', 'description', 'defaultValue', function(value){
        return "filtered value: " + value;
    })
    .argument('-a2, --arg2', 'desscription');
    .action((arg1, arg2) => {
        cli.success(arg1);
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

## Doc

All the code is documented, and the example above use all available API.

## Release History
- 05/03/2013 : 0.0.1
- 23/05/2013 : 0.0.2
- 23/05/2013 : 0.0.3
- 26/05/2013 : 0.0.4
- 10/01/2016 : 1.0.0
- 11/01/2016 : 1.0.2

## License
Copyright (c) 2013 Jeremy Barbe 
Licensed under the WTFPL license.
