# smartyMonkey
用js解析smarty语法的模板，达到服务端smarty与客户端共享同一套模板的目的<br/>
analysis smarty's grammar with js, then you can use smarty both on server and client

# 如何使用(how to use)：
在服务端(node环境下)我们可以直接引用smartyMonkey模块，require('src/smartyMonkey');<br/>
该模块的导出，是一个create方法，可以创建smartyMonkey的实例<br/>
如：<br/>
var smartyMonkey = require('smartyMonkey');<br/>
var sm = smartyMonkey.create();<br/>
var tpl_fn = sm.compile(data);<br/>
var out = tpl_fn('monkey');<br/>
<br/>
在客户端(浏览器环境下)，smartyMonkey会暴露一个smartyMonkey对象到执行js的上下文中，一般是window，这个对象同样有一个create方法：<br/>
&#60;script src=&#34;.&#47;smartyMonkey.js&#34;&#62;&#60;&#47;script&#62;<br/>
&#60;script&#62;<br/>
var smartyMonkey = window.smartyMonkey<br/>
var sm = smartyMonkey.create();<br/>
var tpl_fn = sm.compile(data);<br/>
var out = tpl_fn('monkey');<br/>
&#60;&#47;script&#62;

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
&emsp;&emsp;var sm = smartyMonkey.create();<br/>
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
&emsp;&lt;div&gt;key is: {%$key%}&lt;/div&gt;<br/>
&emsp;&lt;div&gt;val is: {%$value%}&lt;/div&gt;<br/>
{%/foreach%}<br/>

2. 接着我们编译一下含有foreach循环的模板(index.js)：
var smartyMonkey = require('../../src/smartyMonkey');<br/>
var fs = require('fs');<br/>
fs.readFile(<br/>
&emsp;'./loop.tpl',<br/>
&emsp;'utf-8',<br/>
&emsp;function (err, data) {<br/>
&emsp;&emsp;sm = smartyMonkey.create();<br/>
&emsp;&emsp;var tpl_fn = sm.compile(data, {varnames: ['loop1']});<br/>
&emsp;&emsp;var out = tpl_fn(['h', 'e', 'l', 'l', 'o']);<br/>
&emsp;&emsp;console.log(out);<br/>
&emsp;}<br/>
);<br/>

3. 输出：<br/>
&#60;div&#62;key is: 0&#60;&#47;div&#62; &#60;div&#62;val is: h&#60;&#47;div&#62; &#60;div&#62;key is: 1&#60;&#47;div&#62; &#60;div&#62;val is: e&#60;&#47;div&#62; &#60;div&#62;key is: 2&#60;&#47;div&#62; &#60;div&#62;val is: l&#60;&#47;div&#62; &#60;div&#62;key is: 3&#60;&#47;div&#62; &#60;div&#62;val is: l&#60;&#47;div&#62; &#60;div&#62;key is: 4&#60;&#47;div&#62; &#60;div&#62;val is: o&#60;&#47;div&#62;
