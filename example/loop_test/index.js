// run node index.js
var smartyMonkey = require('../../src/smartyMonkey');
var fs = require('fs');
fs.readFile(
    './loop2.tpl',
    'utf-8',
    function (err, data) {
        var sm = smartyMonkey.create();
        var tpl_fn = sm.compile(data, {varnames: ['loop1']});
        var out = tpl_fn(['h', 'e', 'l', 'l', 'o']);
        console.log(out);
    }
);
