'use strict';

var Clifier = require(__dirname + '/../src/index.js');

//Create test command;
var cli = new Clifier.Cli('test', '0.0.1', 'test command');

//Setut  CLI
cli.addCommand('trycommand', 'description', function(argTest, argVar){
      Clifier.Stdout.Text.write('data : ' + argTest + ", " + argVar);
    })
    .addArgument('-t, --test', 'test argument')
    .addArgument('-v, --var', 'var argument', null, function(parse){ 
      return parse === "test" ? true : false;
    });

var testSimpleTableCommand = new Clifier.Command('testSimpleTable', 'try table display', function(){
    Clifier.Stdout.Table(
        ['Lorem', 'Ipsum'],
        [
            ['Lorem ipsum dolor', 'sit amet est']
        ]
    );
});
cli.addCommand(testSimpleTableCommand);

exports.testLog = function(test) {
  test.expect(4);

  var log = [];
  var random;
  Clifier.Stdout.Text.write = function(content) {
    log.push(content);
  };

  random = Math.random().toString(16).substring(2);
  Clifier.Stdout.Text.write(random);
  test.equal(log[0], random);

  random = Math.random().toString(16).substring(2);
  Clifier.Stdout.Text.error(random);
  test.equal(log[1], '\u001b[1m\u001b[31m'+random+'\u001b[39m\u001b[22m');

  random = Math.random().toString(16).substring(2);
  Clifier.Stdout.Text.warning(random);
  test.equal(log[2], '\u001b[1m\u001b[33m'+random+'\u001b[39m\u001b[22m');

  random = Math.random().toString(16).substring(2);
  test.equal(Clifier.Stdout.Text.style(random, 'white'), '\u001b[37m'+random+'\u001b[39m');

  test.done();
};

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
  test.equal(Object.keys(commands).length, 2, 'should be 2.');

  var command = commands[Object.keys(commands)[0]];
  test.equal(command.getName(), 'trycommand', 'should be trycommand.');
  test.equal(command.getDescription(), 'description', 'should be trycommand.');
  test.equal(typeof command.getCallback(), 'function', 'should be function.');

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
  test.equal(firstArg.getCallback(), void(0), "Should be undefined");

  var secondArg = args[Object.keys(args)[1]];
  test.equal(secondArg.getName(), "-v, --var", "Should be var");
  test.equal(secondArg.getDescription(), "var argument", "Should be var argument");
  test.equal(secondArg.getDefaultValue(), null, "Should be null");
  test.notEqual(secondArg.getCallback(), void(0), "Should be defined");
  test.equal(typeof secondArg.getCallback(), "function", "Should be defined");

  test.done();
};

exports.testRun = function(test) {
  test.expect(5);

  var oldExit = process.exit;
  var log = [];
  Clifier.Stdout.Text.write = function(content) {
    log.push(content);
  };
  process.exit = function(){};

  
  cli.run("help");
  test.equal(log[0], '\ntest v0.0.1\ntest command\n\nUsage : test [command] [options]\n\nCommand list : \n    trycommand [options]      description\n        -t, --test\ttest argument\n        -v, --var\tvar argument\n    testSimpleTable                try table display\n    help                Show help for test\n');

  cli.run("undefined");
  test.equal(log[1], 'The command undefined doesn\'t exists. Try help to get the list of available commands');

  cli.run("trycommand");
  test.equal(log[2], 'data : undefined, false');

  cli.run("trycommand",  "-v",  "test");
  test.equal(log[3], 'data : undefined, true');

  var random = Math.random().toString(16).substring(2);
  cli.run("trycommand",  "-v",  "test", "-t", random);
  test.equal(log[4], 'data : ' + random + ', true');

  process.exit = oldExit;
  test.done();
};

exports.testTable = function(test) {
  test.expect(2);

  var log = [];
  Clifier.Stdout.Text.write = function(content) {
    log.push(content);
  };

  cli.run("testSimpleTable");
  test.equal(log[0], '+-------------------+--------------+\n| Lorem             | Ipsum        |\n+-------------------+--------------+\n| Lorem ipsum dolor | sit amet est |\n+-------------------+--------------+\n');

  
  Clifier.Stdout.Table(
      ['Lorem', 'Ipsum', 'dolor', 'sit', 1],
      [
          ['Lorem ipsum dolor', 'sit amet est', 1, 2, 3],
          ['Lorem ipsum dolor', 1, 2, 3, 'sit amet est']
      ]
  );
  test.equal(log[1], '+-------------------+--------------+-------+-----+--------------+\n| Lorem             | Ipsum        | dolor | sit | 1            |\n+-------------------+--------------+-------+-----+--------------+\n| Lorem ipsum dolor | sit amet est | 1     | 2   | 3            |\n| Lorem ipsum dolor | 1            | 2     | 3   | sit amet est |\n+-------------------+--------------+-------+-----+--------------+\n');

  test.done();
};

exports.testProgressBar = function(test) {
  test.expect(4);

  var progress, str, log = [];

  try {
    new Clifier.Stdout.Progress();
  } catch(error) {
    test.throws(error, Error, 'Name required'); 
  }

  try {
    new Clifier.Stdout.Progress("test");
  } catch(error) {
    test.throws(error, Error, 'Total required');
  }

  progress = new Clifier.Stdout.Progress("test", 10, true, true);
  progress.write = function (content) {
    log.push(content);
  };

  progress.tick();
  test.equal(log[0], "test 10% [==                  ] 0.0s");

  progress.tick(8);
  progress.stop();
  test.equal(log[1], "test 90% [==================  ] 0.0s");
  test.done();
};
