'use strict';

var cli = require(__dirname + '/../src/index.js');

cli
  .name('test')
  .version('0.0.1')
  .description('test command');
  
cli.command('trycommand', 'description')
    .argument('-t, --test', 'test argument')
    .argument('-j, --jar', 'var argument', null, function(parse){ 
      return parse === "test" ? true : false;
    })
  .action(function(argTest, argVar){
    cli.write('data : ' + argTest + ", " + argVar);
  });

cli.command('testSimpleTable', 'try table display')
  .action(function () {
    cli.table(
        ['Lorem', 'Ipsum'],
        [
            ['Lorem ipsum dolor', 'sit amet est']
        ]
    );
  });

exports.testInvalidArgument = function (test) {
  test.expect(1);

  test.throws(() => {
    cli.command('test').argument('-v');
  }, Error, "-v is a reserved argument");

  test.done();
}

exports.testLog = function(test) {
  test.expect(2);

  var log = [];
  var random;
  cli.write = function(content) {
    log.push(content);
  };

  random = Math.random().toString(16).substring(2);
  cli.write(random);
  test.equal(log[0], random);

  random = Math.random().toString(16).substring(2);
  test.equal(cli.style(random, 'white'), '\u001b[37m'+random+'\u001b[39m');

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
  test.expect(5);

  test.throws(_ => {
    cli.command("help");
  }, Error, "help is a reserved command");

  var commands = cli.getCommands();
  test.equal(Object.keys(commands).length, 3, 'should be 3.');

  var command = commands[Object.keys(commands)[0]];
  test.equal(command.getName(), 'trycommand', 'should be trycommand.');
  test.equal(command.getDescription(), 'description', 'should be trycommand.');
  test.equal(typeof command.getAction(), 'function', 'should be function.');

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
  test.equal(secondArg.getName(), "-j, --jar", "Should be var");
  test.equal(secondArg.getDescription(), "var argument", "Should be var argument");
  test.equal(secondArg.getDefaultValue(), null, "Should be null");
  test.notEqual(secondArg.getFilter(), void(0), "Should be defined");
  test.equal(typeof secondArg.getFilter(), "function", "Should be defined");

  test.done();
};

exports.testRun = function(test) {
  test.expect(6);

  var oldExit = process.exit;
  var log = [];
  cli.write = function(content) {
    log.push(content);
  };
  process.exit = function(){};

  
  cli.run("help");
  test.equal(log[0], '\ntest v0.0.1\ntest command\n\n\u001b[1mUSAGE : \u001b[22m\n\n test\u001b[33m [command]\u001b[39m\u001b[34m [options]\u001b[39m\n\n\u001b[1mCOMMANDS :\u001b[22m \n\n \u001b[33mtrycommand\u001b[39m \u001b[34m-t\u001b[39m \u001b[34m-j\u001b[39m\tdescription\n \u001b[33mtestSimpleTable\u001b[39m \ttry table display\n \u001b[33mtest\u001b[39m            \tfalse\n \u001b[33mhelp\u001b[39m \u001b[31m<command>\u001b[39m  \tShow help\n\n\u001b[1mOPTIONS :\u001b[22m \n\n \u001b[32m--quiet\u001b[39m        \tQuiet mode\n \u001b[32m-v, --verbose\u001b[39m  \tVerbose mode\n\n');

  cli.run("help", "trycommand");
  test.equal(log[1], '\ntest v0.0.1\ntest command\n\n\u001b[1mCOMMAND USAGE : \u001b[22m\n\n \u001b[33mtrycommand\u001b[39m \u001b[34m-t\u001b[39m \u001b[34m-j\u001b[39m\tdescription\n\n\u001b[1mARGUMENTS : \u001b[22m\n\n\u001b[34m-t, --test\u001b[39m      \ttest argument\n\u001b[34m-j, --jar\u001b[39m       \tvar argument\n\n');

  cli.run("undefined");
  test.equal(log[2], 'The command undefined doesn\'t exists. Try help to get the list of available commands');

  cli.run("trycommand");
  test.equal(log[3], 'data : undefined, null');

  cli.run("trycommand",  "-j",  "test");
  test.equal(log[4], 'data : undefined, true');

  var random = Math.random().toString(16).substring(2);
  cli.run("trycommand",  "-j",  "test", "-t", random);
  test.equal(log[5], 'data : ' + random + ', true');

  process.exit = oldExit;
  test.done();
};

exports.testTable = function(test) {
  test.expect(2);

  var log = [];
  cli.write = function(content) {
    log.push(content);
  };

  cli.run("testSimpleTable");
  test.equal(log[0], '+-------------------+--------------+\n| Lorem             | Ipsum        |\n+-------------------+--------------+\n| Lorem ipsum dolor | sit amet est |\n+-------------------+--------------+\n');

  
  cli.table(
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
    cli.progress();
  } catch(error) {
    test.throws(error, Error, 'Name required'); 
  }

  try {
    cli.progress("test");
  } catch(error) {
    test.throws(error, Error, 'Total required');
  }

  progress = cli.progress("test", 10, true, true);
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
