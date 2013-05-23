'use strict';

var Clifier = require('../lib/index.js');

//Create test command;
var cli = new Clifier('test', '0.0.1', 'test command');

//Setut  CLI
cli.addCommand('trycommand', 'description', function(argTest, argVar){
      console.log('data : ' + argTest + ", " + argVar);
    })
    .addArgument('-t, --test', 'test argument')
    .addArgument('-v, --var', 'var argument', null, function(parse){ 
      return parse === "test" ? true : false;
    });

cli.addCommand('testSimpleTable', 'try table display', function(){
    cli.displayTable(
        ['Lorem', 'Ipsum'],
        [
            ['Lorem ipsum dolor', 'sit amet est']
        ]
    );
});

cli.addCommand('testComplexTable', 'try table display', function(){
    cli.displayTable(
        ['Lorem', 'Ipsum', 'dolor', 'sit', 1],
        [
            ['Lorem ipsum dolor', 'sit amet est', 1, 2, 3],
            ['Lorem ipsum dolor', 1, 2, 3, 'sit amet est']
        ]
    );
});

exports.testClifer = function(test) {
  test.expect(3);

  // tests here
  test.equal(cli.getName(), 'test', 'should be test.');
  test.equal(cli.getVersion(), '0.0.1', 'should be 0.0.1');
  test.equal(cli.getDescription(), 'test command', 'should be test command.');

  test.done();
};

exports.testCommand = function(test) {
  test.expect(4);

  var commands = cli.getCommands();
  test.equal(Object.keys(commands).length, 3, 'should be 3.');

  var command = commands[Object.keys(commands)[0]];
  test.equal(command.getName(), 'trycommand', 'should be trycommand.');
  test.equal(command.getDescription(), 'description', 'should be trycommand.');
  test.equal(typeof command.getFunction(), 'function', 'should be function.');

  test.done();
};

exports.testArguments = function(test) {
  test.expect(10);

  var commands = cli.getCommands();
  var command = commands[Object.keys(commands)[0]];
  var args = command.getArguments();

  test.equal(Object.keys(args).length, 2, 'sould be 2.');

  var firstArg = args[Object.keys(args)[0]];
  test.equal(firstArg.getName(), "-t, --test", "Should be test");
  test.equal(firstArg.getDescription(), "test argument", "Should be test argument");
  test.equal(firstArg.getDefaultValue(), void(0), "Should be undefined");
  test.equal(firstArg.getFilter(), void(0), "Should be undefined");

  var secondArg = args[Object.keys(args)[1]];
  test.equal(secondArg.getName(), "-v, --var", "Should be var");
  test.equal(secondArg.getDescription(), "var argument", "Should be var argument");
  test.equal(secondArg.getDefaultValue(), null, "Should be null");
  test.notEqual(secondArg.getFilter(), void(0), "Should be defined");
  test.equal(typeof secondArg.getFilter(), "function", "Should be defined");

  test.done();
};

exports.testRun = function(test) {
  test.expect(4);

  var log = [];
  var oldConsoleLog = console.log;

  console.log = function() {
      log.push([].slice.call(arguments));
  };
  
  cli.run("help");
  test.equal(log[0], '\ntest v0.0.1\ntest command\n\nUsage : test [command] [options]\n\nCommand list : \n    trycommand [options]      description\n        -t, --test\ttest argument\n        -v, --var\tvar argument\n    testSimpleTable                try table display\n    testComplexTable                try table display\n    help                Show help for test\n');

  cli.run("trycommand");
  test.equal(log[1], 'data : undefined, false');

  cli.run("trycommand",  "-v",  "test");
  test.equal(log[2], 'data : undefined, true');

  var random = Math.random().toString(16).substring(2);
  cli.run("trycommand",  "-v",  "test", "-t", random);
  test.equal(log[3], 'data : ' + random + ', true');

  console.log = oldConsoleLog;
  test.done();
};

exports.testTable = function(test) {
  test.expect(2);

  var log = [];
  var oldConsoleLog = console.log;

  console.log = function() {
      log.push([].slice.call(arguments));
  };

  cli.run("testSimpleTable");
  test.equal(log[0], '+-------------------+--------------+\n| Lorem             | Ipsum        |\n+-------------------+--------------+\n| Lorem ipsum dolor | sit amet est |\n+-------------------+--------------+\n');

  cli.run("testComplexTable");
  test.equal(log[1], '+-------------------+--------------+-------+-----+--------------+\n| Lorem             | Ipsum        | dolor | sit | 1            |\n+-------------------+--------------+-------+-----+--------------+\n| Lorem ipsum dolor | sit amet est | 1     | 2   | 3            |\n| Lorem ipsum dolor | 1            | 2     | 3   | sit amet est |\n+-------------------+--------------+-------+-----+--------------+\n');

  console.log = oldConsoleLog;
  test.done();
};
