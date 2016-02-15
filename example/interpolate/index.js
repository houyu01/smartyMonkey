// run node index.js
var smartyMonkey = require('../../src/smartyMonkey');
var fs = require('fs');
fs.readFile(
    './interpolate.tpl',
    'utf-8',
    function (err, data) {
        var sm = smartyMonkey.create();
        var tpl_fn = sm.compile(data, {varnames: ['c']});
        var out = tpl_fn('cval');
        console.log(out);
    }
);
