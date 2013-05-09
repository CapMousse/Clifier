# Clifier [![Build Status](https://secure.travis-ci.org/CapMousse/Clifier.png?branch=master)](http://travis-ci.org/CapMousse/Clifier)

Create cli utility for node.js easily

## Getting Started
Install the module with: `npm install clifier`

```javascript
var Clifier = require('Clifier');
var cli = new Clifier('name', 'version', 'description');

cli.addCommand('testcommand', 'description', function(arg1, arg2){
        console.log(arg1, arg2);
    })
    .addArgument('-a1, --arg1', 'description', 'defaultValue', function(value){
        return "filter value";
    })
    .addArgument('-a2, --arg2', 'desscription');

cli.run();
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
- 05/03/2013 : 0.0.1

## License
Copyright (c) 2013 Jeremy Barbe  
Licensed under the WTFPL license.
