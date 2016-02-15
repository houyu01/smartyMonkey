# smartyMonkey
用js解析smarty语法的模板，达到服务端smarty与客户端共享同一套模板的目的<br/>
analysis smarty's grammar with js, then you can use smarty both on server and client

# 如何使用(how to use)
① 输出(print)<br/>
1. 首先，我们要写一个模板(hello.tpl):<br/>
    hello {%\*test\*%}{%$it%}

2. 然后，我们调用smatyMonkey对模板进行编译，及使用：<br/>
var smartyMonkey = require('../../src/smartyMonkey');<br/>
var fs = require('fs');<br/>
fs.readFile(<br/>
&emsp;'./back.tpl',<br/>
&emsp;'utf-8',<br/>
&emsp;function (err, data) {<br/>
&emsp;&emsp;sm = smartyMonkey.create();<br/>
&emsp;&emsp;var tpl_fn = sm.compile(data);<br/>
&emsp;&emsp;var out = tpl_fn('monkey');<br/>
&emsp;&emsp;console.log(out);<br/>
&emsp;}<br/>
);<br/>


3. 输出：<br/>
hello monkey

② 循环(loop)<br/>
1. 首先，我们要写一个模板(loop.tpl):<br/>
{%foreach $loop1 as $key => $value%}<br/>
&emsp;<div>key is: {%$key%}</div><br/>
&emsp;<div>val is: {%$value%}</div><br/>
{%/foreach%}<br/>
