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
<br/>
小贴士(Tips)：<br/>
&emsp;在实际使用过程中，如果是在客户端编译的话，那么我们肯定要把模板的源代码传到客户端，但是我们写的模板代码，会在服务端被smarty解析掉，所以，为了把模板源代码传送到客户端，我们可以使用smarty的literal标签，防止自己的smarty模板在服务端被解析掉。<br/>

# 目前支持的smarty语法(current support grammer)：
###① 输出(print)<br/>
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

###② 循环(loop)<br/>
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
&#60;div&#62;key is: 0&#60;&#47;div&#62; &#60;div&#62;val is: h&#60;&#47;div&#62; &#60;div&#62;key is: 1&#60;&#47;div&#62; &#60;div&#62;val is: e&#60;&#47;div&#62; &#60;div&#62;key is: 2&#60;&#47;div&#62; &#60;div&#62;val is: l&#60;&#47;div&#62; &#60;div&#62;key is: 3&#60;&#47;div&#62; &#60;div&#62;val is: l&#60;&#47;div&#62; &#60;div&#62;key is: 4&#60;&#47;div&#62; &#60;div&#62;val is: o&#60;&#47;div&#62;<br/>
<br/>
foreach的另一种写法：<br/>
1. 模板：<br/>
{%foreach from=$loop1 key=key item=value name=loop1%}<br/>
&emsp;&#60;div&#62;key is: {%$key%}&#60;&#47;div&#62;<br/>
&emsp;&#60;div&#62;val is: {%$value%}&#60;&#47;div&#62;<br/>
&emsp;&#60;div&#62;index is: {%$smarty.foreach.loop1.index%}&#60;&#47;div&#62;<br/>
{%/foreach%}<br/>
2. 调用：<br/>
同上<br/><br/>
3. 输出：<br/>
&#60;div&#62;key is: 0&#60;&#47;div&#62; &#60;div&#62;val is: h&#60;&#47;div&#62; &#60;div&#62;index is: 0&#60;&#47;div&#62; &#60;div&#62;key is: 1&#60;&#47;div&#62; &#60;div&#62;val is: e&#60;&#47;div&#62; &#60;div&#62;index is: 1&#60;&#47;div&#62; &#60;div&#62;key is: 2&#60;&#47;div&#62; &#60;div&#62;val is: l&#60;&#47;div&#62; &#60;div&#62;index is: 2&#60;&#47;div&#62; &#60;div&#62;key is: 3&#60;&#47;div&#62; &#60;div&#62;val is: l&#60;&#47;div&#62; &#60;div&#62;index is: 3&#60;&#47;div&#62; &#60;div&#62;key is: 4&#60;&#47;div&#62; &#60;div&#62;val is: o&#60;&#47;div&#62; &#60;div&#62;index is: 4&#60;&#47;div&#62;

###③ 条件语句(condition)<br/>
1. 模板中的代码(code in template)：
{%if $a%}<br/>
    this is a:{%$a%}<br/>
{%else%}<br/>
    there is no a<br/>
{%/if%}<br/>

2. 调用：<br/>
.....<br/>
var tpl_fn = sm.compile(data, {varnames: ['a']});<br/>
var out = tpl_fn('aval');<br/>
console.log('has a:', out);<br/>
var out = tpl_fn();<br/>
console.log('no a:', out);<br/>
.....<br/>

3. 输出：<br/>
has a:  this is a:aval<br/>
no a:  there is no a<br/>

###④ 赋值(interpolate)<br/>
1. 模板(interpolate.tpl)：<br/>
{%$b = 'test'%}<br/>
b is :{%$b%}<br/>
<br/>
{%$a = $b%}<br/>
a is :{%$a%}<br/>
<br/>
{%$a=$c%}<br/>
new a is: {%$a%}<br/>

2. 调用：<br/>
.....<br/>
var tpl_fn = sm.compile(data, {varnames: ['c']});<br/>
var out = tpl_fn('cval');<br/>
console.log(out);<br/>
.....<br/>
3. 输出：<br/>
b is :test
a is :test
new a is: cval

###⑤ 多个参数(multiple parameters)<br/>
smartyMonkey支持传入多个参数，只要compile的时候，指定第二个参数即可：<br/>
1. 模板：<br/>
a is {%$a%}<br/>
b is {%$b%}<br/>
c is {%$c%}<br/>
<br/>
2.调用：<br/> 
.....<br/>
var tpl_fn = sm.compile(data, {varnames: ['a', 'b', 'c']});<br/>
var out = tpl_fn('aval', [1,2,3,4], 99);<br/>
console.log(out);<br/>
.....<br/>
3. 输出：<br/>
a is avalb is 1,2,3,4c is 99<br/>

###⑥ 过滤器(filter)<br/>
可以在模板中增加过滤器与过滤器所对应的函数，或语句。内置解析过滤器的只有一个count，被解析为js的.length
1. 模板：<br/>
a's length is: {%$a|count%}
2.调用：<br/> 
.....<br/>
var tpl_fn = sm.compile(data, {varnames: ['a']});<br/>
var out = tpl_fn('aval');<br/>
console.log(out);<br/>
.....<br/>
3. 输出：<br/>
a's length is: 4

注：我们可以通过扩展filter，来增加模板的功能<br/>
例：<br/>
1. 模板：<br/>
{%$a|encodeURIComponent%}<br/>
2.调用：<br/> 
var sm = smartyMonkey.create({<br/> 
&emsp;filterMap: {<br/> 
&emsp;&emsp;encodeURIComponent: function (code) {<br/> 
&emsp;&emsp;&emsp;return 'encodeURIComponent(a)';<br/> 
&emsp;&emsp;}<br/> 
&emsp;}<br/> 
}); <br/> 
3. 输出：<br/>
http%3A%2F%2Fwww.baidu.com%2Fs%3Fwd%3DsmartyMonkey


# 扩展(extend):
smartyMonkey支持扩展语法与处理器，也可以覆盖默认的语法和处理器。<br/>

我们通过在create的时候添加regxs与execFns，来增加/替换 替换规则与替换函数。可以达到对语法的扩充。


例：<br/>
var smartyMonkey = require('../../src/smartyMonkey');<br/>
var fs = require('fs');<br/>
fs.readFile(<br/>
&emsp;'./extend.tpl',<br/>
&emsp;utf-8',<br/>
&emsp;function (err, data) {<br/>
&emsp;&emsp;var sm = smartyMonkey.create({<br/>
&emsp;&emsp;&emsp;regxs: {<br/>
&emsp;&emsp;&emsp;&emsp;smComments: /\{\%\*[\s\S]*?\*\%\}/g<br/>
&emsp;&emsp;&emsp;},<br/>
&emsp;&emsp;&emsp;execFns: {<br/>
&emsp;&emsp;&emsp;&emsp;smComments: function () {<br/>
&emsp;&emsp;&emsp;&emsp;&emsp;return '-----注释替换-----';<br/>
&emsp;&emsp;&emsp;&emsp;}<br/>
&emsp;&emsp;&emsp;}<br/>
&emsp;&emsp;});<br/>
&emsp;&emsp;var tpl_fn = sm.compile(data, {varnames: ['loop1', 'a']});<br/>
&emsp;&emsp;var out = tpl_fn(['h', 'e', 'l', 'l', 'o'], '19');<br/>
&emsp;&emsp;console.log(out);<br/>
&emsp;}<br/> 
);<br/>

输入(extend.tpl)：
{%*test test*%}

输出：
-----注释替换-----
