#! /usr/bin/env node

var program = require('commander');
var modulePath = require('app-module-path')

function jsonArgs(val) {
  return JSON.parse(val);
}

function resolve(val) {
  try {
    console.log(JSON.stringify(val));
  } catch (e) {
    console.log(val);
  }
  process.exit(0);
}

function reject(val) {
  try {
    console.error(JSON.stringify(val));
  } catch (e) {
    console.error(val);
  }
  process.exit(0);
}

program
  .usage('[options]')
  .option('-m, --module [name]', 'module name e.g.: `fs`')
  .option('-f, --function [name]', 'function name')
  .option('-c, --cwd [path]', 'change working directory context')
  .option('-p, --params [arguments]', 'function arguments specified as an array e.g.: `\'["foo", "bar"]\'`', jsonArgs)
  .option('--promise', 'function is async and uses promises')
  .option('--node-callback', 'function is async with a node-style callback')
  .on('--help', function(){
    console.log('  Example:');
    console.log('');
    console.log('    To execute the following node function `fs.readdirSync("/var/tmp")`, you would do:');
    console.log('    $ cmd-fn --module fs --function readdirSync --params \'["/var/tmp"]\'');
    console.log('');
    console.log('    To do an async call like `http.get({"hostname":"www.google.com"}, cb)`:');
    console.log('    $ cmd-fn --module http --function get --params \'[{"hostname":"www.google.com"}]\' --node-callback');
    console.log('');
  })
  .parse(process.argv);

var returnVal = null;

if (program.cwd) {
  console.log(program.cwd);
  process.chdir(program.cwd);
  modulePath.addPath(program.cwd);
  modulePath.addPath(program.cwd + '/node_modules/');
}

if (!program.module) {
  console.error('Module option (`--module`) is required');
  process.exit(0);
}

var module$ = require(program.module);

if (program.nodeCallback) {
  if (!program.params) {
    program.params = [];
  }
  program.params.push(function(err, val) {
    if (err) {
      reject(err);
    } else {
      resolve(val);
    }
  });
}

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

if (program.promise) {
  returnVal.then(function(val) {
    resolve(val);
  }, function(err) {
    reject(err);
  });
} else if(program.nodeCallback) {
  // Wait for callback
} else {
  resolve(returnVal);
}
