// run node index.js
var smartyMonkey = require('../../src/smartyMonkey');
var fs = require('fs');
fs.readFile(
    './extend.tpl',
    'utf-8',
    function (err, data) {
        var sm = smartyMonkey.create({
            regxs: {
                smComments: /\{\%\*[\s\S]*?\*\%\}/g
            },
            execFns: {
                smComments: function () {
                    return '-----注释替换-----';
                }
            }
        });
        var tpl_fn = sm.compile(data);
        var out = tpl_fn();
        console.log(out);
    }
);
