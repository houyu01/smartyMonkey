// run node index.js
var smartyMonkey = require('../../src/smartyMonkey');
var fs = require('fs');
fs.readFile(
    './condition.tpl',
    'utf-8',
    function (err, data) {
        var sm = smartyMonkey.create();
        var tpl_fn = sm.compile(data, {varnames: ['a']});
        var out = tpl_fn('aval');
        console.log('has a:', out);
        var out = tpl_fn();
        console.log('no a:', out);
    }
);
