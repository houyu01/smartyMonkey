# smartyMonkey
用js解析smarty语法的模板，达到服务端smarty与客户端共享同一套模板的目的
analysis smarty's grammar with js, then you can use smarty both on server and client

# 如何使用(how to use)

1. 首先，我们要写一个模板(hello.tpl):
    hello {%*test*%}{%$it%}

2. 然后，我们调用smatyMonkey对模板进行编译，及使用：
var smartyMonkey = require('../../src/smartyMonkey');
var fs = require('fs');
fs.readFile(
    './back.tpl',
    'utf-8',
    function (err, data) {
        sm = smartyMonkey.create();
        var tpl_fn = sm.compile(data);
        var out = tpl_fn('monkey');
        console.log(out);
    }   
);

3. 输出：
hello monkey
