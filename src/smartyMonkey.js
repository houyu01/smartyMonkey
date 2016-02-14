/**
 * @file
 * @author houyu <houyu01@baidu.com>
 * @date 2015-05-15
 * @desc compile smarty lex with js
 */

(function (global) {
    var START_END = {
        append: { start: "'+(", end: ")+'", endencode: "||'').toString()+'" },
        split:  { start: "';out+=(", end: ");out+='", endencode: "||'').toString();out+='"}
    };
    var skip = /$^/;
    // 定义临时变量的话，要尽量不重名
    var sid = 0;  
    
    function smartyMonkey(options) {
        options = options || {};
        this.setOpt(options);
    };

    smartyMonkey.prototype = {
        constructor: smartyMonkey,
        setOpt: function (options) {
            options = options || {};
            var lDelimiter = options.lDelimiter || '\{\%';
            var rDelimiter = options.rDelimiter || '\%\}';
            this.filterMap = {
                count: '.length'
            };
            var filters = [];
            for (var i in this.filterMap) {
                filters.push(i);
            }
            var defaultOptions = {
                smConditional: regx(lDelimiter + '(\\/|(else))?\\s*(if|else)([\\s\\S]*?)' + rDelimiter),
                smInterpolate: regx(lDelimiter + '\\$([^\\=]+?)(?:\\|@?([^\\&\\|]+))?(\\=[\\$]?([\\s\\S]+?))?' + rDelimiter),
                smIterate: regx(lDelimiter + '(\\/)?foreach\\s*(?:(?:\\$([\\s\\S]+?)\\s+as\\s+(?:\\$([^\\=\\>]+))?(?:\\=\\>)?\\$([\\s\\S]*?))|(from=[^\\%]*?))?' + rDelimiter),
                smLoop: regx(lDelimiter + '(\\/)?for\\s*(?:\\$([\\s\\S]+)\\=\\s*([\\s\\S]+?)\\s*to\\s*([\\s\\S]+?)\\s*)?' + rDelimiter),
                filters: '\\|\\@?(' + filters.join('|') + ')(?=[^\\{\\%]*?\\%\\})',
                smComments: /\{\%\*[\s\S]*?\*\%\}/g,
                varnames: ['it'],
                strip: true
            };
            this.options = merge(defaultOptions, options);
        },
        compile: function (tmpl, c) {
            var self = this;
            c = merge(self.options, c);
            var cse = c.append ? START_END.append : START_END.split;
            var str = tmpl;
            str = ("var smarty={foreach: {}};var out='" +
                (c.strip
                 ? str.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g,' ').replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g,'')
                 : str)
                .replace(/'|\\/g, '\\$&')
                // 把注释给干掉
                .replace(
                    c.smComments || skip,
                    function () {
                        return ''; 
                    }
                )
                // 赋值语句转换为JS的赋值语句
                .replace(
                    c.smInterpolate || skip,
                    function (m, code, escaper, assign, variable) {
                        // 如果是直接输出
                        if (escaper && self.filterMap[escaper]) {
                            if (typeof self.filterMap[escaper] === 'function') {
                                code = self.filterMap[escaper](code);
                            }
                            else {
                                code = code + self.filterMap[escaper];
                            }
                        }
                        var output = cse.start + unescape(code) + ").toString()+'";
                        // 如果是赋值语句的话
                        if (assign) {
                            output = "';var " + unescape(code + '=' + variable) + ";out+='";
                        }
                        return output;
                    }
                )
                // if...else语句转化为JS的赋值语句
                .replace(
                    c.smConditional || skip,
                    function (m, elseifcase, ifcase, elsecase, code) {
                        code = code.replace(/\$/g, '');
                        return elseifcase
                        ? (
                            ifcase
                            ? (code ? "';}else if(" + unescape(code) + "){out+='" : "';}out+='")
                            : (code ? "';}else{out+='" : "';}out+='")
                        )
                        : (
                            code ? "';if(" + unescape(code) + "){out+='" : "';}else{out+='" 
                        );
                    }
                )
                // foreach循环
                .replace(
                    c.smIterate || skip,
                    function (m, endtag, from, key, value, standerd) {
                        //console.log(arguments);return '';
                        var defaultMatch = ['', null];
                        // 标准smarty foreach语法
                        if (standerd) {
                            from = (/from=\$([^\s]*)/g.exec(standerd) || defaultMatch)[1];
                            value = (/item=([^\s]*)/g.exec(standerd) || defaultMatch)[1];
                            key = (/key=([^\s]*)/g.exec(standerd) || defaultMatch)[1];
                            name = (/name=([^\s]*)/g.exec(standerd) || defaultMatch)[1];
                        }
                        if (endtag) return "';} } out+='";
                        sid += 1; indv = value || "i" + sid;from = unescape(from);
                        return "';var arr" + sid + "=" + from 
                        + ";if(arr" + sid + "){"
                        + (name ? "smarty.foreach." + name + "={index: -1};" : "")
                        + "var " + indv + "," + (key || 'key') + "=-1;"
                        + "for(" + (key||'key') + " in arr" + sid + "){" 
                        + (name ? "smarty.foreach." + name + ".index++;" : "")
                        + value + "=arr" + sid + "[" + (key||'key') + "];out+='";
                    }
                )
                // for循环
                .replace(c.smLoop || skip, function (m, endtag, key, from, to) {
                     var str = endtag
                     ? ("';} out+='")
                     : ("';for(var " + key + "=" + from.replace('$', '') + ";" 
                       + key + "<=" + to.replace('$', '') + ";" + key + "++){out+='");
                     return str;
                 })
            + "';return out;");
            return new Function(c.varnames, str);
        }
    };

    var _globals = (function(){ return this || (0,eval)("this"); }());
    
    function create(options) {
        return new smartyMonkey(options);           
    }

    if (typeof module !== "undefined" && module.exports) {
        module.exports = {
            create: create
        }
    } else if (typeof define === "function" && define.amd) {
        define(function(){return new smartyMonkey();});
    } else {
        _globals.smartyMonkey = {
            create: create
        }
    }

    function unescape(code) {
        return code.replace(/\\('|\\)/g, "$1").replace(/[\r\t\n]/g, ' ');
    }

    function merge(obj1, obj2) {
        for (var i in obj2) {
            obj1[i] = obj2[i];
        }
        return obj1;
    }
    
    function regx(str, set) {
        return new RegExp(str, set || 'g');
    }

})(this);
