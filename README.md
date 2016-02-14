# smartyMonkey
用js解析smarty语法的模板，达到服务端smarty与客户端共享同一套模板的目的
analysis smarty's grammar with js, then you can use smarty both on server and client

# 如何使用(how to use)

1. 首先，我们要写一个模板(hello.tpl):<br/>
    hello {%*test*%}{%$it%}

2. 然后，我们调用smatyMonkey对模板进行编译，及使用：<br/>
var smartyMonkey = require('../../src/smartyMonkey');<br/>
var fs = require('fs');<br/>
fs.readFile(<br/>
    './back.tpl',<br/>
    'utf-8',<br/>
    function (err, data) {<br/>
        sm = smartyMonkey.create();<br/>
        var tpl_fn = sm.compile(data);<br/>
        var out = tpl_fn('monkey');<br/>
        console.log(out);<br/>
    }<br/>
);<br/>

3. 输出：<br/>
hello monkey
