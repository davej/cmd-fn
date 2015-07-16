#! /usr/bin/env node

var program = require('commander');

function jsonArgs(val) {
  return JSON.parse(val);
}

program
  .usage('[options]')
  .option('-m, --module [name]', 'module name e.g.: `fs`')
  .option('-f, --function [name]', 'function name')
  .option('-c, --cwd [path]', 'working directory context to run function from')
  .option('-p, --params [arguments]', 'function arguments specified as an array e.g.: `\'["foo", "bar"]\'`', jsonArgs)
  .on('--help', function(){
    console.log('  Example:');
    console.log('');
    console.log('    To execute the following node function `fs.readdirSync("/var/tmp")`, you would do:');
    console.log('    $ cmd-fn --module fs --function readdirSync --params \'["/var/tmp"]\'');
    console.log('');
  })
  .parse(process.argv);

var returnVal = null;

if (program.cwd) {
  process.chdir(program.cwd);
}

if (!program.module) {
  console.error("Module option (`--module`) is required");
  process.exit(0);
}

var module$ = require(program.module);

if (!program.function) {
  if (typeof(module$) !== 'function') {
    console.error('`require(' + program.module + ')` is a valid module but not a function');
    process.exit(0);
  }
  returnVal = module$.apply(module$, program.params);
} else {
  var func$ = module$[program.function];
  if (typeof(func$) !== 'function') {
    console.error('`require(' + program.module + ').' + program.function + '` is not a function');
    process.exit(0);
  }
  returnVal = func$.apply(func$, program.params);
}

console.log(JSON.stringify(returnVal));
