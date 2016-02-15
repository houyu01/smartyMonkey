// run node index.js
var smartyMonkey = require('../../src/smartyMonkey');
var fs = require('fs');
fs.readFile(
    './mparams.tpl',
    'utf-8',
    function (err, data) {
        var sm = smartyMonkey.create();
        var tpl_fn = sm.compile(data, {varnames: ['a', 'b', 'c']});
        var out = tpl_fn('aval', [1,2,3,4], 99);
        console.log(out);
    }
);
