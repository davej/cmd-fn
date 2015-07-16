cmd-fn
======

Execute any node module function from the command line.

Installation
------------
```
npm install -g cmd-fn
```

Usage
-----
```
Usage: cmd-fn [options]

Options:

  -h, --help                output usage information
  -m, --module [name]       module name e.g.: `fs`
  -f, --function [name]     function name
  -c, --cwd [path]          working directory context to run function from
  -p, --params [arguments]  function arguments specified as an array e.g.: `'["foo", "bar"]'`
  --promise                 function is async and uses promises
  --node-callback           function is async with a node-style callback

Example:

  To execute the following node function `fs.readdirSync("/var/tmp")`, you would do:
  $ cmd-fn --module fs --function readdirSync --params '["/var/tmp"]'

  To do an async call like `http.get({"hostname":"www.google.com"}, cb)`:
  $ cmd-fn --module http --function get --params '[{"hostname":"www.google.com"}]' --node-callback
```

Author
------

Dave Jeffery ([@DaveJ](https://twitter.com/DaveJ))
