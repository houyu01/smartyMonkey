// run node index.js
var smartyMonkey = require('../../src/smartyMonkey');
var fs = require('fs');
fs.readFile(
    './filter2.tpl',
    'utf-8',
    function (err, data) {
        var sm = smartyMonkey.create({
            filterMap: {
               encodeURI: function (code) {
                return 'encodeURIComponent(a)';
               }
            }    
        });
        var tpl_fn = sm.compile(data, {varnames: ['a']});
        var out = tpl_fn('http://www.baidu.com/s?wd=smartyMonkey');
        console.log(out);
    }
);
