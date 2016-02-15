// run node index.js
var smartyMonkey = require('../../src/smartyMonkey');
var fs = require('fs');
fs.readFile(
    './hello.tpl',
    'utf-8',
    function (err, data) {
        sm = smartyMonkey.create();
        var tpl_fn = sm.compile(data);
        var out = tpl_fn('monkey');
        console.log(out);
    }
);
