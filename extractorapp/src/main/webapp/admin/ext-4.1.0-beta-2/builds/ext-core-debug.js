/*
This file is part of Ext JS 4.1

Copyright (c) 2011-2012 Sencha Inc

Contact:  http://www.sencha.com/contact

Pre-release code in the Ext repository is intended for development purposes only and will
not always be stable. 

Use of pre-release code is permitted with your application at your own risk under standard
Ext license terms. Public redistribution is prohibited.

For early licensing, please contact us at licensing@sencha.com

Build date: 2012-02-03 18:45:57 (ef6fab05fa68b39443698b90161b8ba04b2772c8)
*/


var Ext = Ext || {};
Ext._startTime = new Date().getTime();
(function() {
    var global = this,
        objectPrototype = Object.prototype,
        toString = objectPrototype.toString,
        enumerables = true,
        enumerablesTest = { toString: 1 },
        emptyFn = function(){},
        i;

    Ext.global = global;

    for (i in enumerablesTest) {
        enumerables = null;
    }

    if (enumerables) {
        enumerables = ['hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable',
                       'toLocaleString', 'toString', 'constructor'];
    }

    
    Ext.enumerables = enumerables;

    
    Ext.apply = function(object, config, defaults) {
        if (defaults) {
            Ext.apply(object, defaults);
        }

        if (object && config && typeof config === 'object') {
            var i, j, k;

            for (i in config) {
                object[i] = config[i];
            }

            if (enumerables) {
                for (j = enumerables.length; j--;) {
                    k = enumerables[j];
                    if (config.hasOwnProperty(k)) {
                        object[k] = config[k];
                    }
                }
            }
        }

        return object;
    };

    Ext.buildSettings = Ext.apply({
        baseCSSPrefix: 'x-',
        scopeResetCSS: false
    }, Ext.buildSettings || {});

    Ext.apply(Ext, {

        
        name: Ext.sandboxName || 'Ext',

        
        emptyFn: emptyFn,

        
        emptyString: new String(),

        baseCSSPrefix: Ext.buildSettings.baseCSSPrefix,

        
        applyIf: function(object, config) {
            var property;

            if (object) {
                for (property in config) {
                    if (object[property] === undefined) {
                        object[property] = config[property];
                    }
                }
            }

            return object;
        },

        
        iterate: function(object, fn, scope) {
            if (Ext.isEmpty(object)) {
                return;
            }

            if (scope === undefined) {
                scope = object;
            }

            if (Ext.isIterable(object)) {
                Ext.Array.each.call(Ext.Array, object, fn, scope);
            }
            else {
                Ext.Object.each.call(Ext.Object, object, fn, scope);
            }
        }
    });

    Ext.apply(Ext, {

        
        extend: function() {
            
            var objectConstructor = objectPrototype.constructor,
                inlineOverrides = function(o) {
                for (var m in o) {
                    if (!o.hasOwnProperty(m)) {
                        continue;
                    }
                    this[m] = o[m];
                }
            };

            return function(subclass, superclass, overrides) {
                
                if (Ext.isObject(superclass)) {
                    overrides = superclass;
                    superclass = subclass;
                    subclass = overrides.constructor !== objectConstructor ? overrides.constructor : function() {
                        superclass.apply(this, arguments);
                    };
                }


                
                var F = function() {},
                    subclassProto, superclassProto = superclass.prototype;

                F.prototype = superclassProto;
                subclassProto = subclass.prototype = new F();
                subclassProto.constructor = subclass;
                subclass.superclass = superclassProto;

                if (superclassProto.constructor === objectConstructor) {
                    superclassProto.constructor = superclass;
                }

                subclass.override = function(overrides) {
                    Ext.override(subclass, overrides);
                };

                subclassProto.override = inlineOverrides;
                subclassProto.proto = subclassProto;

                subclass.override(overrides);
                subclass.extend = function(o) {
                    return Ext.extend(subclass, o);
                };

                return subclass;
            };
        }(),

        
        override: function(cls, overrides) {
            if (cls.$isClass) {
                return cls.override(overrides);
            }
            else {
                Ext.apply(cls.prototype, overrides);
            }
        }
    });

    
    Ext.apply(Ext, {

        
        valueFrom: function(value, defaultValue, allowBlank){
            return Ext.isEmpty(value, allowBlank) ? defaultValue : value;
        },

        
        typeOf: function(value) {
            if (value === null) {
                return 'null';
            }

            var type = typeof value;

            if (type === 'undefined' || type === 'string' || type === 'number' || type === 'boolean') {
                return type;
            }

            var typeToString = toString.call(value);

            switch(typeToString) {
                case '[object Array]':
                    return 'array';
                case '[object Date]':
                    return 'date';
                case '[object Boolean]':
                    return 'boolean';
                case '[object Number]':
                    return 'number';
                case '[object RegExp]':
                    return 'regexp';
            }

            if (type === 'function') {
                return 'function';
            }

            if (type === 'object') {
                if (value.nodeType !== undefined) {
                    if (value.nodeType === 3) {
                        return (/\S/).test(value.nodeValue) ? 'textnode' : 'whitespace';
                    }
                    else {
                        return 'element';
                    }
                }

                return 'object';
            }

        },

        
        isEmpty: function(value, allowEmptyString) {
            return (value === null) || (value === undefined) || (!allowEmptyString ? value === '' : false) || (Ext.isArray(value) && value.length === 0);
        },

        
        isArray: ('isArray' in Array) ? Array.isArray : function(value) {
            return toString.call(value) === '[object Array]';
        },

        
        isDate: function(value) {
            return toString.call(value) === '[object Date]';
        },

        
        isObject: (toString.call(null) === '[object Object]') ?
        function(value) {
            
            return value !== null && value !== undefined && toString.call(value) === '[object Object]' && value.ownerDocument === undefined;
        } :
        function(value) {
            return toString.call(value) === '[object Object]';
        },

        
        isSimpleObject: function(value) {
            return value instanceof Object && value.constructor === Object;
        },
        
        isPrimitive: function(value) {
            var type = typeof value;

            return type === 'string' || type === 'number' || type === 'boolean';
        },

        
        isFunction:
        
        
        (typeof document !== 'undefined' && typeof document.getElementsByTagName('body') === 'function') ? function(value) {
            return toString.call(value) === '[object Function]';
        } : function(value) {
            return typeof value === 'function';
        },

        
        isNumber: function(value) {
            return typeof value === 'number' && isFinite(value);
        },

        
        isNumeric: function(value) {
            return !isNaN(parseFloat(value)) && isFinite(value);
        },

        
        isString: function(value) {
            return typeof value === 'string';
        },

        
        isBoolean: function(value) {
            return typeof value === 'boolean';
        },

        
        isElement: function(value) {
            return value ? value.nodeType === 1 : false;
        },

        
        isTextNode: function(value) {
            return value ? value.nodeName === "#text" : false;
        },

        
        isDefined: function(value) {
            return typeof value !== 'undefined';
        },

        
        isIterable: function(value) {
            var type = typeof value,
                checkLength = false;
            if (value && type != 'string') {
                
                if (type == 'function') {
                    
                    
                    if (Ext.isSafari) {
                        checkLength = value instanceof NodeList || value instanceof HTMLCollection;
                    }
                } else {
                    checkLength = true;
                }
            }
            return checkLength ? value.length !== undefined : false;
        }
    });

    Ext.apply(Ext, {

        
        clone: function(item) {
            if (item === null || item === undefined) {
                return item;
            }

            
            
            
            if (item.nodeType && item.cloneNode) {
                return item.cloneNode(true);
            }

            var type = toString.call(item);

            
            if (type === '[object Date]') {
                return new Date(item.getTime());
            }

            var i, j, k, clone, key;

            
            if (type === '[object Array]') {
                i = item.length;

                clone = [];

                while (i--) {
                    clone[i] = Ext.clone(item[i]);
                }
            }
            
            else if (type === '[object Object]' && item.constructor === Object) {
                clone = {};

                for (key in item) {
                    clone[key] = Ext.clone(item[key]);
                }

                if (enumerables) {
                    for (j = enumerables.length; j--;) {
                        k = enumerables[j];
                        clone[k] = item[k];
                    }
                }
            }

            return clone || item;
        },

        
        getUniqueGlobalNamespace: function() {
            var uniqueGlobalNamespace = this.uniqueGlobalNamespace;

            if (uniqueGlobalNamespace === undefined) {
                var i = 0;

                do {
                    uniqueGlobalNamespace = 'ExtBox' + (++i);
                } while (Ext.global[uniqueGlobalNamespace] !== undefined);

                Ext.global[uniqueGlobalNamespace] = Ext;
                this.uniqueGlobalNamespace = uniqueGlobalNamespace;
            }

            return uniqueGlobalNamespace;
        },
        
        
        functionFactoryCache: {},
        
        cacheableFunctionFactory: function() {
            var me = this,
                args = Array.prototype.slice.call(arguments),
                cache = me.functionFactoryCache,
                idx, fn, ln;
                
             if (Ext.isSandboxed) {
                ln = args.length;
                if (ln > 0) {
                    ln--;
                    args[ln] = 'var Ext=window.' + Ext.name + ';' + args[ln];
                }
            }
            idx = args.join('');
            fn = cache[idx];
            if (!fn) {
                fn = Function.prototype.constructor.apply(Function.prototype, args);
                
                cache[idx] = fn;
            }
            return fn;
        },
        
        functionFactory: function() {
            var me = this,
                args = Array.prototype.slice.call(arguments),
                ln;
                
            if (Ext.isSandboxed) {
                ln = args.length;
                if (ln > 0) {
                    ln--;
                    args[ln] = 'var Ext=window.' + Ext.name + ';' + args[ln];
                }
            }
     
            return Function.prototype.constructor.apply(Function.prototype, args);
        },

        
        globalEval: ('execScript' in global) ? function(code) {
            global.execScript(code)
        } : function(code) {
            (function(){
                eval(code);
            })();
        },

        
        Logger: {
            verbose: emptyFn,
            log: emptyFn,
            info: emptyFn,
            warn: emptyFn,
            error: function(message) {
                throw new Error(message);
            },
            deprecate: emptyFn
        }
    });

    
    Ext.type = Ext.typeOf;

})();


(function() {


var version = '4.1.0beta', Version;
    Ext.Version = Version = Ext.extend(Object, {

        
        constructor: function(version) {
            var parts, releaseStartIndex;

            if (version instanceof Version) {
                return version;
            }

            this.version = this.shortVersion = String(version).toLowerCase().replace(/_/g, '.').replace(/[\-+]/g, '');

            releaseStartIndex = this.version.search(/([^\d\.])/);

            if (releaseStartIndex !== -1) {
                this.release = this.version.substr(releaseStartIndex, version.length);
                this.shortVersion = this.version.substr(0, releaseStartIndex);
            }

            this.shortVersion = this.shortVersion.replace(/[^\d]/g, '');

            parts = this.version.split('.');

            this.major = parseInt(parts.shift() || 0, 10);
            this.minor = parseInt(parts.shift() || 0, 10);
            this.patch = parseInt(parts.shift() || 0, 10);
            this.build = parseInt(parts.shift() || 0, 10);

            return this;
        },

        
        toString: function() {
            return this.version;
        },

        
        valueOf: function() {
            return this.version;
        },

        
        getMajor: function() {
            return this.major || 0;
        },

        
        getMinor: function() {
            return this.minor || 0;
        },

        
        getPatch: function() {
            return this.patch || 0;
        },

        
        getBuild: function() {
            return this.build || 0;
        },

        
        getRelease: function() {
            return this.release || '';
        },

        
        isGreaterThan: function(target) {
            return Version.compare(this.version, target) === 1;
        },

        
        isGreaterThanOrEqual: function(target) {
            return Version.compare(this.version, target) >= 0;
        },

        
        isLessThan: function(target) {
            return Version.compare(this.version, target) === -1;
        },

        
        isLessThanOrEqual: function(target) {
            return Version.compare(this.version, target) <= 0;
        },

        
        equals: function(target) {
            return Version.compare(this.version, target) === 0;
        },

        
        match: function(target) {
            target = String(target);
            return this.version.substr(0, target.length) === target;
        },

        
        toArray: function() {
            return [this.getMajor(), this.getMinor(), this.getPatch(), this.getBuild(), this.getRelease()];
        },

        
        getShortVersion: function() {
            return this.shortVersion;
        },

        
        gt: function() {
            return this.isGreaterThan.apply(this, arguments);
        },

        
        lt: function() {
            return this.isLessThan.apply(this, arguments);
        },

        
        gtEq: function() {
            return this.isGreaterThanOrEqual.apply(this, arguments);
        },

        
        ltEq: function() {
            return this.isLessThanOrEqual.apply(this, arguments);
        }
    });

    Ext.apply(Version, {
        
        releaseValueMap: {
            'dev': -6,
            'alpha': -5,
            'a': -5,
            'beta': -4,
            'b': -4,
            'rc': -3,
            '#': -2,
            'p': -1,
            'pl': -1
        },

        
        getComponentValue: function(value) {
            return !value ? 0 : (isNaN(value) ? this.releaseValueMap[value] || value : parseInt(value, 10));
        },

        
        compare: function(current, target) {
            var currentValue, targetValue, i;

            current = new Version(current).toArray();
            target = new Version(target).toArray();

            for (i = 0; i < Math.max(current.length, target.length); i++) {
                currentValue = this.getComponentValue(current[i]);
                targetValue = this.getComponentValue(target[i]);

                if (currentValue < targetValue) {
                    return -1;
                } else if (currentValue > targetValue) {
                    return 1;
                }
            }

            return 0;
        }
    });

    Ext.apply(Ext, {
        
        versions: {},

        
        lastRegisteredVersion: null,

        
        setVersion: function(packageName, version) {
            Ext.versions[packageName] = new Version(version);
            Ext.lastRegisteredVersion = Ext.versions[packageName];

            return this;
        },

        
        getVersion: function(packageName) {
            if (packageName === undefined) {
                return Ext.lastRegisteredVersion;
            }

            return Ext.versions[packageName];
        },

        
        deprecate: function(packageName, since, closure, scope) {
            if (Version.compare(Ext.getVersion(packageName), since) < 1) {
                closure.call(scope);
            }
        }
    }); 

    Ext.setVersion('core', version);

})();



Ext.String = (function() {
    var trimRegex     = /^[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+|[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+$/g,
        escapeRe      = /('|\\)/g,
        formatRe      = /\{(\d+)\}/g,
        escapeRegexRe = /([-.*+?^${}()|[\]\/\\])/g,
        basicTrimRe   = /^\s+|\s+$/g,
        whitespaceRe  = /\s+/,
        varReplace    = /(^[^a-z]*|[^\w])/gi,
        charToEntity  = {
            '&': '&amp;',
            '>': '&gt;',
            '<': '&lt;',
            '"': '&quot;'
        },
        entityToChar  = {
            '&amp;': '&',
            '&gt;': '>',
            '&lt;': '<',
            '&quot;': '"'
        },
        keys = [],
        key,
        charToEntityRegex,
        entityToCharRegex,
        htmlEncodeReplaceFn = function(match, capture) {
            return charToEntity[capture];
        },
        htmlEncode = function(value) {
            return (!value) ? value : String(value).replace(charToEntityRegex, htmlEncodeReplaceFn);
        },
        htmlDecodeReplaceFn = function(match, capture) {
            return (capture in entityToChar) ? entityToChar[capture] : String.fromCharCode(parseInt(capture.substr(2), 10));
        },
        htmlDecode = function(value) {
            return (!value) ? value : String(value).replace(entityToCharRegex, htmlDecodeReplaceFn);
        };

        
        for (key in charToEntity) {
            keys.push(key);
        }
        charToEntityRegex = new RegExp('(' + keys.join('|') + ')', 'g');

        keys = [];
        for (key in entityToChar) {
            keys.push(key);
        }
        entityToCharRegex = new RegExp('(' + keys.join('|') + '|&#[0-9]{1,5};' + ')', 'g');

    return {

        
        createVarName: function(s) {
            return s.replace(varReplace, '');
        },

        
        htmlEncode: htmlEncode,

        
        htmlDecode: htmlDecode,

        
        urlAppend : function(url, string) {
            if (!Ext.isEmpty(string)) {
                return url + (url.indexOf('?') === -1 ? '?' : '&') + string;
            }

            return url;
        },

        
        trim: function(string) {
            return string.replace(trimRegex, "");
        },

        
        capitalize: function(string) {
            return string.charAt(0).toUpperCase() + string.substr(1);
        },

        
        uncapitalize: function(string) {
            return string.charAt(0).toLowerCase() + string.substr(1);
        },

        
        ellipsis: function(value, len, word) {
            if (value && value.length > len) {
                if (word) {
                    var vs = value.substr(0, len - 2),
                    index = Math.max(vs.lastIndexOf(' '), vs.lastIndexOf('.'), vs.lastIndexOf('!'), vs.lastIndexOf('?'));
                    if (index !== -1 && index >= (len - 15)) {
                        return vs.substr(0, index) + "...";
                    }
                }
                return value.substr(0, len - 3) + "...";
            }
            return value;
        },

        
        escapeRegex: function(string) {
            return string.replace(escapeRegexRe, "\\$1");
        },

        
        escape: function(string) {
            return string.replace(escapeRe, "\\$1");
        },

        
        toggle: function(string, value, other) {
            return string === value ? other : value;
        },

        
        leftPad: function(string, size, character) {
            var result = String(string);
            character = character || " ";
            while (result.length < size) {
                result = character + result;
            }
            return result;
        },

        
        format: function(format) {
            var args = Ext.Array.toArray(arguments, 1);
            return format.replace(formatRe, function(m, i) {
                return args[i];
            });
        },

        
        repeat: function(pattern, count, sep) {
            for (var buf = [], i = count; i--; ) {
                buf.push(pattern);
            }
            return buf.join(sep || '');
        },

        
        splitWords: function (words) {
            if (words && typeof words == 'string') {
                return words.replace(basicTrimRe, '').split(whitespaceRe);
            }
            return words || [];
        }
    };
})();


Ext.htmlEncode = Ext.String.htmlEncode;



Ext.htmlDecode = Ext.String.htmlDecode;


Ext.urlAppend = Ext.String.urlAppend;


Ext.Number = new function() {

    var me = this,
        isToFixedBroken = (0.9).toFixed() !== '1',
        math = Math;

    Ext.apply(this, {
        
        constrain: function(number, min, max) {
            number = parseFloat(number);

            if (!isNaN(min)) {
                number = math.max(number, min);
            }
            if (!isNaN(max)) {
                number = math.min(number, max);
            }
            return number;
        },

        
        snap : function(value, increment, minValue, maxValue) {
            var m;

            
            
            if (value === undefined || value < minValue) {
                return minValue || 0;
            }

            if (increment) {
                m = value % increment;
                if (m !== 0) {
                    value -= m;
                    if (m * 2 >= increment) {
                        value += increment;
                    } else if (m * 2 < -increment) {
                        value -= increment;
                    }
                }
            }
            return me.constrain(value, minValue,  maxValue);
        },

        
        snapInRange : function(value, increment, minValue, maxValue) {
            var tween;

            
            minValue = (minValue || 0);

            
            if (value === undefined || value < minValue) {
                return minValue;
            }

            
            if (increment && (tween = ((value - minValue) % increment))) {
                value -= tween;
                tween *= 2;
                if (tween >= increment) {
                    value += increment;
                } else if (tween < -increment) {
                    value -= increment;
                }
            }

            
            if (maxValue !== undefined) {
                if (value > (maxValue = me.snapInRange(maxValue, increment, minValue))) {
                    value = maxValue;
                }
            }

            return value;
        },

        
        toFixed: function(value, precision) {
            if (isToFixedBroken) {
                precision = precision || 0;
                var pow = math.pow(10, precision);
                return (math.round(value * pow) / pow).toFixed(precision);
            }

            return value.toFixed(precision);
        },

        
        from: function(value, defaultValue) {
            if (isFinite(value)) {
                value = parseFloat(value);
            }

            return !isNaN(value) ? value : defaultValue;
        },

        
        randomInt: function (from, to) {
           return math.floor(math.random() * (to - from + 1) + from);
        }
    });

    
    Ext.num = function() {
        return me.from.apply(this, arguments);
    };
};

(function() {

    var arrayPrototype = Array.prototype,
        slice = arrayPrototype.slice,
        supportsSplice = function () {
            var array = [],
                lengthBefore,
                j = 20;

            if (!array.splice) {
                return false;
            }

            
            

            while (j--) {
                array.push("A");
            }

            array.splice(15, 0, "F", "F", "F", "F", "F","F","F","F","F","F","F","F","F","F","F","F","F","F","F","F","F");

            lengthBefore = array.length; 
            array.splice(13, 0, "XXX"); 

            if (lengthBefore+1 != array.length) {
                return false;
            }
            

            return true;
        }(),
        supportsForEach = 'forEach' in arrayPrototype,
        supportsMap = 'map' in arrayPrototype,
        supportsIndexOf = 'indexOf' in arrayPrototype,
        supportsEvery = 'every' in arrayPrototype,
        supportsSome = 'some' in arrayPrototype,
        supportsFilter = 'filter' in arrayPrototype,
        supportsSort = function() {
            var a = [1,2,3,4,5].sort(function(){ return 0; });
            return a[0] === 1 && a[1] === 2 && a[2] === 3 && a[3] === 4 && a[4] === 5;
        }(),
        supportsSliceOnNodeList = true,
        ExtArray;

    try {
        
        if (typeof document !== 'undefined') {
            slice.call(document.getElementsByTagName('body'));
        }
    } catch (e) {
        supportsSliceOnNodeList = false;
    }

    function fixArrayIndex (array, index) {
        return (index < 0) ? Math.max(0, array.length + index)
                           : Math.min(array.length, index);
    }

    
    function replaceSim (array, index, removeCount, insert) {
        var add = insert ? insert.length : 0,
            length = array.length,
            pos = fixArrayIndex(array, index);

        
        if (pos === length) {
            if (add) {
                array.push.apply(array, insert);
            }
        } else {
            var remove = Math.min(removeCount, length - pos),
                tailOldPos = pos + remove,
                tailNewPos = tailOldPos + add - remove,
                tailCount = length - tailOldPos,
                lengthAfterRemove = length - remove,
                i;

            if (tailNewPos < tailOldPos) { 
                for (i = 0; i < tailCount; ++i) {
                    array[tailNewPos+i] = array[tailOldPos+i];
                }
            } else if (tailNewPos > tailOldPos) { 
                for (i = tailCount; i--; ) {
                    array[tailNewPos+i] = array[tailOldPos+i];
                }
            } 

            if (add && pos === lengthAfterRemove) {
                array.length = lengthAfterRemove; 
                array.push.apply(array, insert);
            } else {
                array.length = lengthAfterRemove + add; 
                for (i = 0; i < add; ++i) {
                    array[pos+i] = insert[i];
                }
            }
        }

        return array;
    }

    function replaceNative (array, index, removeCount, insert) {
        if (insert && insert.length) {
            if (index < array.length) {
                array.splice.apply(array, [index, removeCount].concat(insert));
            } else {
                array.push.apply(array, insert);
            }
        } else {
            array.splice(index, removeCount);
        }
        return array;
    }

    function eraseSim (array, index, removeCount) {
        return replaceSim(array, index, removeCount);
    }

    function eraseNative (array, index, removeCount) {
        array.splice(index, removeCount);
        return array;
    }

    function spliceSim (array, index, removeCount) {
        var pos = fixArrayIndex(array, index),
            removed = array.slice(index, fixArrayIndex(array, pos+removeCount));

        if (arguments.length < 4) {
            replaceSim(array, pos, removeCount);
        } else {
            replaceSim(array, pos, removeCount, slice.call(arguments, 3));
        }

        return removed;
    }

    function spliceNative (array) {
        return array.splice.apply(array, slice.call(arguments, 1));
    }

    var erase = supportsSplice ? eraseNative : eraseSim,
        replace = supportsSplice ? replaceNative : replaceSim,
        splice = supportsSplice ? spliceNative : spliceSim;

    

    ExtArray = Ext.Array = {
        
        each: function(array, fn, scope, reverse) {
            array = ExtArray.from(array);

            var i,
                ln = array.length;

            if (reverse !== true) {
                for (i = 0; i < ln; i++) {
                    if (fn.call(scope || array[i], array[i], i, array) === false) {
                        return i;
                    }
                }
            }
            else {
                for (i = ln - 1; i > -1; i--) {
                    if (fn.call(scope || array[i], array[i], i, array) === false) {
                        return i;
                    }
                }
            }

            return true;
        },

        
        forEach: function(array, fn, scope) {
            if (supportsForEach) {
                return array.forEach(fn, scope);
            }

            var i = 0,
                ln = array.length;

            for (; i < ln; i++) {
                fn.call(scope, array[i], i, array);
            }
        },

        
        indexOf: function(array, item, from) {
            if (supportsIndexOf) {
                return array.indexOf(item, from);
            }

            var i, length = array.length;

            for (i = (from < 0) ? Math.max(0, length + from) : from || 0; i < length; i++) {
                if (array[i] === item) {
                    return i;
                }
            }

            return -1;
        },

        
        contains: function(array, item) {
            if (supportsIndexOf) {
                return array.indexOf(item) !== -1;
            }

            var i, ln;

            for (i = 0, ln = array.length; i < ln; i++) {
                if (array[i] === item) {
                    return true;
                }
            }

            return false;
        },

        
        toArray: function(iterable, start, end){
            if (!iterable || !iterable.length) {
                return [];
            }

            if (typeof iterable === 'string') {
                iterable = iterable.split('');
            }

            if (supportsSliceOnNodeList) {
                return slice.call(iterable, start || 0, end || iterable.length);
            }

            var array = [],
                i;

            start = start || 0;
            end = end ? ((end < 0) ? iterable.length + end : end) : iterable.length;

            for (i = start; i < end; i++) {
                array.push(iterable[i]);
            }

            return array;
        },

        
        pluck: function(array, propertyName) {
            var ret = [],
                i, ln, item;

            for (i = 0, ln = array.length; i < ln; i++) {
                item = array[i];

                ret.push(item[propertyName]);
            }

            return ret;
        },

        
        map: function(array, fn, scope) {
            if (supportsMap) {
                return array.map(fn, scope);
            }

            var results = [],
                i = 0,
                len = array.length;

            for (; i < len; i++) {
                results[i] = fn.call(scope, array[i], i, array);
            }

            return results;
        },

        
        every: function(array, fn, scope) {
            if (supportsEvery) {
                return array.every(fn, scope);
            }

            var i = 0,
                ln = array.length;

            for (; i < ln; ++i) {
                if (!fn.call(scope, array[i], i, array)) {
                    return false;
                }
            }

            return true;
        },

        
        some: function(array, fn, scope) {
            if (supportsSome) {
                return array.some(fn, scope);
            }

            var i = 0,
                ln = array.length;

            for (; i < ln; ++i) {
                if (fn.call(scope, array[i], i, array)) {
                    return true;
                }
            }

            return false;
        },

        
        clean: function(array) {
            var results = [],
                i = 0,
                ln = array.length,
                item;

            for (; i < ln; i++) {
                item = array[i];

                if (!Ext.isEmpty(item)) {
                    results.push(item);
                }
            }

            return results;
        },

        
        unique: function(array) {
            var clone = [],
                i = 0,
                ln = array.length,
                item;

            for (; i < ln; i++) {
                item = array[i];

                if (ExtArray.indexOf(clone, item) === -1) {
                    clone.push(item);
                }
            }

            return clone;
        },

        
        filter: function(array, fn, scope) {
            if (supportsFilter) {
                return array.filter(fn, scope);
            }

            var results = [],
                i = 0,
                ln = array.length;

            for (; i < ln; i++) {
                if (fn.call(scope, array[i], i, array)) {
                    results.push(array[i]);
                }
            }

            return results;
        },

        
        from: function(value, newReference) {
            if (value === undefined || value === null) {
                return [];
            }

            if (Ext.isArray(value)) {
                return (newReference) ? slice.call(value) : value;
            }

            if (value && value.length !== undefined && typeof value !== 'string') {
                return ExtArray.toArray(value);
            }

            return [value];
        },

        
        remove: function(array, item) {
            var index = ExtArray.indexOf(array, item);

            if (index !== -1) {
                erase(array, index, 1);
            }

            return array;
        },

        
        include: function(array, item) {
            if (!ExtArray.contains(array, item)) {
                array.push(item);
            }
        },

        
        clone: function(array) {
            return slice.call(array);
        },

        
        merge: function() {
            var args = slice.call(arguments),
                array = [],
                i, ln;

            for (i = 0, ln = args.length; i < ln; i++) {
                array = array.concat(args[i]);
            }

            return ExtArray.unique(array);
        },

        
        intersect: function() {
            var intersect = [],
                arrays = slice.call(arguments),
                i, j, k, minArray, array, x, y, ln, arraysLn, arrayLn;

            if (!arrays.length) {
                return intersect;
            }

            
            for (i = x = 0,ln = arrays.length; i < ln,array = arrays[i]; i++) {
                if (!minArray || array.length < minArray.length) {
                    minArray = array;
                    x = i;
                }
            }

            minArray = ExtArray.unique(minArray);
            erase(arrays, x, 1);

            
            
            
            for (i = 0,ln = minArray.length; i < ln,x = minArray[i]; i++) {
                var count = 0;

                for (j = 0,arraysLn = arrays.length; j < arraysLn,array = arrays[j]; j++) {
                    for (k = 0,arrayLn = array.length; k < arrayLn,y = array[k]; k++) {
                        if (x === y) {
                            count++;
                            break;
                        }
                    }
                }

                if (count === arraysLn) {
                    intersect.push(x);
                }
            }

            return intersect;
        },

        
        difference: function(arrayA, arrayB) {
            var clone = slice.call(arrayA),
                ln = clone.length,
                i, j, lnB;

            for (i = 0,lnB = arrayB.length; i < lnB; i++) {
                for (j = 0; j < ln; j++) {
                    if (clone[j] === arrayB[i]) {
                        erase(clone, j, 1);
                        j--;
                        ln--;
                    }
                }
            }

            return clone;
        },

        
        
        slice: ([1,2].slice(1, undefined).length ?
            function (array, begin, end) {
                return slice.call(array, begin, end);
            } :
            
            function (array, begin, end) {
                
                
                if (typeof begin === 'undefined') {
                    return slice.call(array);
                }
                if (typeof end === 'undefined') {
                    return slice.call(array, begin);
                }
                return slice.call(array, begin, end);
            }
        ),

        
        sort: function(array, sortFn) {
            if (supportsSort) {
                if (sortFn) {
                    return array.sort(sortFn);
                } else {
                    return array.sort();
                }
            }

            var length = array.length,
                i = 0,
                comparison,
                j, min, tmp;

            for (; i < length; i++) {
                min = i;
                for (j = i + 1; j < length; j++) {
                    if (sortFn) {
                        comparison = sortFn(array[j], array[min]);
                        if (comparison < 0) {
                            min = j;
                        }
                    } else if (array[j] < array[min]) {
                        min = j;
                    }
                }
                if (min !== i) {
                    tmp = array[i];
                    array[i] = array[min];
                    array[min] = tmp;
                }
            }

            return array;
        },

        
        flatten: function(array) {
            var worker = [];

            function rFlatten(a) {
                var i, ln, v;

                for (i = 0, ln = a.length; i < ln; i++) {
                    v = a[i];

                    if (Ext.isArray(v)) {
                        rFlatten(v);
                    } else {
                        worker.push(v);
                    }
                }

                return worker;
            }

            return rFlatten(array);
        },

        
        min: function(array, comparisonFn) {
            var min = array[0],
                i, ln, item;

            for (i = 0, ln = array.length; i < ln; i++) {
                item = array[i];

                if (comparisonFn) {
                    if (comparisonFn(min, item) === 1) {
                        min = item;
                    }
                }
                else {
                    if (item < min) {
                        min = item;
                    }
                }
            }

            return min;
        },

        
        max: function(array, comparisonFn) {
            var max = array[0],
                i, ln, item;

            for (i = 0, ln = array.length; i < ln; i++) {
                item = array[i];

                if (comparisonFn) {
                    if (comparisonFn(max, item) === -1) {
                        max = item;
                    }
                }
                else {
                    if (item > max) {
                        max = item;
                    }
                }
            }

            return max;
        },

        
        mean: function(array) {
            return array.length > 0 ? ExtArray.sum(array) / array.length : undefined;
        },

        
        sum: function(array) {
            var sum = 0,
                i, ln, item;

            for (i = 0,ln = array.length; i < ln; i++) {
                item = array[i];

                sum += item;
            }

            return sum;
        },

        
        toMap: function(array, getKey, scope) {
            var map = {},
                i = array.length;

            if (!getKey) {
                while (i--) {
                    map[array[i]] = i+1;
                }
            } else if (typeof getKey == 'string') {
                while (i--) {
                    map[array[i][getKey]] = i+1;
                }
            } else {
                while (i--) {
                    map[getKey.call(scope, array[i])] = i+1;
                }
            }

            return map;
        },


        
        erase: erase,

        
        insert: function (array, index, items) {
            return replace(array, index, 0, items);
        },

        
        replace: replace,

        
        splice: splice,

        
        push: function(array) {
            var len = arguments.length,
                i = 1,
                newItem;

            if (array === undefined) {
                array = [];
            } else if (!Ext.isArray(array)) {
                array = [array];
            }
            for (; i < len; i++) {
                newItem = arguments[i];
                Array.prototype.push[Ext.isArray(newItem) ? 'apply' : 'call'](array, newItem);
            }
            return array;
        }
    };

    
    Ext.each = ExtArray.each;

    
    ExtArray.union = ExtArray.merge;

    
    Ext.min = ExtArray.min;

    
    Ext.max = ExtArray.max;

    
    Ext.sum = ExtArray.sum;

    
    Ext.mean = ExtArray.mean;

    
    Ext.flatten = ExtArray.flatten;

    
    Ext.clean = ExtArray.clean;

    
    Ext.unique = ExtArray.unique;

    
    Ext.pluck = ExtArray.pluck;

    
    Ext.toArray = function() {
        return ExtArray.toArray.apply(ExtArray, arguments);
    };
})();


Ext.Function = {

    
    flexSetter: function(fn) {
        return function(a, b) {
            var k, i;

            if (a === null) {
                return this;
            }

            if (typeof a !== 'string') {
                for (k in a) {
                    if (a.hasOwnProperty(k)) {
                        fn.call(this, k, a[k]);
                    }
                }

                if (Ext.enumerables) {
                    for (i = Ext.enumerables.length; i--;) {
                        k = Ext.enumerables[i];
                        if (a.hasOwnProperty(k)) {
                            fn.call(this, k, a[k]);
                        }
                    }
                }
            } else {
                fn.call(this, a, b);
            }

            return this;
        };
    },

    
    bind: function(fn, scope, args, appendArgs) {
        if (arguments.length === 2) {
            return function() {
                return fn.apply(scope, arguments);
            };
        }

        var method = fn,
            slice = Array.prototype.slice;

        return function() {
            var callArgs = args || arguments;

            if (appendArgs === true) {
                callArgs = slice.call(arguments, 0);
                callArgs = callArgs.concat(args);
            }
            else if (typeof appendArgs == 'number') {
                callArgs = slice.call(arguments, 0); 
                Ext.Array.insert(callArgs, appendArgs, args);
            }

            return method.apply(scope || Ext.global, callArgs);
        };
    },

    
    pass: function(fn, args, scope) {
        if (!Ext.isArray(args)) {
            if (typeof args == 'string') {
                args = [args];
            } else {
                args = Ext.Array.clone(args);
            }
        }

        return function() {
            var fnArgs = [].concat(args);
            fnArgs.push.apply(fnArgs, arguments);
            return fn.apply(scope || this, fnArgs);
        };
    },

    
    alias: function(object, methodName) {
        return function() {
            return object[methodName].apply(object, arguments);
        };
    },

    
    clone: function(method) {
        return function() {
            return method.apply(this, arguments);
        };
    },

    
    createInterceptor: function(origFn, newFn, scope, returnValue) {
        var method = origFn;
        if (!Ext.isFunction(newFn)) {
            return origFn;
        }
        else {
            return function() {
                var me = this,
                    args = arguments;
                newFn.target = me;
                newFn.method = origFn;
                return (newFn.apply(scope || me || Ext.global, args) !== false) ? origFn.apply(me || Ext.global, args) : returnValue || null;
            };
        }
    },

    
    createDelayed: function(fn, delay, scope, args, appendArgs) {
        if (scope || args) {
            fn = Ext.Function.bind(fn, scope, args, appendArgs);
        }

        return function() {
            var me = this,
                args = Array.prototype.slice.call(arguments);

            setTimeout(function() {
                fn.apply(me, args);
            }, delay);
        };
    },

    
    defer: function(fn, millis, scope, args, appendArgs) {
        fn = Ext.Function.bind(fn, scope, args, appendArgs);
        if (millis > 0) {
            return setTimeout(fn, millis);
        }
        fn();
        return 0;
    },

    
    createSequence: function(originalFn, newFn, scope) {
        if (!newFn) {
            return originalFn;
        }
        else {
            return function() {
                var result = originalFn.apply(this, arguments);
                newFn.apply(scope || this, arguments);
                return result;
            };
        }
    },

    
    createBuffered: function(fn, buffer, scope, args) {
        var timerId;

        return function() {
            var callArgs = args || Array.prototype.slice.call(arguments, 0),
                me = scope || this;

            if (timerId) {
                clearTimeout(timerId);
            }

            timerId = setTimeout(function(){
                fn.apply(me, callArgs);
            }, buffer);
        };
    },

    
    createThrottled: function(fn, interval, scope) {
        var lastCallTime, elapsed, lastArgs, timer, execute = function() {
            fn.apply(scope || this, lastArgs);
            lastCallTime = new Date().getTime();
        };

        return function() {
            elapsed = new Date().getTime() - lastCallTime;
            lastArgs = arguments;

            clearTimeout(timer);
            if (!lastCallTime || (elapsed >= interval)) {
                execute();
            } else {
                timer = setTimeout(execute, interval - elapsed);
            }
        };
    },

    
    interceptBefore: function(object, methodName, fn, scope) {
        var method = object[methodName] || Ext.emptyFn;

        return (object[methodName] = function() {
            var ret = fn.apply(scope || this, arguments);
            method.apply(this, arguments);

            return ret;
        });
    },

    
    interceptAfter: function(object, methodName, fn, scope) {
        var method = object[methodName] || Ext.emptyFn;

        return (object[methodName] = function() {
            method.apply(this, arguments);
            return fn.apply(scope || this, arguments);
        });
    }
};


Ext.defer = Ext.Function.alias(Ext.Function, 'defer');


Ext.pass = Ext.Function.alias(Ext.Function, 'pass');


Ext.bind = Ext.Function.alias(Ext.Function, 'bind');



(function() {


var TemplateClass = function(){};

var ExtObject = Ext.Object = {

    
    chain: function (object) {
        TemplateClass.prototype = object;
        var result = new TemplateClass();
        TemplateClass.prototype = null;
        return result;
    },

    
    toQueryObjects: function(name, value, recursive) {
        var self = ExtObject.toQueryObjects,
            objects = [],
            i, ln;

        if (Ext.isArray(value)) {
            for (i = 0, ln = value.length; i < ln; i++) {
                if (recursive) {
                    objects = objects.concat(self(name + '[' + i + ']', value[i], true));
                }
                else {
                    objects.push({
                        name: name,
                        value: value[i]
                    });
                }
            }
        }
        else if (Ext.isObject(value)) {
            for (i in value) {
                if (value.hasOwnProperty(i)) {
                    if (recursive) {
                        objects = objects.concat(self(name + '[' + i + ']', value[i], true));
                    }
                    else {
                        objects.push({
                            name: name,
                            value: value[i]
                        });
                    }
                }
            }
        }
        else {
            objects.push({
                name: name,
                value: value
            });
        }

        return objects;
    },

    
    toQueryString: function(object, recursive) {
        var paramObjects = [],
            params = [],
            i, j, ln, paramObject, value;

        for (i in object) {
            if (object.hasOwnProperty(i)) {
                paramObjects = paramObjects.concat(ExtObject.toQueryObjects(i, object[i], recursive));
            }
        }

        for (j = 0, ln = paramObjects.length; j < ln; j++) {
            paramObject = paramObjects[j];
            value = paramObject.value;

            if (Ext.isEmpty(value)) {
                value = '';
            }
            else if (Ext.isDate(value)) {
                value = Ext.Date.toString(value);
            }

            params.push(encodeURIComponent(paramObject.name) + '=' + encodeURIComponent(String(value)));
        }

        return params.join('&');
    },

    
    fromQueryString: function(queryString, recursive) {
        var parts = queryString.replace(/^\?/, '').split('&'),
            object = {},
            temp, components, name, value, i, ln,
            part, j, subLn, matchedKeys, matchedName,
            keys, key, nextKey;

        for (i = 0, ln = parts.length; i < ln; i++) {
            part = parts[i];

            if (part.length > 0) {
                components = part.split('=');
                name = decodeURIComponent(components[0]);
                value = (components[1] !== undefined) ? decodeURIComponent(components[1]) : '';

                if (!recursive) {
                    if (object.hasOwnProperty(name)) {
                        if (!Ext.isArray(object[name])) {
                            object[name] = [object[name]];
                        }

                        object[name].push(value);
                    }
                    else {
                        object[name] = value;
                    }
                }
                else {
                    matchedKeys = name.match(/(\[):?([^\]]*)\]/g);
                    matchedName = name.match(/^([^\[]+)/);


                    name = matchedName[0];
                    keys = [];

                    if (matchedKeys === null) {
                        object[name] = value;
                        continue;
                    }

                    for (j = 0, subLn = matchedKeys.length; j < subLn; j++) {
                        key = matchedKeys[j];
                        key = (key.length === 2) ? '' : key.substring(1, key.length - 1);
                        keys.push(key);
                    }

                    keys.unshift(name);

                    temp = object;

                    for (j = 0, subLn = keys.length; j < subLn; j++) {
                        key = keys[j];

                        if (j === subLn - 1) {
                            if (Ext.isArray(temp) && key === '') {
                                temp.push(value);
                            }
                            else {
                                temp[key] = value;
                            }
                        }
                        else {
                            if (temp[key] === undefined || typeof temp[key] === 'string') {
                                nextKey = keys[j+1];

                                temp[key] = (Ext.isNumeric(nextKey) || nextKey === '') ? [] : {};
                            }

                            temp = temp[key];
                        }
                    }
                }
            }
        }

        return object;
    },

    
    each: function(object, fn, scope) {
        for (var property in object) {
            if (object.hasOwnProperty(property)) {
                if (fn.call(scope || object, property, object[property], object) === false) {
                    return;
                }
            }
        }
    },

    
    merge: function(source) {
        var i = 1,
            ln = arguments.length,
            mergeFn = ExtObject.merge,
            cloneFn = Ext.clone,
            object, key, value, sourceKey;

        for (; i < ln; i++) {
            object = arguments[i];

            for (key in object) {
                value = object[key];
                if (value && value.constructor === Object) {
                    sourceKey = source[key];
                    if (sourceKey && sourceKey.constructor === Object) {
                        mergeFn(sourceKey, value);
                    }
                    else {
                        source[key] = cloneFn(value);
                    }
                }
                else {
                    source[key] = value;
                }
            }
        }

        return source;
    },

    
    mergeIf: function(source) {
        var i = 1,
            ln = arguments.length,
            cloneFn = Ext.clone,
            object, key, value;

        for (; i < ln; i++) {
            object = arguments[i];

            for (key in object) {
                if (!(key in source)) {
                    value = object[key];

                    if (value && value.constructor === Object) {
                        source[key] = cloneFn(value);
                    }
                    else {
                        source[key] = value;
                    }
                }
            }
        }

        return source;
    },

    
    getKey: function(object, value) {
        for (var property in object) {
            if (object.hasOwnProperty(property) && object[property] === value) {
                return property;
            }
        }

        return null;
    },

    
    getValues: function(object) {
        var values = [],
            property;

        for (property in object) {
            if (object.hasOwnProperty(property)) {
                values.push(object[property]);
            }
        }

        return values;
    },

    
    getKeys: (typeof Object.keys == 'function')
        ? function(object){
            if (!object) {
                return [];
            }
            return Object.keys(object);
        }
        : function(object) {
            var keys = [],
                property;

            for (property in object) {
                if (object.hasOwnProperty(property)) {
                    keys.push(property);
                }
            }

            return keys;
        },

    
    getSize: function(object) {
        var size = 0,
            property;

        for (property in object) {
            if (object.hasOwnProperty(property)) {
                size++;
            }
        }

        return size;
    },

    
    classify: function(object) {
        var prototype = object,
            objectProperties = [],
            propertyClassesMap = {},
            objectClass = function() {
                var i = 0,
                    ln = objectProperties.length,
                    property;

                for (; i < ln; i++) {
                    property = objectProperties[i];
                    this[property] = new propertyClassesMap[property];
                }
            },
            key, value;

        for (key in object) {
            if (object.hasOwnProperty(key)) {
                value = object[key];

                if (value && value.constructor === Object) {
                    objectProperties.push(key);
                    propertyClassesMap[key] = ExtObject.classify(value);
                }
            }
        }

        objectClass.prototype = prototype;

        return objectClass;
    }
};


Ext.merge = Ext.Object.merge;


Ext.mergeIf = Ext.Object.mergeIf;


Ext.urlEncode = function() {
    var args = Ext.Array.from(arguments),
        prefix = '';

    
    if ((typeof args[1] === 'string')) {
        prefix = args[1] + '&';
        args[1] = false;
    }

    return prefix + ExtObject.toQueryString.apply(ExtObject, args);
};


Ext.urlDecode = function() {
    return ExtObject.fromQueryString.apply(ExtObject, arguments);
};

})();






(function() {




function xf(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/\{(\d+)\}/g, function(m, i) {
        return args[i];
    });
}

Ext.Date = {
    
    now: Date.now || function() {
        return +new Date();
    },

    
    toString: function(date) {
        var pad = Ext.String.leftPad;

        return date.getFullYear() + "-"
            + pad(date.getMonth() + 1, 2, '0') + "-"
            + pad(date.getDate(), 2, '0') + "T"
            + pad(date.getHours(), 2, '0') + ":"
            + pad(date.getMinutes(), 2, '0') + ":"
            + pad(date.getSeconds(), 2, '0');
    },

    
    getElapsed: function(dateA, dateB) {
        return Math.abs(dateA - (dateB || new Date()));
    },

    
    useStrict: false,

    
    formatCodeToRegex: function(character, currentGroup) {
        
        var p = utilDate.parseCodes[character];

        if (p) {
          p = typeof p == 'function'? p() : p;
          utilDate.parseCodes[character] = p; 
        }

        return p ? Ext.applyIf({
          c: p.c ? xf(p.c, currentGroup || "{0}") : p.c
        }, p) : {
            g: 0,
            c: null,
            s: Ext.String.escapeRegex(character) 
        };
    },

    
    parseFunctions: {
        "MS": function(input, strict) {
            
            
            var re = new RegExp('\\/Date\\(([-+])?(\\d+)(?:[+-]\\d{4})?\\)\\/');
            var r = (input || '').match(re);
            return r? new Date(((r[1] || '') + r[2]) * 1) : null;
        }
    },
    parseRegexes: [],

    
    formatFunctions: {
        "MS": function() {
            
            return '\\/Date(' + this.getTime() + ')\\/';
        }
    },

    y2kYear : 50,

    
    MILLI : "ms",

    
    SECOND : "s",

    
    MINUTE : "mi",

    
    HOUR : "h",

    
    DAY : "d",

    
    MONTH : "mo",

    
    YEAR : "y",

    
    defaults: {},

    
    
    dayNames : [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ],
    

    
    
    monthNames : [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ],
    

    
    
    monthNumbers : {
        Jan:0,
        Feb:1,
        Mar:2,
        Apr:3,
        May:4,
        Jun:5,
        Jul:6,
        Aug:7,
        Sep:8,
        Oct:9,
        Nov:10,
        Dec:11
    },
    
    
    
    
    defaultFormat : "m/d/Y",
    
    
    
    getShortMonthName : function(month) {
        return Ext.Date.monthNames[month].substring(0, 3);
    },
    

    
    
    getShortDayName : function(day) {
        return Ext.Date.dayNames[day].substring(0, 3);
    },
    

    
    
    getMonthNumber : function(name) {
        
        return Ext.Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()];
    },
    

    
    formatContainsHourInfo : (function(){
        var stripEscapeRe = /(\\.)/g,
            hourInfoRe = /([gGhHisucUOPZ]|MS)/;
        return function(format){
            return hourInfoRe.test(format.replace(stripEscapeRe, ''));
        };
    })(),

    
    formatContainsDateInfo : (function(){
        var stripEscapeRe = /(\\.)/g,
            dateInfoRe = /([djzmnYycU]|MS)/;

        return function(format){
            return dateInfoRe.test(format.replace(stripEscapeRe, ''));
        };
    })(),

    
    formatCodes : {
        d: "Ext.String.leftPad(this.getDate(), 2, '0')",
        D: "Ext.Date.getShortDayName(this.getDay())", 
        j: "this.getDate()",
        l: "Ext.Date.dayNames[this.getDay()]",
        N: "(this.getDay() ? this.getDay() : 7)",
        S: "Ext.Date.getSuffix(this)",
        w: "this.getDay()",
        z: "Ext.Date.getDayOfYear(this)",
        W: "Ext.String.leftPad(Ext.Date.getWeekOfYear(this), 2, '0')",
        F: "Ext.Date.monthNames[this.getMonth()]",
        m: "Ext.String.leftPad(this.getMonth() + 1, 2, '0')",
        M: "Ext.Date.getShortMonthName(this.getMonth())", 
        n: "(this.getMonth() + 1)",
        t: "Ext.Date.getDaysInMonth(this)",
        L: "(Ext.Date.isLeapYear(this) ? 1 : 0)",
        o: "(this.getFullYear() + (Ext.Date.getWeekOfYear(this) == 1 && this.getMonth() > 0 ? +1 : (Ext.Date.getWeekOfYear(this) >= 52 && this.getMonth() < 11 ? -1 : 0)))",
        Y: "Ext.String.leftPad(this.getFullYear(), 4, '0')",
        y: "('' + this.getFullYear()).substring(2, 4)",
        a: "(this.getHours() < 12 ? 'am' : 'pm')",
        A: "(this.getHours() < 12 ? 'AM' : 'PM')",
        g: "((this.getHours() % 12) ? this.getHours() % 12 : 12)",
        G: "this.getHours()",
        h: "Ext.String.leftPad((this.getHours() % 12) ? this.getHours() % 12 : 12, 2, '0')",
        H: "Ext.String.leftPad(this.getHours(), 2, '0')",
        i: "Ext.String.leftPad(this.getMinutes(), 2, '0')",
        s: "Ext.String.leftPad(this.getSeconds(), 2, '0')",
        u: "Ext.String.leftPad(this.getMilliseconds(), 3, '0')",
        O: "Ext.Date.getGMTOffset(this)",
        P: "Ext.Date.getGMTOffset(this, true)",
        T: "Ext.Date.getTimezone(this)",
        Z: "(this.getTimezoneOffset() * -60)",

        c: function() { 
            for (var c = "Y-m-dTH:i:sP", code = [], i = 0, l = c.length; i < l; ++i) {
                var e = c.charAt(i);
                code.push(e == "T" ? "'T'" : utilDate.getFormatCode(e)); 
            }
            return code.join(" + ");
        },
        

        U: "Math.round(this.getTime() / 1000)"
    },

    
    isValid : function(y, m, d, h, i, s, ms) {
        
        h = h || 0;
        i = i || 0;
        s = s || 0;
        ms = ms || 0;

        
        var dt = utilDate.add(new Date(y < 100 ? 100 : y, m - 1, d, h, i, s, ms), utilDate.YEAR, y < 100 ? y - 100 : 0);

        return y == dt.getFullYear() &&
            m == dt.getMonth() + 1 &&
            d == dt.getDate() &&
            h == dt.getHours() &&
            i == dt.getMinutes() &&
            s == dt.getSeconds() &&
            ms == dt.getMilliseconds();
    },

    
    parse : function(input, format, strict) {
        var p = utilDate.parseFunctions;
        if (p[format] == null) {
            utilDate.createParser(format);
        }
        return p[format](input, Ext.isDefined(strict) ? strict : utilDate.useStrict);
    },

    
    parseDate: function(input, format, strict){
        return utilDate.parse(input, format, strict);
    },


    
    getFormatCode : function(character) {
        var f = utilDate.formatCodes[character];

        if (f) {
          f = typeof f == 'function'? f() : f;
          utilDate.formatCodes[character] = f; 
        }

        
        return f || ("'" + Ext.String.escape(character) + "'");
    },

    
    createFormat : function(format) {
        var code = [],
            special = false,
            ch = '';

        for (var i = 0; i < format.length; ++i) {
            ch = format.charAt(i);
            if (!special && ch == "\\") {
                special = true;
            } else if (special) {
                special = false;
                code.push("'" + Ext.String.escape(ch) + "'");
            } else {
                code.push(utilDate.getFormatCode(ch));
            }
        }
        utilDate.formatFunctions[format] = Ext.functionFactory("return " + code.join('+'));
    },

    
    createParser : (function() {
        var code = [
            "var dt, y, m, d, h, i, s, ms, o, z, zz, u, v,",
                "def = Ext.Date.defaults,",
                "results = String(input).match(Ext.Date.parseRegexes[{0}]);", 

            "if(results){",
                "{1}",

                "if(u != null){", 
                    "v = new Date(u * 1000);", 
                "}else{",
                    
                    
                    
                    "dt = Ext.Date.clearTime(new Date);",

                    
                    "y = Ext.Number.from(y, Ext.Number.from(def.y, dt.getFullYear()));",
                    "m = Ext.Number.from(m, Ext.Number.from(def.m - 1, dt.getMonth()));",
                    "d = Ext.Number.from(d, Ext.Number.from(def.d, dt.getDate()));",

                    
                    "h  = Ext.Number.from(h, Ext.Number.from(def.h, dt.getHours()));",
                    "i  = Ext.Number.from(i, Ext.Number.from(def.i, dt.getMinutes()));",
                    "s  = Ext.Number.from(s, Ext.Number.from(def.s, dt.getSeconds()));",
                    "ms = Ext.Number.from(ms, Ext.Number.from(def.ms, dt.getMilliseconds()));",

                    "if(z >= 0 && y >= 0){",
                        
                        

                        
                        
                        "v = Ext.Date.add(new Date(y < 100 ? 100 : y, 0, 1, h, i, s, ms), Ext.Date.YEAR, y < 100 ? y - 100 : 0);",

                        
                        "v = !strict? v : (strict === true && (z <= 364 || (Ext.Date.isLeapYear(v) && z <= 365))? Ext.Date.add(v, Ext.Date.DAY, z) : null);",
                    "}else if(strict === true && !Ext.Date.isValid(y, m + 1, d, h, i, s, ms)){", 
                        "v = null;", 
                    "}else{",
                        
                        
                        "v = Ext.Date.add(new Date(y < 100 ? 100 : y, m, d, h, i, s, ms), Ext.Date.YEAR, y < 100 ? y - 100 : 0);",
                    "}",
                "}",
            "}",

            "if(v){",
                
                "if(zz != null){",
                    
                    "v = Ext.Date.add(v, Ext.Date.SECOND, -v.getTimezoneOffset() * 60 - zz);",
                "}else if(o){",
                    
                    "v = Ext.Date.add(v, Ext.Date.MINUTE, -v.getTimezoneOffset() + (sn == '+'? -1 : 1) * (hr * 60 + mn));",
                "}",
            "}",

            "return v;"
        ].join('\n');

        return function(format) {
            var regexNum = utilDate.parseRegexes.length,
                currentGroup = 1,
                calc = [],
                regex = [],
                special = false,
                ch = "",
                i = 0,
                len = format.length,
                atEnd = [],
                obj;

            for (; i < len; ++i) {
                ch = format.charAt(i);
                if (!special && ch == "\\") {
                    special = true;
                } else if (special) {
                    special = false;
                    regex.push(Ext.String.escape(ch));
                } else {
                    obj = utilDate.formatCodeToRegex(ch, currentGroup);
                    currentGroup += obj.g;
                    regex.push(obj.s);
                    if (obj.g && obj.c) {
                        if (obj.calcAtEnd) {
                            atEnd.push(obj.c);
                        } else {
                            calc.push(obj.c);
                        }
                    }
                }
            }
            
            calc = calc.concat(atEnd);

            utilDate.parseRegexes[regexNum] = new RegExp("^" + regex.join('') + "$", 'i');
            utilDate.parseFunctions[format] = Ext.functionFactory("input", "strict", xf(code, regexNum, calc.join('')));
        };
    })(),

    
    parseCodes : {
        
        d: {
            g:1,
            c:"d = parseInt(results[{0}], 10);\n",
            s:"(3[0-1]|[1-2][0-9]|0[1-9])" 
        },
        j: {
            g:1,
            c:"d = parseInt(results[{0}], 10);\n",
            s:"(3[0-1]|[1-2][0-9]|[1-9])" 
        },
        D: function() {
            for (var a = [], i = 0; i < 7; a.push(utilDate.getShortDayName(i)), ++i); 
            return {
                g:0,
                c:null,
                s:"(?:" + a.join("|") +")"
            };
        },
        l: function() {
            return {
                g:0,
                c:null,
                s:"(?:" + utilDate.dayNames.join("|") + ")"
            };
        },
        N: {
            g:0,
            c:null,
            s:"[1-7]" 
        },
        
        S: {
            g:0,
            c:null,
            s:"(?:st|nd|rd|th)"
        },
        
        w: {
            g:0,
            c:null,
            s:"[0-6]" 
        },
        z: {
            g:1,
            c:"z = parseInt(results[{0}], 10);\n",
            s:"(\\d{1,3})" 
        },
        W: {
            g:0,
            c:null,
            s:"(?:\\d{2})" 
        },
        F: function() {
            return {
                g:1,
                c:"m = parseInt(Ext.Date.getMonthNumber(results[{0}]), 10);\n", 
                s:"(" + utilDate.monthNames.join("|") + ")"
            };
        },
        M: function() {
            for (var a = [], i = 0; i < 12; a.push(utilDate.getShortMonthName(i)), ++i); 
            return Ext.applyIf({
                s:"(" + a.join("|") + ")"
            }, utilDate.formatCodeToRegex("F"));
        },
        m: {
            g:1,
            c:"m = parseInt(results[{0}], 10) - 1;\n",
            s:"(1[0-2]|0[1-9])" 
        },
        n: {
            g:1,
            c:"m = parseInt(results[{0}], 10) - 1;\n",
            s:"(1[0-2]|[1-9])" 
        },
        t: {
            g:0,
            c:null,
            s:"(?:\\d{2})" 
        },
        L: {
            g:0,
            c:null,
            s:"(?:1|0)"
        },
        o: function() {
            return utilDate.formatCodeToRegex("Y");
        },
        Y: {
            g:1,
            c:"y = parseInt(results[{0}], 10);\n",
            s:"(\\d{4})" 
        },
        y: {
            g:1,
            c:"var ty = parseInt(results[{0}], 10);\n"
                + "y = ty > Ext.Date.y2kYear ? 1900 + ty : 2000 + ty;\n", 
            s:"(\\d{1,2})"
        },
        
        a: {
            g:1,
            c:"if (/(am)/i.test(results[{0}])) {\n"
                + "if (!h || h == 12) { h = 0; }\n"
                + "} else { if (!h || h < 12) { h = (h || 0) + 12; }}",
            s:"(am|pm|AM|PM)",
            calcAtEnd: true
        },
        A: {
            g:1,
            c:"if (/(am)/i.test(results[{0}])) {\n"
                + "if (!h || h == 12) { h = 0; }\n"
                + "} else { if (!h || h < 12) { h = (h || 0) + 12; }}",
            s:"(AM|PM|am|pm)",
            calcAtEnd: true
        },
        g: {
            g:1,
            c:"h = parseInt(results[{0}], 10);\n",
            s:"(1[0-2]|[0-9])" 
        },
        G: {
            g:1,
            c:"h = parseInt(results[{0}], 10);\n",
            s:"(2[0-3]|1[0-9]|[0-9])" 
        },
        h: {
            g:1,
            c:"h = parseInt(results[{0}], 10);\n",
            s:"(1[0-2]|0[1-9])" 
        },
        H: {
            g:1,
            c:"h = parseInt(results[{0}], 10);\n",
            s:"(2[0-3]|[0-1][0-9])" 
        },
        i: {
            g:1,
            c:"i = parseInt(results[{0}], 10);\n",
            s:"([0-5][0-9])" 
        },
        s: {
            g:1,
            c:"s = parseInt(results[{0}], 10);\n",
            s:"([0-5][0-9])" 
        },
        u: {
            g:1,
            c:"ms = results[{0}]; ms = parseInt(ms, 10)/Math.pow(10, ms.length - 3);\n",
            s:"(\\d+)" 
        },
        O: {
            g:1,
            c:[
                "o = results[{0}];",
                "var sn = o.substring(0,1),", 
                    "hr = o.substring(1,3)*1 + Math.floor(o.substring(3,5) / 60),", 
                    "mn = o.substring(3,5) % 60;", 
                "o = ((-12 <= (hr*60 + mn)/60) && ((hr*60 + mn)/60 <= 14))? (sn + Ext.String.leftPad(hr, 2, '0') + Ext.String.leftPad(mn, 2, '0')) : null;\n" 
            ].join("\n"),
            s: "([+\-]\\d{4})" 
        },
        P: {
            g:1,
            c:[
                "o = results[{0}];",
                "var sn = o.substring(0,1),", 
                    "hr = o.substring(1,3)*1 + Math.floor(o.substring(4,6) / 60),", 
                    "mn = o.substring(4,6) % 60;", 
                "o = ((-12 <= (hr*60 + mn)/60) && ((hr*60 + mn)/60 <= 14))? (sn + Ext.String.leftPad(hr, 2, '0') + Ext.String.leftPad(mn, 2, '0')) : null;\n" 
            ].join("\n"),
            s: "([+\-]\\d{2}:\\d{2})" 
        },
        T: {
            g:0,
            c:null,
            s:"[A-Z]{1,4}" 
        },
        Z: {
            g:1,
            c:"zz = results[{0}] * 1;\n" 
                  + "zz = (-43200 <= zz && zz <= 50400)? zz : null;\n",
            s:"([+\-]?\\d{1,5})" 
        },
        c: function() {
            var calc = [],
                arr = [
                    utilDate.formatCodeToRegex("Y", 1), 
                    utilDate.formatCodeToRegex("m", 2), 
                    utilDate.formatCodeToRegex("d", 3), 
                    utilDate.formatCodeToRegex("H", 4), 
                    utilDate.formatCodeToRegex("i", 5), 
                    utilDate.formatCodeToRegex("s", 6), 
                    {c:"ms = results[7] || '0'; ms = parseInt(ms, 10)/Math.pow(10, ms.length - 3);\n"}, 
                    {c:[ 
                        "if(results[8]) {", 
                            "if(results[8] == 'Z'){",
                                "zz = 0;", 
                            "}else if (results[8].indexOf(':') > -1){",
                                utilDate.formatCodeToRegex("P", 8).c, 
                            "}else{",
                                utilDate.formatCodeToRegex("O", 8).c, 
                            "}",
                        "}"
                    ].join('\n')}
                ];

            for (var i = 0, l = arr.length; i < l; ++i) {
                calc.push(arr[i].c);
            }

            return {
                g:1,
                c:calc.join(""),
                s:[
                    arr[0].s, 
                    "(?:", "-", arr[1].s, 
                        "(?:", "-", arr[2].s, 
                            "(?:",
                                "(?:T| )?", 
                                arr[3].s, ":", arr[4].s,  
                                "(?::", arr[5].s, ")?", 
                                "(?:(?:\\.|,)(\\d+))?", 
                                "(Z|(?:[-+]\\d{2}(?::)?\\d{2}))?", 
                            ")?",
                        ")?",
                    ")?"
                ].join("")
            };
        },
        U: {
            g:1,
            c:"u = parseInt(results[{0}], 10);\n",
            s:"(-?\\d+)" 
        }
    },

    
    
    dateFormat: function(date, format) {
        return utilDate.format(date, format);
    },
    
    
    isEqual: function(date1, date2) {
        
        if (date1 && date2) {
            return (date1.getTime() === date2.getTime());
        }
        
        return !(date1 || date2);
    },

    
    format: function(date, format) {
        if (utilDate.formatFunctions[format] == null) {
            utilDate.createFormat(format);
        }
        var result = utilDate.formatFunctions[format].call(date);
        return result + '';
    },

    
    getTimezone : function(date) {
        
        
        
        
        
        
        
        
        
        
        
        
        return date.toString().replace(/^.* (?:\((.*)\)|([A-Z]{1,4})(?:[\-+][0-9]{4})?(?: -?\d+)?)$/, "$1$2").replace(/[^A-Z]/g, "");
    },

    
    getGMTOffset : function(date, colon) {
        var offset = date.getTimezoneOffset();
        return (offset > 0 ? "-" : "+")
            + Ext.String.leftPad(Math.floor(Math.abs(offset) / 60), 2, "0")
            + (colon ? ":" : "")
            + Ext.String.leftPad(Math.abs(offset % 60), 2, "0");
    },

    
    getDayOfYear: function(date) {
        var num = 0,
            d = Ext.Date.clone(date),
            m = date.getMonth(),
            i;

        for (i = 0, d.setDate(1), d.setMonth(0); i < m; d.setMonth(++i)) {
            num += utilDate.getDaysInMonth(d);
        }
        return num + date.getDate() - 1;
    },

    
    getWeekOfYear : (function() {
        
        var ms1d = 864e5, 
            ms7d = 7 * ms1d; 

        return function(date) { 
            var DC3 = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate() + 3) / ms1d, 
                AWN = Math.floor(DC3 / 7), 
                Wyr = new Date(AWN * ms7d).getUTCFullYear();

            return AWN - Math.floor(Date.UTC(Wyr, 0, 7) / ms7d) + 1;
        };
    })(),

    
    isLeapYear : function(date) {
        var year = date.getFullYear();
        return !!((year & 3) == 0 && (year % 100 || (year % 400 == 0 && year)));
    },

    
    getFirstDayOfMonth : function(date) {
        var day = (date.getDay() - (date.getDate() - 1)) % 7;
        return (day < 0) ? (day + 7) : day;
    },

    
    getLastDayOfMonth : function(date) {
        return utilDate.getLastDateOfMonth(date).getDay();
    },


    
    getFirstDateOfMonth : function(date) {
        return new Date(date.getFullYear(), date.getMonth(), 1);
    },

    
    getLastDateOfMonth : function(date) {
        return new Date(date.getFullYear(), date.getMonth(), utilDate.getDaysInMonth(date));
    },

    
    getDaysInMonth: (function() {
        var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        return function(date) { 
            var m = date.getMonth();

            return m == 1 && utilDate.isLeapYear(date) ? 29 : daysInMonth[m];
        };
    })(),

    
    
    getSuffix : function(date) {
        switch (date.getDate()) {
            case 1:
            case 21:
            case 31:
                return "st";
            case 2:
            case 22:
                return "nd";
            case 3:
            case 23:
                return "rd";
            default:
                return "th";
        }
    },
    

    
    clone : function(date) {
        return new Date(date.getTime());
    },

    
    isDST : function(date) {
        
        
        return new Date(date.getFullYear(), 0, 1).getTimezoneOffset() != date.getTimezoneOffset();
    },

    
    clearTime : function(date, clone) {
        if (clone) {
            return Ext.Date.clearTime(Ext.Date.clone(date));
        }

        
        var d = date.getDate();

        
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);

        if (date.getDate() != d) { 
            
            

            
            for (var hr = 1, c = utilDate.add(date, Ext.Date.HOUR, hr); c.getDate() != d; hr++, c = utilDate.add(date, Ext.Date.HOUR, hr));

            date.setDate(d);
            date.setHours(c.getHours());
        }

        return date;
    },

    
    add : function(date, interval, value) {
        var d = Ext.Date.clone(date),
            Date = Ext.Date;
        if (!interval || value === 0) return d;

        switch(interval.toLowerCase()) {
            case Ext.Date.MILLI:
                d.setMilliseconds(d.getMilliseconds() + value);
                break;
            case Ext.Date.SECOND:
                d.setSeconds(d.getSeconds() + value);
                break;
            case Ext.Date.MINUTE:
                d.setMinutes(d.getMinutes() + value);
                break;
            case Ext.Date.HOUR:
                d.setHours(d.getHours() + value);
                break;
            case Ext.Date.DAY:
                d.setDate(d.getDate() + value);
                break;
            case Ext.Date.MONTH:
                var day = date.getDate();
                if (day > 28) {
                    day = Math.min(day, Ext.Date.getLastDateOfMonth(Ext.Date.add(Ext.Date.getFirstDateOfMonth(date), 'mo', value)).getDate());
                }
                d.setDate(day);
                d.setMonth(date.getMonth() + value);
                break;
            case Ext.Date.YEAR:
                d.setFullYear(date.getFullYear() + value);
                break;
        }
        return d;
    },

    
    between : function(date, start, end) {
        var t = date.getTime();
        return start.getTime() <= t && t <= end.getTime();
    },

    
    compat: function() {
        var nativeDate = window.Date,
            p, u,
            statics = ['useStrict', 'formatCodeToRegex', 'parseFunctions', 'parseRegexes', 'formatFunctions', 'y2kYear', 'MILLI', 'SECOND', 'MINUTE', 'HOUR', 'DAY', 'MONTH', 'YEAR', 'defaults', 'dayNames', 'monthNames', 'monthNumbers', 'getShortMonthName', 'getShortDayName', 'getMonthNumber', 'formatCodes', 'isValid', 'parseDate', 'getFormatCode', 'createFormat', 'createParser', 'parseCodes'],
            proto = ['dateFormat', 'format', 'getTimezone', 'getGMTOffset', 'getDayOfYear', 'getWeekOfYear', 'isLeapYear', 'getFirstDayOfMonth', 'getLastDayOfMonth', 'getDaysInMonth', 'getSuffix', 'clone', 'isDST', 'clearTime', 'add', 'between'];

        
        Ext.Array.forEach(statics, function(s) {
            nativeDate[s] = utilDate[s];
        });

        
        Ext.Array.forEach(proto, function(s) {
            nativeDate.prototype[s] = function() {
                var args = Array.prototype.slice.call(arguments);
                args.unshift(this);
                return utilDate[s].apply(utilDate, args);
            };
        });
    }
};

var utilDate = Ext.Date;

})();


(function(flexSetter) {

var noArgs = [],
    Base = function(){};

    
    
    function callHookParent () {
        var method = callHookParent.caller.caller; 
        return method.$owner.prototype[method.$name].apply(this, arguments);
    }

    
    Ext.apply(Base, {
        $className: 'Ext.Base',

        $isClass: true,

        
        create: function() {
            return Ext.create.apply(Ext, [this].concat(Array.prototype.slice.call(arguments, 0)));
        },

        
        extend: function(parent) {
            var parentPrototype = parent.prototype,
                basePrototype, prototype, i, ln, name, statics;

            prototype = this.prototype = Ext.Object.chain(parentPrototype);
            prototype.self = this;

            this.superclass = prototype.superclass = parentPrototype;

            if (!parent.$isClass) {
                basePrototype = Ext.Base.prototype;

                for (i in basePrototype) {
                    if (i in prototype) {
                        prototype[i] = basePrototype[i];
                    }
                }
            }

            
            statics = parentPrototype.$inheritableStatics;

            if (statics) {
                for (i = 0,ln = statics.length; i < ln; i++) {
                    name = statics[i];

                    if (!this.hasOwnProperty(name)) {
                        this[name] = parent[name];
                    }
                }
            }

            if (parent.$onExtended) {
                this.$onExtended = parent.$onExtended.slice();
            }

            prototype.config = new prototype.configClass;
            prototype.initConfigList = prototype.initConfigList.slice();
            prototype.initConfigMap = Ext.clone(prototype.initConfigMap);
            prototype.configMap = Ext.Object.chain(prototype.configMap);
        },

        
        '$onExtended': [],

        
        triggerExtended: function() {
            var callbacks = this.$onExtended,
                ln = callbacks.length,
                i, callback;

            if (ln > 0) {
                for (i = 0; i < ln; i++) {
                    callback = callbacks[i];
                    callback.fn.apply(callback.scope || this, arguments);
                }
            }
        },

        
        onExtended: function(fn, scope) {
            this.$onExtended.push({
                fn: fn,
                scope: scope
            });

            return this;
        },

        
        addConfig: function(config, fullMerge) {
            var prototype = this.prototype,
                configNameCache = Ext.Class.configNameCache,
                hasConfig = prototype.configMap,
                initConfigList = prototype.initConfigList,
                initConfigMap = prototype.initConfigMap,
                defaultConfig = prototype.config,
                initializedName, name, value;

            for (name in config) {
                if (config.hasOwnProperty(name)) {
                    if (!hasConfig[name]) {
                        hasConfig[name] = true;
                    }

                    value = config[name];

                    initializedName = configNameCache[name].initialized;

                    if (!initConfigMap[name] && value !== null && !prototype[initializedName]) {
                        initConfigMap[name] = true;
                        initConfigList.push(name);
                    }
                }
            }

            if (fullMerge) {
                Ext.merge(defaultConfig, config);
            }
            else {
                Ext.mergeIf(defaultConfig, config);
            }

            prototype.configClass = Ext.Object.classify(defaultConfig);
        },

        
        addStatics: function(members) {
            var member, name;

            for (name in members) {
                if (members.hasOwnProperty(name)) {
                    member = members[name];
                    this[name] = member;
                }
            }

            return this;
        },

        
        addInheritableStatics: function(members) {
            var inheritableStatics,
                hasInheritableStatics,
                prototype = this.prototype,
                name, member;

            inheritableStatics = prototype.$inheritableStatics;
            hasInheritableStatics = prototype.$hasInheritableStatics;

            if (!inheritableStatics) {
                inheritableStatics = prototype.$inheritableStatics = [];
                hasInheritableStatics = prototype.$hasInheritableStatics = {};
            }


            for (name in members) {
                if (members.hasOwnProperty(name)) {
                    member = members[name];
                    this[name] = member;

                    if (!hasInheritableStatics[name]) {
                        hasInheritableStatics[name] = true;
                        inheritableStatics.push(name);
                    }
                }
            }

            return this;
        },

        
        addMembers: function(members) {
            var prototype = this.prototype,
                enumerables = Ext.enumerables,
                names = [],
                i, ln, name, member;


            for (name in members) {
                names.push(name);
            }

            if (enumerables) {
                names.push.apply(names, enumerables);
            }

            for (i = 0,ln = names.length; i < ln; i++) {
                name = names[i];

                if (members.hasOwnProperty(name)) {
                    member = members[name];

                    if (typeof member == 'function' && !member.$isClass && member !== Ext.emptyFn) {
                        member.$owner = this;
                        member.$name = name;
                    }

                    prototype[name] = member;
                }
            }

            return this;
        },

        
        addMember: function(name, member) {
            if (typeof member == 'function' && !member.$isClass && member !== Ext.emptyFn) {
                member.$owner = this;
                member.$name = name;
            }

            this.prototype[name] = member;

            return this;
        },

        
        implement: function() {
            this.addMembers.apply(this, arguments);
        },

        
        borrow: function(fromClass, members) {
            var prototype = this.prototype,
                fromPrototype = fromClass.prototype,
                i, ln, name, fn, toBorrow;

            members = Ext.Array.from(members);

            for (i = 0,ln = members.length; i < ln; i++) {
                name = members[i];

                toBorrow = fromPrototype[name];

                if (typeof toBorrow == 'function') {
                    fn = function() {
                        return toBorrow.apply(this, arguments);
                    };


                    fn.$owner = this;
                    fn.$name = name;

                    prototype[name] = fn;
                }
                else {
                    prototype[name] = toBorrow;
                }
            }

            return this;
        },

        
        override: function(members) {
            var me = this,
                enumerables = Ext.enumerables,
                target = me.prototype,
                cloneFunction = Ext.Function.clone,
                name, index, member, statics, names, previous;

            if (arguments.length === 2) {
                name = members;
                members = {};
                members[name] = arguments[1];
                enumerables = null;
            }

            do {
                names = []; 
                statics = null; 

                for (name in members) { 
                    if (name == 'statics') {
                        statics = members[name];
                    } else {
                        names.push(name);
                    }
                }

                if (enumerables) {
                    names.push.apply(names, enumerables);
                }

                for (index = names.length; index--; ) {
                    name = names[index];

                    if (members.hasOwnProperty(name)) {
                        member = members[name];

                        if (typeof member == 'function' && !member.$className && member !== Ext.emptyFn) {
                            if (typeof member.$owner != 'undefined') {
                                member = cloneFunction(member);
                            }


                            member.$owner = me;
                            member.$name = name;

                            previous = target[name];
                            if (previous) {
                                member.$previous = previous;
                            }
                        }

                        target[name] = member;
                    }
                }

                target = me; 
                members = statics; 
            } while (members);

            return this;
        },

        
        callParent: function(args) {
            var method;

            
            return (method = this.callParent.caller) && (method.$previous ||
                  ((method = method.$owner ? method : method.caller) &&
                        method.$owner.superclass.$class[method.$name])).apply(this, args || noArgs);
        },

        
        mixin: function(name, mixinClass) {
            var mixin = mixinClass.prototype,
                prototype = this.prototype,
                key;

            if (typeof mixin.onClassMixedIn != 'undefined') {
                mixin.onClassMixedIn.call(mixinClass, this);
            }

            if (!prototype.hasOwnProperty('mixins')) {
                if ('mixins' in prototype) {
                    prototype.mixins = Ext.Object.chain(prototype.mixins);
                }
                else {
                    prototype.mixins = {};
                }
            }

            for (key in mixin) {
                if (key === 'mixins') {
                    Ext.merge(prototype.mixins, mixin[key]);
                }
                else if (typeof prototype[key] == 'undefined' && key != 'mixinId' && key != 'config') {
                    prototype[key] = mixin[key];
                }
            }

            if ('config' in mixin) {
                this.addConfig(mixin.config, false);
            }

            prototype.mixins[name] = mixin;
        },

        
        getName: function() {
            return Ext.getClassName(this);
        },

        
        createAlias: flexSetter(function(alias, origin) {
            this.override(alias, function() {
                return this[origin].apply(this, arguments);
            });
        }),

        
        addXtype: function(xtype) {
            var prototype = this.prototype,
                xtypesMap = prototype.xtypesMap,
                xtypes = prototype.xtypes,
                xtypesChain = prototype.xtypesChain;

            if (!prototype.hasOwnProperty('xtypesMap')) {
                xtypesMap = prototype.xtypesMap = Ext.merge({}, prototype.xtypesMap || {});
                xtypes = prototype.xtypes = prototype.xtypes ? [].concat(prototype.xtypes) : [];
                xtypesChain = prototype.xtypesChain = prototype.xtypesChain ? [].concat(prototype.xtypesChain) : [];
                prototype.xtype = xtype;
            }

            if (!xtypesMap[xtype]) {
                xtypesMap[xtype] = true;
                xtypes.push(xtype);
                xtypesChain.push(xtype);
                Ext.ClassManager.setAlias(this, 'widget.' + xtype);
            }

            return this;
        }
    });

    Base.implement({
        isInstance: true,

        $className: 'Ext.Base',

        configClass: Ext.emptyFn,

        initConfigList: [],

        configMap: {},

        initConfigMap: {},

        
        statics: function() {
            var method = this.statics.caller,
                self = this.self;

            if (!method) {
                return self;
            }

            return method.$owner;
        },

        
        callParent: function(args) {
            
            
            
            
            var method,
                superMethod = (method = this.callParent.caller) && (method.$previous ||
                        ((method = method.$owner ? method : method.caller) &&
                                method.$owner.superclass[method.$name]));


            return superMethod.apply(this, args || noArgs);
        },

        
        self: Base,

        
        constructor: function() {
            return this;
        },

        hookMethod: function (name, hookFn) {
            var me = this,
                owner = me.self;


            hookFn.$owner = owner;
            hookFn.$name = name;

            if (me.hasOwnProperty(name)) {
                hookFn.$previous = me[name]; 
            } else {
                hookFn.$previous = callHookParent; 
            }

            me[name] = hookFn;
        },

        hookMethods: function (hooks) {
            Ext.Object.each(hooks, this.hookMethod, this);
        },

        
        initConfig: function(config) {
            var instanceConfig = config,
                configNameCache = Ext.Class.configNameCache,
                defaultConfig = new this.configClass,
                defaultConfigList = this.initConfigList,
                hasConfig = this.configMap,
                nameMap, i, ln, name, initializedName;

            this.initConfig = Ext.emptyFn;

            this.initialConfig = instanceConfig || {};

            this.config = config = (instanceConfig) ? Ext.merge(defaultConfig, config) : defaultConfig;

            if (instanceConfig) {
                defaultConfigList = defaultConfigList.slice();

                for (name in instanceConfig) {
                    if (hasConfig[name]) {
                        if (instanceConfig[name] !== null) {
                            defaultConfigList.push(name);
                            this[configNameCache[name].initialized] = false;
                        }
                    }
                }
            }

            for (i = 0,ln = defaultConfigList.length; i < ln; i++) {
                name = defaultConfigList[i];
                nameMap = configNameCache[name];
                initializedName = nameMap.initialized;

                if (!this[initializedName]) {
                    this[initializedName] = true;
                    this[nameMap.set].call(this, config[name]);
                }
            }

            return this;
        },

        
        hasConfig: function(name) {
            return Boolean(this.configMap[name]);
        },

        
        setConfig: function(config, applyIfNotSet) {
            if (!config) {
                return this;
            }

            var configNameCache = Ext.Class.configNameCache,
                currentConfig = this.config,
                hasConfig = this.configMap,
                initialConfig = this.initialConfig,
                name, value;

            applyIfNotSet = Boolean(applyIfNotSet);

            for (name in config) {
                if (applyIfNotSet && initialConfig.hasOwnProperty(name)) {
                    continue;
                }

                value = config[name];
                currentConfig[name] = value;

                if (hasConfig[name]) {
                    this[configNameCache[name].set](value);
                }
            }

            return this;
        },

        
        getConfig: function(name) {
            var configNameCache = Ext.Class.configNameCache;

            return this[configNameCache[name].get]();
        },

        
        getInitialConfig: function(name) {
            var config = this.config;

            if (!name) {
                return config;
            }
            else {
                return config[name];
            }
        },

        
        onConfigUpdate: function(names, callback, scope) {
            var self = this.self,
                i, ln, name,
                updaterName, updater, newUpdater;

            names = Ext.Array.from(names);

            scope = scope || this;

            for (i = 0,ln = names.length; i < ln; i++) {
                name = names[i];
                updaterName = 'update' + Ext.String.capitalize(name);
                updater = this[updaterName] || Ext.emptyFn;
                newUpdater = function() {
                    updater.apply(this, arguments);
                    scope[callback].apply(scope, arguments);
                };
                newUpdater.$name = updaterName;
                newUpdater.$owner = self;

                this[updaterName] = newUpdater;
            }
        },

        destroy: function() {
            this.destroy = Ext.emptyFn;
        }
    });

    
    Base.prototype.callOverridden = Base.prototype.callParent;

    Ext.Base = Base;

})(Ext.Function.flexSetter);


(function() {
    var ExtClass,
        Base = Ext.Base,
        baseStaticMembers = [],
        baseStaticMember, baseStaticMemberLength;

    for (baseStaticMember in Base) {
        if (Base.hasOwnProperty(baseStaticMember)) {
            baseStaticMembers.push(baseStaticMember);
        }
    }

    baseStaticMemberLength = baseStaticMembers.length;

    
    function makeCtor (className) {
        function constructor () {
            return this.constructor.apply(this, arguments);
        };
        return constructor;
    }

    
    Ext.Class = ExtClass = function(Class, data, onCreated) {
        if (typeof Class != 'function') {
            onCreated = data;
            data = Class;
            Class = null;
        }

        if (!data) {
            data = {};
        }

        Class = ExtClass.create(Class, data);

        ExtClass.process(Class, data, onCreated);

        return Class;
    };

    Ext.apply(ExtClass, {
        
        onBeforeCreated: function(Class, data, hooks) {
            Class.addMembers(data);

            hooks.onCreated.call(Class, Class);
        },

        
        create: function(Class, data) {
            var name, i;

            if (!Class) {
                
                
                
                
                
                
                
                
                
                
                
                Class = makeCtor(
                );
                
            }

            for (i = 0; i < baseStaticMemberLength; i++) {
                name = baseStaticMembers[i];
                Class[name] = Base[name];
            }

            return Class;
        },

        
        process: function(Class, data, onCreated) {
            var preprocessorStack = data.preprocessors || ExtClass.defaultPreprocessors,
                registeredPreprocessors = this.preprocessors,
                hooks = {
                    onBeforeCreated: this.onBeforeCreated
                },
                index = 0,
                preprocessors = [],
                preprocessor, preprocessorsProperties,
                i, ln, j, subLn, preprocessorProperty, process;

            delete data.preprocessors;

            for (i = 0,ln = preprocessorStack.length; i < ln; i++) {
                preprocessor = preprocessorStack[i];

                if (typeof preprocessor == 'string') {
                    preprocessor = registeredPreprocessors[preprocessor];
                    preprocessorsProperties = preprocessor.properties;

                    if (preprocessorsProperties === true) {
                        preprocessors.push(preprocessor.fn);
                    }
                    else if (preprocessorsProperties) {
                        for (j = 0,subLn = preprocessorsProperties.length; j < subLn; j++) {
                            preprocessorProperty = preprocessorsProperties[j];

                            if (data.hasOwnProperty(preprocessorProperty)) {
                                preprocessors.push(preprocessor.fn);
                                break;
                            }
                        }
                    }
                }
                else {
                    preprocessors.push(preprocessor);
                }
            }

            hooks.onCreated = onCreated ? onCreated : Ext.emptyFn;

            process = function(Class, data, hooks) {
                preprocessor = preprocessors[index++];

                if (!preprocessor) {
                    hooks.onBeforeCreated.apply(this, arguments);
                    return;
                }

                if (preprocessor.call(this, Class, data, hooks, process) !== false) {
                    process.apply(this, arguments);
                }
            };

            process.call(this, Class, data, hooks);
        },

        
        preprocessors: {},

        
        registerPreprocessor: function(name, fn, properties, position, relativeTo) {
            if (!position) {
                position = 'last';
            }

            if (!properties) {
                properties = [name];
            }

            this.preprocessors[name] = {
                name: name,
                properties: properties || false,
                fn: fn
            };

            this.setDefaultPreprocessorPosition(name, position, relativeTo);

            return this;
        },

        
        getPreprocessor: function(name) {
            return this.preprocessors[name];
        },

        
        getPreprocessors: function() {
            return this.preprocessors;
        },

        
        defaultPreprocessors: [],

        
        getDefaultPreprocessors: function() {
            return this.defaultPreprocessors;
        },

        
        setDefaultPreprocessors: function(preprocessors) {
            this.defaultPreprocessors = Ext.Array.from(preprocessors);

            return this;
        },

        
        setDefaultPreprocessorPosition: function(name, offset, relativeName) {
            var defaultPreprocessors = this.defaultPreprocessors,
                index;

            if (typeof offset == 'string') {
                if (offset === 'first') {
                    defaultPreprocessors.unshift(name);

                    return this;
                }
                else if (offset === 'last') {
                    defaultPreprocessors.push(name);

                    return this;
                }

                offset = (offset === 'after') ? 1 : -1;
            }

            index = Ext.Array.indexOf(defaultPreprocessors, relativeName);

            if (index !== -1) {
                Ext.Array.splice(defaultPreprocessors, Math.max(0, index + offset), 0, name);
            }

            return this;
        },

        configNameCache: {},

        getConfigNameMap: function(name) {
            var cache = this.configNameCache,
                map = cache[name],
                capitalizedName;

            if (!map) {
                capitalizedName = name.charAt(0).toUpperCase() + name.substr(1);

                map = cache[name] = {
                    internal: name,
                    initialized: '_is' + capitalizedName + 'Initialized',
                    apply: 'apply' + capitalizedName,
                    update: 'update' + capitalizedName,
                    'set': 'set' + capitalizedName,
                    'get': 'get' + capitalizedName,
                    doSet : 'doSet' + capitalizedName,
                    changeEvent: name.toLowerCase() + 'change'
                }
            }

            return map;
        }
    });

    
    ExtClass.registerPreprocessor('extend', function(Class, data) {
        var Base = Ext.Base,
            basePrototype = Base.prototype,
            extend = data.extend,
            Parent, parentPrototype, i;

        delete data.extend;

        if (extend && extend !== Object) {
            Parent = extend;
        }
        else {
            Parent = Base;
        }

        parentPrototype = Parent.prototype;

        if (!Parent.$isClass) {
            for (i in basePrototype) {
                if (!parentPrototype[i]) {
                    parentPrototype[i] = basePrototype[i];
                }
            }
        }

        Class.extend(Parent);

        Class.triggerExtended.apply(Class, arguments);

        if (data.onClassExtended) {
            Class.onExtended(data.onClassExtended);
            delete data.onClassExtended;
        }

    }, true);

    
    ExtClass.registerPreprocessor('statics', function(Class, data) {
        Class.addStatics(data.statics);

        delete data.statics;
    });

    
    ExtClass.registerPreprocessor('inheritableStatics', function(Class, data) {
        Class.addInheritableStatics(data.inheritableStatics);

        delete data.inheritableStatics;
    });

    
    ExtClass.registerPreprocessor('config', function(Class, data) {
        var config = data.config,
            prototype = Class.prototype;

        delete data.config;

        Ext.Object.each(config, function(name, value) {
            var nameMap = ExtClass.getConfigNameMap(name),
                internalName = nameMap.internal,
                initializedName = nameMap.initialized,
                applyName = nameMap.apply,
                updateName = nameMap.update,
                setName = nameMap.set,
                getName = nameMap.get,
                hasOwnSetter = (setName in prototype) || data.hasOwnProperty(setName),
                hasOwnApplier = (applyName in prototype) || data.hasOwnProperty(applyName),
                hasOwnUpdater = (updateName in prototype) || data.hasOwnProperty(updateName),
                optimizedGetter, customGetter;

            if (value === null || (!hasOwnSetter && !hasOwnApplier && !hasOwnUpdater)) {
                prototype[internalName] = value;
                prototype[initializedName] = true;
            }
            else {
                prototype[initializedName] = false;
            }

            if (!hasOwnSetter) {
                data[setName] = function(value) {
                    var oldValue = this[internalName],
                        applier = this[applyName],
                        updater = this[updateName];

                    if (!this[initializedName]) {
                        this[initializedName] = true;
                    }

                    if (applier) {
                        value = applier.call(this, value, oldValue);
                    }

                    if (typeof value != 'undefined') {
                        this[internalName] = value;

                        if (updater && value !== oldValue) {
                            updater.call(this, value, oldValue);
                        }
                    }

                    return this;
                }
            }

            if (!(getName in prototype) || data.hasOwnProperty(getName)) {
                customGetter = data[getName] || false;

                if (customGetter) {
                    optimizedGetter = function() {
                        return customGetter.apply(this, arguments);
                    };
                }
                else {
                    optimizedGetter = function() {
                        return this[internalName];
                    };
                }

                data[getName] = function() {
                    var currentGetter;

                    if (!this[initializedName]) {
                        this[initializedName] = true;
                        this[setName](this.config[name]);
                    }

                    currentGetter = this[getName];

                    if ('$previous' in currentGetter) {
                        currentGetter.$previous = optimizedGetter;
                    }
                    else {
                        this[getName] = optimizedGetter;
                    }

                    return optimizedGetter.apply(this, arguments);
                };
            }
        });

        Class.addConfig(config, true);
    });

    
    ExtClass.registerPreprocessor('mixins', function(Class, data, hooks) {
        var mixins = data.mixins,
            name, mixin, i, ln;

        delete data.mixins;

        Ext.Function.interceptBefore(hooks, 'onCreated', function() {
            if (mixins instanceof Array) {
                for (i = 0,ln = mixins.length; i < ln; i++) {
                    mixin = mixins[i];
                    name = mixin.prototype.mixinId || mixin.$className;

                    Class.mixin(name, mixin);
                }
            }
            else {
                for (name in mixins) {
                    if (mixins.hasOwnProperty(name)) {
                        Class.mixin(name, mixins[name]);
                    }
                }
            }
        });
    });

    
    Ext.extend = function(Class, Parent, members) {
        if (arguments.length === 2 && Ext.isObject(Parent)) {
            members = Parent;
            Parent = Class;
            Class = null;
        }

        var cls;

        if (!Parent) {
            throw new Error("[Ext.extend] Attempting to extend from a class which has not been loaded on the page.");
        }

        members.extend = Parent;
        members.preprocessors = [
            'extend'
            ,'statics'
            ,'inheritableStatics'
            ,'mixins'
            ,'config'
        ];

        if (Class) {
            cls = new ExtClass(Class, members);
        }
        else {
            cls = new ExtClass(members);
        }

        cls.prototype.override = function(o) {
            for (var m in o) {
                if (o.hasOwnProperty(m)) {
                    this[m] = o[m];
                }
            }
        };

        return cls;
    };

})();


(function(Class, alias, arraySlice, arrayFrom, global) {

    var Manager = Ext.ClassManager = {

        
        classes: {},

        
        existCache: {},

        
        namespaceRewrites: [{
            from: 'Ext.',
            to: Ext
        }],

        
        maps: {
            alternateToName: {},
            aliasToName: {},
            nameToAliases: {},
            nameToAlternates: {},
            overridesByName: {}
        },

        
        enableNamespaceParseCache: true,

        
        namespaceParseCache: {},

        
        instantiators: [],

        
        isCreated: function(className) {
            var existCache = this.existCache,
                i, ln, part, root, parts;


            if (this.classes[className] || existCache[className]) {
                return true;
            }

            root = global;
            parts = this.parseNamespace(className);

            for (i = 0, ln = parts.length; i < ln; i++) {
                part = parts[i];

                if (typeof part != 'string') {
                    root = part;
                } else {
                    if (!root || !root[part]) {
                        return false;
                    }

                    root = root[part];
                }
            }

            existCache[className] = true;

            this.triggerCreated(className);

            return true;
        },

        
        createdListeners: [],

        
        nameCreatedListeners: {},

        
        triggerCreated: function(className) {
            var listeners = this.createdListeners,
                nameListeners = this.nameCreatedListeners,
                i, ln, listener;

            for (i = 0,ln = listeners.length; i < ln; i++) {
                listener = listeners[i];
                listener.fn.call(listener.scope, className);
            }

            listeners = nameListeners[className];

            if (listeners) {
                for (i = 0,ln = listeners.length; i < ln; i++) {
                    listener = listeners[i];
                    listener.fn.call(listener.scope, className);
                }

                delete nameListeners[className];
            }
        },

        
        onCreated: function(fn, scope, className) {
            var listeners = this.createdListeners,
                nameListeners = this.nameCreatedListeners,
                listener = {
                    fn: fn,
                    scope: scope
                };

            if (className) {
                if (this.isCreated(className)) {
                    fn.call(scope, className);
                    return;
                }

                if (!nameListeners[className]) {
                    nameListeners[className] = [];
                }

                nameListeners[className].push(listener);
            }
            else {
                listeners.push(listener);
            }
        },

        
        parseNamespace: function(namespace) {

            var cache = this.namespaceParseCache;

            if (this.enableNamespaceParseCache) {
                if (cache.hasOwnProperty(namespace)) {
                    return cache[namespace];
                }
            }

            var parts = [],
                rewrites = this.namespaceRewrites,
                root = global,
                name = namespace,
                rewrite, from, to, i, ln;

            for (i = 0, ln = rewrites.length; i < ln; i++) {
                rewrite = rewrites[i];
                from = rewrite.from;
                to = rewrite.to;

                if (name === from || name.substring(0, from.length) === from) {
                    name = name.substring(from.length);

                    if (typeof to != 'string') {
                        root = to;
                    } else {
                        parts = parts.concat(to.split('.'));
                    }

                    break;
                }
            }

            parts.push(root);

            parts = parts.concat(name.split('.'));

            if (this.enableNamespaceParseCache) {
                cache[namespace] = parts;
            }

            return parts;
        },

        
        setNamespace: function(name, value) {
            var root = global,
                parts = this.parseNamespace(name),
                ln = parts.length - 1,
                leaf = parts[ln],
                i, part;

            for (i = 0; i < ln; i++) {
                part = parts[i];

                if (typeof part != 'string') {
                    root = part;
                } else {
                    if (!root[part]) {
                        root[part] = {};
                    }

                    root = root[part];
                }
            }

            root[leaf] = value;

            return root[leaf];
        },

        
        createNamespaces: function() {
            var root = global,
                parts, part, i, j, ln, subLn;

            for (i = 0, ln = arguments.length; i < ln; i++) {
                parts = this.parseNamespace(arguments[i]);

                for (j = 0, subLn = parts.length; j < subLn; j++) {
                    part = parts[j];

                    if (typeof part != 'string') {
                        root = part;
                    } else {
                        if (!root[part]) {
                            root[part] = {};
                        }

                        root = root[part];
                    }
                }
            }

            return root;
        },

        
        set: function(name, value) {
            var me = this,
                maps = me.maps,
                nameToAlternates = maps.nameToAlternates,
                targetName = me.getName(value),
                alternates;

            me.classes[name] = me.setNamespace(name, value);

            if (targetName && targetName !== name) {
                maps.alternateToName[name] = targetName;
                alternates = nameToAlternates[targetName] || (nameToAlternates[targetName] = []);
                alternates.push(name);
            }

            return this;
        },

        
        get: function(name) {
            var classes = this.classes;

            if (classes[name]) {
                return classes[name];
            }

            var root = global,
                parts = this.parseNamespace(name),
                part, i, ln;

            for (i = 0, ln = parts.length; i < ln; i++) {
                part = parts[i];

                if (typeof part != 'string') {
                    root = part;
                } else {
                    if (!root || !root[part]) {
                        return null;
                    }

                    root = root[part];
                }
            }

            return root;
        },

        
        setAlias: function(cls, alias) {
            var aliasToNameMap = this.maps.aliasToName,
                nameToAliasesMap = this.maps.nameToAliases,
                className;

            if (typeof cls == 'string') {
                className = cls;
            } else {
                className = this.getName(cls);
            }

            if (alias && aliasToNameMap[alias] !== className) {

                aliasToNameMap[alias] = className;
            }

            if (!nameToAliasesMap[className]) {
                nameToAliasesMap[className] = [];
            }

            if (alias) {
                Ext.Array.include(nameToAliasesMap[className], alias);
            }

            return this;
        },

        
        getByAlias: function(alias) {
            return this.get(this.getNameByAlias(alias));
        },

        
        getNameByAlias: function(alias) {
            return this.maps.aliasToName[alias] || '';
        },

        
        getNameByAlternate: function(alternate) {
            return this.maps.alternateToName[alternate] || '';
        },

        
        getAliasesByName: function(name) {
            return this.maps.nameToAliases[name] || [];
        },

        
        getName: function(object) {
            return object && object.$className || '';
        },

        
        getClass: function(object) {
            return object && object.self || null;
        },

        
        applyOverrides: function (name) {
            var me = this,
                overridesByName = me.maps.overridesByName,
                overrides = overridesByName[name],
                length = overrides && overrides.length || 0,
                createOverride = me.createOverride,
                i;

            delete overridesByName[name];

            for (i = 0; i < length; ++i) {
                createOverride.apply(me, overrides[i]);
            }
        },

        
        create: function(className, data, createdFn) {

            data.$className = className;

            return new Class(data, function() {
                var postprocessorStack = data.postprocessors || Manager.defaultPostprocessors,
                    registeredPostprocessors = Manager.postprocessors,
                    index = 0,
                    postprocessors = [],
                    postprocessor, process, i, ln, j, subLn, postprocessorProperties, postprocessorProperty,
                    alternateNames;

                delete data.postprocessors;

                for (i = 0,ln = postprocessorStack.length; i < ln; i++) {
                    postprocessor = postprocessorStack[i];

                    if (typeof postprocessor == 'string') {
                        postprocessor = registeredPostprocessors[postprocessor];
                        postprocessorProperties = postprocessor.properties;

                        if (postprocessorProperties === true) {
                            postprocessors.push(postprocessor.fn);
                        }
                        else if (postprocessorProperties) {
                            for (j = 0,subLn = postprocessorProperties.length; j < subLn; j++) {
                                postprocessorProperty = postprocessorProperties[j];

                                if (data.hasOwnProperty(postprocessorProperty)) {
                                    postprocessors.push(postprocessor.fn);
                                    break;
                                }
                            }
                        }
                    }
                    else {
                        postprocessors.push(postprocessor);
                    }
                }

                process = function(clsName, cls, clsData) {
                    postprocessor = postprocessors[index++];

                    if (!postprocessor) {
                        Manager.set(className, cls);

                        if (createdFn) {
                            createdFn.call(cls, cls);
                        }

                        Manager.triggerCreated(className);
                        return;
                    }

                    if (postprocessor.call(this, clsName, cls, clsData, process) !== false) {
                        process.apply(this, arguments);
                    }
                };

                process.call(Manager, className, this, data);

                
                Manager.applyOverrides(className);
                alternateNames = Manager.maps.nameToAlternates[className];

                for (i = 0, ln = alternateNames && alternateNames.length || 0; i < ln; ++i) {
                    Manager.applyOverrides(alternateNames[i]);
                }
            });
        },

        createOverride: function (overrideName, data, createdFn) {
            var me = this,
                className = data.override,
                cls = me.get(className),
                overrideBody, overridesByName, overrides;

            if (cls) {
                
                
                

                
                overrideBody = Ext.apply({}, data);
                delete overrideBody.requires;
                delete overrideBody.uses;
                delete overrideBody.override;

                me.create(overrideName, {
                        requires: data.requires,
                        uses: data.uses,
                        override: className
                    }, function () {
                        this.active = true;
                        if (cls.override) { 
                            cls.override(overrideBody);
                        } else { 
                            cls.self.override(overrideBody);
                        }

                        if (createdFn) {
                            
                            
                            
                            createdFn.call(cls);
                        }
                    });
            } else {
                
                
                
                
                overridesByName = me.maps.overridesByName;
                overrides = overridesByName[className] || (overridesByName[className] = []);
                overrides.push(Array.prototype.slice.call(arguments, 0));

                
                
                me.setNamespace(overrideName, {
                    override: className
                });
            }
        },

        
        instantiateByAlias: function() {
            var alias = arguments[0],
                args = arraySlice.call(arguments),
                className = this.getNameByAlias(alias);

            if (!className) {
                className = this.maps.aliasToName[alias];



                Ext.syncRequire(className);
            }

            args[0] = className;

            return this.instantiate.apply(this, args);
        },

        
        instantiate: function() {
            var name = arguments[0],
                nameType = typeof name,
                args = arraySlice.call(arguments, 1),
                alias = name,
                possibleName, cls;

            if (nameType != 'function') {
                if (nameType != 'string' && args.length === 0) {
                    args = [name];
                    name = name.xclass;
                }


                cls = this.get(name);
            }
            else {
                cls = name;
            }

            
            if (!cls) {
                possibleName = this.getNameByAlias(name);

                if (possibleName) {
                    name = possibleName;

                    cls = this.get(name);
                }
            }

            
            if (!cls) {
                possibleName = this.getNameByAlternate(name);

                if (possibleName) {
                    name = possibleName;

                    cls = this.get(name);
                }
            }

            
            if (!cls) {

                Ext.syncRequire(name);

                cls = this.get(name);
            }


            return this.getInstantiator(args.length)(cls, args);
        },

        
        dynInstantiate: function(name, args) {
            args = arrayFrom(args, true);
            args.unshift(name);

            return this.instantiate.apply(this, args);
        },

        
        getInstantiator: function(length) {
            var instantiators = this.instantiators,
                instantiator;

            instantiator = instantiators[length];

            if (!instantiator) {
                var i = length,
                    args = [];

                for (i = 0; i < length; i++) {
                    args.push('a[' + i + ']');
                }

                instantiator = instantiators[length] = new Function('c', 'a', 'return new c(' + args.join(',') + ')');
            }

            return instantiator;
        },

        
        postprocessors: {},

        
        defaultPostprocessors: [],

        
        registerPostprocessor: function(name, fn, properties, position, relativeTo) {
            if (!position) {
                position = 'last';
            }

            if (!properties) {
                properties = [name];
            }

            this.postprocessors[name] = {
                name: name,
                properties: properties || false,
                fn: fn
            };

            this.setDefaultPostprocessorPosition(name, position, relativeTo);

            return this;
        },

        
        setDefaultPostprocessors: function(postprocessors) {
            this.defaultPostprocessors = arrayFrom(postprocessors);

            return this;
        },

        
        setDefaultPostprocessorPosition: function(name, offset, relativeName) {
            var defaultPostprocessors = this.defaultPostprocessors,
                index;

            if (typeof offset == 'string') {
                if (offset === 'first') {
                    defaultPostprocessors.unshift(name);

                    return this;
                }
                else if (offset === 'last') {
                    defaultPostprocessors.push(name);

                    return this;
                }

                offset = (offset === 'after') ? 1 : -1;
            }

            index = Ext.Array.indexOf(defaultPostprocessors, relativeName);

            if (index !== -1) {
                Ext.Array.splice(defaultPostprocessors, Math.max(0, index + offset), 0, name);
            }

            return this;
        },

        
        getNamesByExpression: function(expression) {
            var nameToAliasesMap = this.maps.nameToAliases,
                names = [],
                name, alias, aliases, possibleName, regex, i, ln;


            if (expression.indexOf('*') !== -1) {
                expression = expression.replace(/\*/g, '(.*?)');
                regex = new RegExp('^' + expression + '$');

                for (name in nameToAliasesMap) {
                    if (nameToAliasesMap.hasOwnProperty(name)) {
                        aliases = nameToAliasesMap[name];

                        if (name.search(regex) !== -1) {
                            names.push(name);
                        }
                        else {
                            for (i = 0, ln = aliases.length; i < ln; i++) {
                                alias = aliases[i];

                                if (alias.search(regex) !== -1) {
                                    names.push(name);
                                    break;
                                }
                            }
                        }
                    }
                }

            } else {
                possibleName = this.getNameByAlias(expression);

                if (possibleName) {
                    names.push(possibleName);
                } else {
                    possibleName = this.getNameByAlternate(expression);

                    if (possibleName) {
                        names.push(possibleName);
                    } else {
                        names.push(expression);
                    }
                }
            }

            return names;
        }
    };

    
    Manager.registerPostprocessor('alias', function(name, cls, data) {
        var aliases = data.alias,
            i, ln;

        for (i = 0,ln = aliases.length; i < ln; i++) {
            alias = aliases[i];

            this.setAlias(cls, alias);
        }

    }, ['xtype', 'alias']);

    
    Manager.registerPostprocessor('singleton', function(name, cls, data, fn) {
        fn.call(this, name, new cls(), data);
        return false;
    });

    
    Manager.registerPostprocessor('alternateClassName', function(name, cls, data) {
        var alternates = data.alternateClassName,
            i, ln, alternate;

        if (!(alternates instanceof Array)) {
            alternates = [alternates];
        }

        for (i = 0, ln = alternates.length; i < ln; i++) {
            alternate = alternates[i];


            this.set(alternate, cls);
        }
    });

    Ext.apply(Ext, {
        
        create: alias(Manager, 'instantiate'),

        
        widget: function(name, config) {
            
            
            
            
            
            
            
            var xtype = name,
                alias, className, T, load;

            if (typeof xtype != 'string') { 
                
                config = name; 
                if (config.isComponent) {
                    return config;
                }
                xtype = config.xtype;
            }

            alias = 'widget.' + xtype;
            className = Manager.getNameByAlias(alias);

            
            if (!className) {
                load = true;
            }
            
            T = Manager.get(className);
            if (load || !T) {
                return Manager.instantiateByAlias(alias, config || {});
            }
            return new T(config);
        },

        
        createByAlias: alias(Manager, 'instantiateByAlias'),

        
        define: function (className, data, createdFn) {
            if (data.override) {
                return Manager.createOverride.apply(Manager, arguments);
            }

            return Manager.create.apply(Manager, arguments);
        },

        
        getClassName: alias(Manager, 'getName'),

        
        getDisplayName: function(object) {
            if (object) {
                if (object.displayName) {
                    return object.displayName;
                }

                if (object.$name && object.$class) {
                    return Ext.getClassName(object.$class) + '#' + object.$name;
                }

                if (object.$className) {
                    return object.$className;
                }
            }

            return 'Anonymous';
        },

        
        getClass: alias(Manager, 'getClass'),

        
        namespace: alias(Manager, 'createNamespaces')
    });

    
    Ext.createWidget = Ext.widget;

    
    Ext.ns = Ext.namespace;

    Class.registerPreprocessor('className', function(cls, data) {
        if (data.$className) {
            cls.$className = data.$className;
        }
    }, true, 'first');

    Class.registerPreprocessor('alias', function(cls, data) {
        var prototype = cls.prototype,
            xtypes = arrayFrom(data.xtype),
            aliases = arrayFrom(data.alias),
            widgetPrefix = 'widget.',
            widgetPrefixLength = widgetPrefix.length,
            xtypesChain = Array.prototype.slice.call(prototype.xtypesChain || []),
            xtypesMap = Ext.merge({}, prototype.xtypesMap || {}),
            i, ln, alias, xtype;

        for (i = 0,ln = aliases.length; i < ln; i++) {
            alias = aliases[i];


            if (alias.substring(0, widgetPrefixLength) === widgetPrefix) {
                xtype = alias.substring(widgetPrefixLength);
                Ext.Array.include(xtypes, xtype);
            }
        }

        cls.xtype = data.xtype = xtypes[0];
        data.xtypes = xtypes;

        for (i = 0,ln = xtypes.length; i < ln; i++) {
            xtype = xtypes[i];

            if (!xtypesMap[xtype]) {
                xtypesMap[xtype] = true;
                xtypesChain.push(xtype);
            }
        }

        data.xtypesChain = xtypesChain;
        data.xtypesMap = xtypesMap;

        Ext.Function.interceptAfter(data, 'onClassCreated', function() {
            var mixins = prototype.mixins,
                key, mixin;

            for (key in mixins) {
                if (mixins.hasOwnProperty(key)) {
                    mixin = mixins[key];

                    xtypes = mixin.xtypes;

                    if (xtypes) {
                        for (i = 0,ln = xtypes.length; i < ln; i++) {
                            xtype = xtypes[i];

                            if (!xtypesMap[xtype]) {
                                xtypesMap[xtype] = true;
                                xtypesChain.push(xtype);
                            }
                        }
                    }
                }
            }
        });

        for (i = 0,ln = xtypes.length; i < ln; i++) {
            xtype = xtypes[i];


            Ext.Array.include(aliases, widgetPrefix + xtype);
        }

        data.alias = aliases;

    }, ['xtype', 'alias']);

})(Ext.Class, Ext.Function.alias, Array.prototype.slice, Ext.Array.from, Ext.global);



(function(Manager, Class, flexSetter, alias, pass, arrayFrom, arrayErase, arrayInclude) {

    var
        dependencyProperties = ['extend', 'mixins', 'requires'],
        Loader;

    Loader = Ext.Loader = {

        
        isInHistory: {},

        
        history: [],

        
        config: {
            
            enabled: false,

            
            disableCaching: true,

            
            disableCachingParam: '_dc',

            
            paths: {
                'Ext': '.'
            }
        },

        
        setConfig: function(name, value) {
            if (Ext.isObject(name) && arguments.length === 1) {
                Ext.merge(this.config, name);
            }
            else {
                this.config[name] = (Ext.isObject(value)) ? Ext.merge(this.config[name], value) : value;
            }

            return this;
        },

        
        getConfig: function(name) {
            if (name) {
                return this.config[name];
            }

            return this.config;
        },

        
        setPath: flexSetter(function(name, path) {
            this.config.paths[name] = path;

            return this;
        }),

        
        getPath: function(className) {
            var path = '',
                paths = this.config.paths,
                prefix = this.getPrefix(className);

            if (prefix.length > 0) {
                if (prefix === className) {
                    return paths[prefix];
                }

                path = paths[prefix];
                className = className.substring(prefix.length + 1);
            }

            if (path.length > 0) {
                path += '/';
            }

            return path.replace(/\/\.\//g, '/') + className.replace(/\./g, "/") + '.js';
        },

        
        getPrefix: function(className) {
            var paths = this.config.paths,
                prefix, deepestPrefix = '';

            if (paths.hasOwnProperty(className)) {
                return className;
            }

            for (prefix in paths) {
                if (paths.hasOwnProperty(prefix) && prefix + '.' === className.substring(0, prefix.length + 1)) {
                    if (prefix.length > deepestPrefix.length) {
                        deepestPrefix = prefix;
                    }
                }
            }

            return deepestPrefix;
        },

        
        require: function(expressions, fn, scope, excludes) {
            if (fn) {
                fn.call(scope);
            }
        },

        
        syncRequire: function() {},

        
        exclude: function(excludes) {
            var me = this;

            return {
                require: function(expressions, fn, scope) {
                    return me.require(expressions, fn, scope, excludes);
                },

                syncRequire: function(expressions, fn, scope) {
                    return me.syncRequire(expressions, fn, scope, excludes);
                }
            };
        },

        
        onReady: function(fn, scope, withDomReady, options) {
            var oldFn;

            if (withDomReady !== false && Ext.onDocumentReady) {
                oldFn = fn;

                fn = function() {
                    Ext.onDocumentReady(oldFn, scope, options);
                };
            }

            fn.call(scope);
        }
    };

    Ext.apply(Loader, {
        
        documentHead: typeof document != 'undefined' && (document.head || document.getElementsByTagName('head')[0]),

        
        isLoading: false,

        
        queue: [],

        
        isClassFileLoaded: {},

        
        isFileLoaded: {},

        
        readyListeners: [],

        
        optionalRequires: [],

        
        requiresMap: {},

        
        numPendingFiles: 0,

        
        numLoadedFiles: 0,

        
        hasFileLoadError: false,

        
        classNameToFilePathMap: {},

        
        syncModeEnabled: false,

        scriptElements: {},

        
        refreshQueue: function() {
            var queue = this.queue,
                ln = queue.length,
                i, item, j, requires, references;

            if (ln === 0) {
                this.triggerReady();
                return;
            }

            for (i = 0; i < ln; i++) {
                item = queue[i];

                if (item) {
                    requires = item.requires;
                    references = item.references;

                    
                    
                    if (requires.length > this.numLoadedFiles) {
                        continue;
                    }

                    j = 0;

                    do {
                        if (Manager.isCreated(requires[j])) {
                            
                            arrayErase(requires, j, 1);
                        }
                        else {
                            j++;
                        }
                    } while (j < requires.length);

                    if (item.requires.length === 0) {
                        arrayErase(queue, i, 1);
                        item.callback.call(item.scope);
                        this.refreshQueue();
                        break;
                    }
                }
            }

            return this;
        },

        
        injectScriptElement: function(url, onLoad, onError, scope) {
            var script = document.createElement('script'),
                me = this,
                onLoadFn = function() {
                    me.cleanupScriptElement(script);
                    onLoad.call(scope);
                },
                onErrorFn = function() {
                    me.cleanupScriptElement(script);
                    onError.call(scope);
                };

            script.type = 'text/javascript';
            script.src = url;
            script.onload = onLoadFn;
            script.onerror = onErrorFn;
            script.onreadystatechange = function() {
                if (this.readyState === 'loaded' || this.readyState === 'complete') {
                    onLoadFn();
                }
            };

            this.documentHead.appendChild(script);

            return script;
        },

        removeScriptElement: function(url) {
            var scriptElements = this.scriptElements;

            if (scriptElements[url]) {
                this.cleanupScriptElement(scriptElements[url], true);
                delete scriptElements[url];
            }

            return this;
        },

        
        cleanupScriptElement: function(script, remove) {
            script.onload = null;
            script.onreadystatechange = null;
            script.onerror = null;

            if (remove) {
                this.documentHead.removeChild(script);
            }

            return this;
        },

        
        loadScriptFile: function(url, onLoad, onError, scope, synchronous) {
            var me = this,
                isFileLoaded = this.isFileLoaded,
                scriptElements = this.scriptElements,
                noCacheUrl = url + (this.getConfig('disableCaching') ? ('?' + this.getConfig('disableCachingParam') + '=' + Ext.Date.now()) : ''),
                isCrossOriginRestricted = false,
                xhr, status, onScriptError;

            if (isFileLoaded[url]) {
                return this;
            }

            scope = scope || this;

            this.isLoading = true;

            if (!synchronous) {
                onScriptError = function() {
                };

                if (!Ext.isReady && Ext.onDocumentReady) {
                    Ext.onDocumentReady(function() {
                        if (!isFileLoaded[url]) {
                            scriptElements[url] = me.injectScriptElement(noCacheUrl, onLoad, onScriptError, scope);
                        }
                    });
                }
                else {
                    scriptElements[url] = this.injectScriptElement(noCacheUrl, onLoad, onScriptError, scope);
                }
            }
            else {
                if (typeof XMLHttpRequest != 'undefined') {
                    xhr = new XMLHttpRequest();
                } else {
                    xhr = new ActiveXObject('Microsoft.XMLHTTP');
                }

                try {
                    xhr.open('GET', noCacheUrl, false);
                    xhr.send(null);
                } catch (e) {
                    isCrossOriginRestricted = true;
                }

                status = (xhr.status === 1223) ? 204 : xhr.status;

                if (!isCrossOriginRestricted) {
                    isCrossOriginRestricted = (status === 0);
                }

                if (isCrossOriginRestricted
                ) {
                }
                else if (status >= 200 && status < 300
                ) {
                    
                    
                    Ext.globalEval(xhr.responseText + "\n//@ sourceURL=" + url);

                    onLoad.call(scope);
                }
                else {
                }

                
                xhr = null;
            }
        },

        
        syncRequire: function() {
            var syncModeEnabled = this.syncModeEnabled;

            if (!syncModeEnabled) {
                this.syncModeEnabled = true;
            }

            this.require.apply(this, arguments);

            if (!syncModeEnabled) {
                this.syncModeEnabled = false;
            }

            this.refreshQueue();
        },

        
        require: function(expressions, fn, scope, excludes) {
            var excluded = {},
                included = {},
                queue = this.queue,
                classNameToFilePathMap = this.classNameToFilePathMap,
                isClassFileLoaded = this.isClassFileLoaded,
                excludedClassNames = [],
                possibleClassNames = [],
                classNames = [],
                references = [],
                callback,
                syncModeEnabled,
                filePath, expression, exclude, className,
                possibleClassName, i, j, ln, subLn;

            if (excludes) {
                excludes = arrayFrom(excludes);

                for (i = 0,ln = excludes.length; i < ln; i++) {
                    exclude = excludes[i];

                    if (typeof exclude == 'string' && exclude.length > 0) {
                        excludedClassNames = Manager.getNamesByExpression(exclude);

                        for (j = 0,subLn = excludedClassNames.length; j < subLn; j++) {
                            excluded[excludedClassNames[j]] = true;
                        }
                    }
                }
            }

            expressions = arrayFrom(expressions);

            if (fn) {
                if (fn.length > 0) {
                    callback = function() {
                        var classes = [],
                            i, ln, name;

                        for (i = 0,ln = references.length; i < ln; i++) {
                            name = references[i];
                            classes.push(Manager.get(name));
                        }

                        return fn.apply(this, classes);
                    };
                }
                else {
                    callback = fn;
                }
            }
            else {
                callback = Ext.emptyFn;
            }

            scope = scope || Ext.global;

            for (i = 0,ln = expressions.length; i < ln; i++) {
                expression = expressions[i];

                if (typeof expression == 'string' && expression.length > 0) {
                    possibleClassNames = Manager.getNamesByExpression(expression);
                    subLn = possibleClassNames.length;

                    for (j = 0; j < subLn; j++) {
                        possibleClassName = possibleClassNames[j];

                        if (excluded[possibleClassName] !== true) {
                            references.push(possibleClassName);

                            if (!Manager.isCreated(possibleClassName) && !included[possibleClassName]) {
                                included[possibleClassName] = true;
                                classNames.push(possibleClassName);
                            }
                        }
                    }
                }
            }

            
            
            if (classNames.length > 0) {
                if (!this.config.enabled) {
                    throw new Error("Ext.Loader is not enabled, so dependencies cannot be resolved dynamically. " +
                             "Missing required class" + ((classNames.length > 1) ? "es" : "") + ": " + classNames.join(', '));
                }
            }
            else {
                callback.call(scope);
                return this;
            }

            syncModeEnabled = this.syncModeEnabled;

            if (!syncModeEnabled) {
                queue.push({
                    requires: classNames.slice(), 
                                                  
                    callback: callback,
                    scope: scope
                });
            }

            ln = classNames.length;

            for (i = 0; i < ln; i++) {
                className = classNames[i];

                filePath = this.getPath(className);

                
                
                
                if (syncModeEnabled && isClassFileLoaded.hasOwnProperty(className)) {
                    this.numPendingFiles--;
                    this.removeScriptElement(filePath);
                    delete isClassFileLoaded[className];
                }

                if (!isClassFileLoaded.hasOwnProperty(className)) {
                    isClassFileLoaded[className] = false;

                    classNameToFilePathMap[className] = filePath;

                    this.numPendingFiles++;

                    this.loadScriptFile(
                        filePath,
                        pass(this.onFileLoaded, [className, filePath], this),
                        pass(this.onFileLoadError, [className, filePath], this),
                        this,
                        syncModeEnabled
                    );
                }
            }

            if (syncModeEnabled) {
                callback.call(scope);

                if (ln === 1) {
                    return Manager.get(className);
                }
            }

            return this;
        },

        
        onFileLoaded: function(className, filePath) {
            this.numLoadedFiles++;

            this.isClassFileLoaded[className] = true;
            this.isFileLoaded[filePath] = true;

            this.numPendingFiles--;

            if (this.numPendingFiles === 0) {
                this.refreshQueue();
            }

        },

        
        onFileLoadError: function(className, filePath, errorMessage, isSynchronous) {
            this.numPendingFiles--;
            this.hasFileLoadError = true;

        },

        
        addOptionalRequires: function(requires) {
            var optionalRequires = this.optionalRequires,
                i, ln, require;

            requires = arrayFrom(requires);

            for (i = 0, ln = requires.length; i < ln; i++) {
                require = requires[i];

                arrayInclude(optionalRequires, require);
            }

            return this;
        },

        
        triggerReady: function(force) {
            var readyListeners = this.readyListeners,
                optionalRequires = this.optionalRequires,
                listener;

            if (this.isLoading || force) {
                this.isLoading = false;

                if (optionalRequires.length !== 0) {
                    
                    optionalRequires = optionalRequires.slice();

                    
                    this.optionalRequires.length = 0;

                    this.require(optionalRequires, pass(this.triggerReady, [true], this), this);
                    return this;
                }

                while (readyListeners.length) {
                    listener = readyListeners.shift();
                    listener.fn.call(listener.scope);

                    if (this.isLoading) {
                        return this;
                    }
                }
            }

            return this;
        },

        
        onReady: function(fn, scope, withDomReady, options) {
            var oldFn;

            if (withDomReady !== false && Ext.onDocumentReady) {
                oldFn = fn;

                fn = function() {
                    Ext.onDocumentReady(oldFn, scope, options);
                };
            }

            if (!this.isLoading) {
                fn.call(scope);
            }
            else {
                this.readyListeners.push({
                    fn: fn,
                    scope: scope
                });
            }
        },

        
        historyPush: function(className) {
            var isInHistory = this.isInHistory;

            if (className && this.isClassFileLoaded.hasOwnProperty(className) && !isInHistory[className]) {
                isInHistory[className] = true;
                this.history.push(className);
            }

            return this;
        }
    });

    
    Ext.disableCacheBuster = function (disable, path) {
        var date = new Date();
        date.setTime(date.getTime() + (disable ? 10*365 : -1) * 24*60*60*1000);
        date = date.toGMTString();
        document.cookie = 'ext-cache=1; expires=' + date + '; path='+(path || '/');
    };


    
    Ext.require = alias(Loader, 'require');

    
    Ext.syncRequire = alias(Loader, 'syncRequire');

    
    Ext.exclude = alias(Loader, 'exclude');

    
    Ext.onReady = function(fn, scope, options) {
        Loader.onReady(fn, scope, true, options);
    };

    
    Class.registerPreprocessor('loader', function(cls, data, hooks, continueFn) {
        var me = this,
            dependencies = [],
            className = Manager.getName(cls),
            i, j, ln, subLn, value, propertyName, propertyValue;

        

        for (i = 0,ln = dependencyProperties.length; i < ln; i++) {
            propertyName = dependencyProperties[i];

            if (data.hasOwnProperty(propertyName)) {
                propertyValue = data[propertyName];

                if (typeof propertyValue == 'string') {
                    dependencies.push(propertyValue);
                }
                else if (propertyValue instanceof Array) {
                    for (j = 0, subLn = propertyValue.length; j < subLn; j++) {
                        value = propertyValue[j];

                        if (typeof value == 'string') {
                            dependencies.push(value);
                        }
                    }
                }
                else if (typeof propertyValue != 'function') {
                    for (j in propertyValue) {
                        if (propertyValue.hasOwnProperty(j)) {
                            value = propertyValue[j];

                            if (typeof value == 'string') {
                                dependencies.push(value);
                            }
                        }
                    }
                }
            }
        }

        if (dependencies.length === 0) {
            return;
        }


        Loader.require(dependencies, function() {
            for (i = 0,ln = dependencyProperties.length; i < ln; i++) {
                propertyName = dependencyProperties[i];

                if (data.hasOwnProperty(propertyName)) {
                    propertyValue = data[propertyName];

                    if (typeof propertyValue == 'string') {
                        data[propertyName] = Manager.get(propertyValue);
                    }
                    else if (propertyValue instanceof Array) {
                        for (j = 0, subLn = propertyValue.length; j < subLn; j++) {
                            value = propertyValue[j];

                            if (typeof value == 'string') {
                                data[propertyName][j] = Manager.get(value);
                            }
                        }
                    }
                    else if (typeof propertyValue != 'function') {
                        for (var k in propertyValue) {
                            if (propertyValue.hasOwnProperty(k)) {
                                value = propertyValue[k];

                                if (typeof value == 'string') {
                                    data[propertyName][k] = Manager.get(value);
                                }
                            }
                        }
                    }
                }
            }

            continueFn.call(me, cls, data, hooks);
        });

        return false;
    }, true, 'after', 'className');

    
    Manager.registerPostprocessor('uses', function(name, cls, data) {
        var uses = arrayFrom(data.uses),
            items = [],
            i, ln, item;

        for (i = 0,ln = uses.length; i < ln; i++) {
            item = uses[i];

            if (typeof item == 'string') {
                items.push(item);
            }
        }

        Loader.addOptionalRequires(items);
    });

    Manager.onCreated(function(className) {
        this.historyPush(className);
    }, Loader);

})(Ext.ClassManager, Ext.Class, Ext.Function.flexSetter, Ext.Function.alias,
   Ext.Function.pass, Ext.Array.from, Ext.Array.erase, Ext.Array.include);


Ext.Error = Ext.extend(Error, {
    statics: {
        
        ignore: false,

        
        

        
        raise: function(err){
            err = err || {};
            if (Ext.isString(err)) {
                err = { msg: err };
            }

            var method = this.raise.caller;

            if (method) {
                if (method.$name) {
                    err.sourceMethod = method.$name;
                }
                if (method.$owner) {
                    err.sourceClass = method.$owner.$className;
                }
            }

            if (Ext.Error.handle(err) !== true) {
                var msg = Ext.Error.prototype.toString.call(err);

                Ext.log({
                    msg: msg,
                    level: 'error',
                    dump: err,
                    stack: true
                });

                throw new Ext.Error(err);
            }
        },

        
        handle: function(){
            return Ext.Error.ignore;
        }
    },

    
    name: 'Ext.Error',

    
    constructor: function(config){
        if (Ext.isString(config)) {
            config = { msg: config };
        }

        var me = this;

        Ext.apply(me, config);

        me.message = me.message || me.msg; 
        
    },

    
    toString: function(){
        var me = this,
            className = me.className ? me.className  : '',
            methodName = me.methodName ? '.' + me.methodName + '(): ' : '',
            msg = me.msg || '(No description provided)';

        return className + methodName + msg;
    }
});


Ext.deprecated = function (suggestion) {
    return Ext.emptyFn;
};





Ext.JSON = new(function() {
    var me = this,
    encodingFunction,
    decodingFunction,
    useNative = null,
    useHasOwn = !! {}.hasOwnProperty,
    isNative = function() {
        if (useNative === null) {
            useNative = Ext.USE_NATIVE_JSON && window.JSON && JSON.toString() == '[object JSON]';
        }
        return useNative;
    },
    pad = function(n) {
        return n < 10 ? "0" + n : n;
    },
    doDecode = function(json) {
        return eval("(" + json + ')');
    },
    doEncode = function(o, newline) {
        
        if (o === null || o === undefined) {
            return "null";
        } else if (Ext.isDate(o)) {
            return Ext.JSON.encodeDate(o);
        } else if (Ext.isString(o)) {
            return encodeString(o);
        }
        
        
        else if (o.toJSON) {
            return o.toJSON();
        } else if (Ext.isArray(o)) {
            return encodeArray(o, newline);
        } else if (typeof o == "number") {
            
            return isFinite(o) ? String(o) : "null";
        } else if (Ext.isBoolean(o)) {
            return String(o);
        } else if (Ext.isObject(o)) {
            return encodeObject(o, newline);
        } else if (typeof o === "function") {
            return "null";
        }
        return 'undefined';
    },
    m = {
        "\b": '\\b',
        "\t": '\\t',
        "\n": '\\n',
        "\f": '\\f',
        "\r": '\\r',
        '"': '\\"',
        "\\": '\\\\',
        '\x0b': '\\u000b' 
    },
    charToReplace = /[\\\"\x00-\x1f\x7f-\uffff]/g,
    encodeString = function(s) {
        return '"' + s.replace(charToReplace, function(a) {
            var c = m[a];
            return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"';
    },


    encodeArray = function(o, newline) {

        var a = ["[", ""], 
            len = o.length,
            i;
        for (i = 0; i < len; i += 1) {
            a.push(doEncode(o[i]), ',');
        }
        
        a[a.length - 1] = ']';
        return a.join("");
    },

    encodeObject = function(o, newline) {

        var a = ["{", ""], 
            i;
        for (i in o) {
            if (!useHasOwn || o.hasOwnProperty(i)) {
                a.push(doEncode(i), ":", doEncode(o[i]), ',');
            }
        }
        
        a[a.length - 1] = '}';
        return a.join("");
    };

    
    me.encodeValue = doEncode;

    
    me.encodeDate = function(o) {
        return '"' + o.getFullYear() + "-"
        + pad(o.getMonth() + 1) + "-"
        + pad(o.getDate()) + "T"
        + pad(o.getHours()) + ":"
        + pad(o.getMinutes()) + ":"
        + pad(o.getSeconds()) + '"';
    };

    
    me.encode = function(o) {
        if (!encodingFunction) {
            
            encodingFunction = isNative() ? JSON.stringify : me.encodeValue;
        }
        return encodingFunction(o);
    };

    
    me.decode = function(json, safe) {
        if (!decodingFunction) {
            
            decodingFunction = isNative() ? JSON.parse : doDecode;
        }
        try {
            return decodingFunction(json);
        } catch (e) {
            if (safe === true) {
                return null;
            }
            Ext.Error.raise({
                sourceClass: "Ext.JSON",
                sourceMethod: "decode",
                msg: "You're trying to decode an invalid JSON String: " + json
            });
        }
    };
})();

Ext.encode = Ext.JSON.encode;

Ext.decode = Ext.JSON.decode;

Ext.apply(Ext, {
    userAgent: navigator.userAgent.toLowerCase(),
    cache: {},
    idSeed: 1000,
    windowId: 'ext-window',
    documentId: 'ext-document',

    
    isReady: false,

    
    enableGarbageCollector: true,

    
    enableListenerCollection: true,
    
    
    id: function(el, prefix) {
        var me = this,
            sandboxPrefix = '';
        el = Ext.getDom(el, true) || {};
        if (el === document) {
            el.id = me.documentId;
        }
        else if (el === window) {
            el.id = me.windowId;
        }
        if (!el.id) {
            if (me.isSandboxed) {
                sandboxPrefix = Ext.sandboxName.toLowerCase() + '-';
            }
            el.id = sandboxPrefix + (prefix || "ext-gen") + (++Ext.idSeed);
        }
        return el.id;
    },

    
    getBody: function() {
        var body;
        return function() {
            return body || (body = Ext.get(document.body));
        };
    }(),

    
    getHead: function() {
        var head;
        return function() {
            return head || (head = Ext.get(document.getElementsByTagName("head")[0]));
        };
    }(),

    
    getDoc: function() {
        var doc;
        return function() {
            return doc || (doc = Ext.get(document));
        };
    }(),

    
    getCmp: function(id) {
        return Ext.ComponentManager.get(id);
    },

    
    getOrientation: function() {
        return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
    },

    
    destroy: function() {
        var ln = arguments.length,
        i, arg;

        for (i = 0; i < ln; i++) {
            arg = arguments[i];
            if (arg) {
                if (Ext.isArray(arg)) {
                    this.destroy.apply(this, arg);
                }
                else if (Ext.isFunction(arg.destroy)) {
                    arg.destroy();
                }
                else if (arg.dom) {
                    arg.remove();
                }
            }
        }
    },

    
    callback: function(callback, scope, args, delay){
        if(Ext.isFunction(callback)){
            args = args || [];
            scope = scope || window;
            if (delay) {
                Ext.defer(callback, delay, scope, args);
            } else {
                callback.apply(scope, args);
            }
        }
    },

    
    htmlEncode : function(value) {
        return Ext.String.htmlEncode(value);
    },

    
    htmlDecode : function(value) {
         return Ext.String.htmlDecode(value);
    },

    
    urlAppend : function(url, s) {
        return Ext.String.urlAppend(url, s);
    }
});


Ext.ns = Ext.namespace;


window.undefined = window.undefined;


(function(){

    var check = function(regex){
            return regex.test(Ext.userAgent);
        },
        isStrict = document.compatMode == "CSS1Compat",
        version = function (is, regex) {
            var m;
            return (is && (m = regex.exec(Ext.userAgent))) ? parseFloat(m[1]) : 0;
        },
        docMode = document.documentMode,
        isOpera = check(/opera/),
        isOpera10_5 = isOpera && check(/version\/10\.5/),
        isChrome = check(/\bchrome\b/),
        isWebKit = check(/webkit/),
        isSafari = !isChrome && check(/safari/),
        isSafari2 = isSafari && check(/applewebkit\/4/), 
        isSafari3 = isSafari && check(/version\/3/),
        isSafari4 = isSafari && check(/version\/4/),
        isSafari5 = isSafari && check(/version\/5/),
        isIE = !isOpera && check(/msie/),
        isIE7 = isIE && ((check(/msie 7/) && docMode != 8 && docMode != 9) || docMode == 7),
        isIE8 = isIE && ((check(/msie 8/) && docMode != 7 && docMode != 9) || docMode == 8),
        isIE9 = isIE && ((check(/msie 9/) && docMode != 7 && docMode != 8) || docMode == 9),
        isIE6 = isIE && check(/msie 6/),
        isGecko = !isWebKit && check(/gecko/),
        isGecko3 = isGecko && check(/rv:1\.9/),
        isGecko4 = isGecko && check(/rv:2\.0/),
        isGecko5 = isGecko && check(/rv:5\./),
        isFF3_0 = isGecko3 && check(/rv:1\.9\.0/),
        isFF3_5 = isGecko3 && check(/rv:1\.9\.1/),
        isFF3_6 = isGecko3 && check(/rv:1\.9\.2/),
        isWindows = check(/windows|win32/),
        isMac = check(/macintosh|mac os x/),
        isLinux = check(/linux/),
        scrollbarSize = null,
        chromeVersion = version(true, /\bchrome\/(\d+\.\d+)/),
        firefoxVersion = version(true, /\bfirefox\/(\d+\.\d+)/),
        ieVersion = version(isIE, /msie (\d+\.\d+)/),
        operaVersion = version(isOpera, /version\/(\d+\.\d+)/),
        safariVersion = version(isSafari, /version\/(\d+\.\d+)/),
        webKitVersion = version(isWebKit, /webkit\/(\d+\.\d+)/),
        isSecure = /^https/i.test(window.location.protocol);

    
    try {
        document.execCommand("BackgroundImageCache", false, true);
    } catch(e) {}



    var nullLog = function () {};
    nullLog.info = nullLog.warn = nullLog.error = Ext.emptyFn;

    Ext.setVersion('extjs', '4.1.0');
    Ext.apply(Ext, {
        
        SSL_SECURE_URL : isSecure && isIE ? 'javascript:\'\'' : 'about:blank',

        

        
        scopeResetCSS : Ext.buildSettings.scopeResetCSS,
        
        
        resetCls: Ext.buildSettings.baseCSSPrefix + 'reset',

        
        enableNestedListenerRemoval : false,

        
        USE_NATIVE_JSON : false,

        
        getDom : function(el, strict) {
            if (!el || !document) {
                return null;
            }
            if (el.dom) {
                return el.dom;
            } else {
                if (typeof el == 'string') {
                    var e = Ext.getElementById(el);
                    
                    
                    if (e && isIE && strict) {
                        if (el == e.getAttribute('id')) {
                            return e;
                        } else {
                            return null;
                        }
                    }
                    return e;
                } else {
                    return el;
                }
            }
        },

        
        removeNode : isIE6 || isIE7 ? function() {
            var d;
            return function(n){
                if(n && n.tagName != 'BODY'){
                    (Ext.enableNestedListenerRemoval) ? Ext.EventManager.purgeElement(n) : Ext.EventManager.removeAll(n);
                    d = d || document.createElement('div');
                    d.appendChild(n);
                    d.innerHTML = '';
                    delete Ext.cache[n.id];
                }
            };
        }() : function(n) {
            if (n && n.parentNode && n.tagName != 'BODY') {
                (Ext.enableNestedListenerRemoval) ? Ext.EventManager.purgeElement(n) : Ext.EventManager.removeAll(n);
                n.parentNode.removeChild(n);
                delete Ext.cache[n.id];
            }
        },

        isStrict: isStrict,

        isIEQuirks: isIE && !isStrict,

        
        isOpera : isOpera,

        
        isOpera10_5 : isOpera10_5,

        
        isWebKit : isWebKit,

        
        isChrome : isChrome,

        
        isSafari : isSafari,

        
        isSafari3 : isSafari3,

        
        isSafari4 : isSafari4,

        
        isSafari5 : isSafari5,

        
        isSafari2 : isSafari2,

        
        isIE : isIE,

        
        isIE6 : isIE6,

        
        isIE7 : isIE7,

        
        isIE8 : isIE8,

        
        isIE9 : isIE9,

        
        isGecko : isGecko,

        
        isGecko3 : isGecko3,

        
        isGecko4 : isGecko4,

        
        isGecko5 : isGecko5,

        
        isFF3_0 : isFF3_0,

        
        isFF3_5 : isFF3_5,

        
        isFF3_6 : isFF3_6,

        
        isFF4 : 4 <= firefoxVersion && firefoxVersion < 5,

        
        isFF5 : 5 <= firefoxVersion && firefoxVersion < 6,

        
        isLinux : isLinux,

        
        isWindows : isWindows,

        
        isMac : isMac,

        
        chromeVersion: chromeVersion,

        
        firefoxVersion: firefoxVersion,

        
        ieVersion: ieVersion,

        
        operaVersion: operaVersion,

        
        safariVersion: safariVersion,

        
        webKitVersion: webKitVersion,

        
        isSecure: isSecure,
        
        
        BLANK_IMAGE_URL : (isIE6 || isIE7) ? '/' + '/www.sencha.com/s.gif' : 'data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',

        
        value : function(v, defaultValue, allowBlank){
            return Ext.isEmpty(v, allowBlank) ? defaultValue : v;
        },

        
        escapeRe : function(s) {
            return s.replace(/([-.*+?^${}()|[\]\/\\])/g, "\\$1");
        },

        
        addBehaviors : function(o){
            if(!Ext.isReady){
                Ext.onReady(function(){
                    Ext.addBehaviors(o);
                });
            } else {
                var cache = {}, 
                    parts,
                    b,
                    s;
                for (b in o) {
                    if ((parts = b.split('@'))[1]) { 
                        s = parts[0];
                        if(!cache[s]){
                            cache[s] = Ext.select(s);
                        }
                        cache[s].on(parts[1], o[b]);
                    }
                }
                cache = null;
            }
        },

        
        getScrollbarSize: function (force) {
            if (!Ext.isReady) {
                return {};
            }

            if (force || !scrollbarSize) {
                var db = document.body,
                    div = document.createElement('div');

                div.style.width = div.style.height = '100px';
                div.style.overflow = 'scroll';
                div.style.position = 'absolute';

                db.appendChild(div); 

                
                scrollbarSize = {
                    width: div.offsetWidth - div.clientWidth,
                    height: div.offsetHeight - div.clientHeight
                };

                db.removeChild(div);
            }

            return scrollbarSize;
        },

        
        getScrollBarWidth: function(force){
            var size = Ext.getScrollbarSize(force);
            return size.width + 2; 
        },

        
        copyTo : function(dest, source, names, usePrototypeKeys){
            if(typeof names == 'string'){
                names = names.split(/[,;\s]/);
            }
            Ext.each(names, function(name){
                if(usePrototypeKeys || source.hasOwnProperty(name)){
                    dest[name] = source[name];
                }
            }, this);
            return dest;
        },

        
        destroyMembers : function(o){
            for (var i = 1, a = arguments, len = a.length; i < len; i++) {
                Ext.destroy(o[a[i]]);
                delete o[a[i]];
            }
        },

        
        log :
            nullLog,

        
        partition : function(arr, truth){
            var ret = [[],[]];
            Ext.each(arr, function(v, i, a) {
                ret[ (truth && truth(v, i, a)) || (!truth && v) ? 0 : 1].push(v);
            });
            return ret;
        },

        
        invoke : function(arr, methodName){
            var ret = [],
                args = Array.prototype.slice.call(arguments, 2);
            Ext.each(arr, function(v,i) {
                if (v && typeof v[methodName] == 'function') {
                    ret.push(v[methodName].apply(v, args));
                } else {
                    ret.push(undefined);
                }
            });
            return ret;
        },

        
        zip : function(){
            var parts = Ext.partition(arguments, function( val ){ return typeof val != 'function'; }),
                arrs = parts[0],
                fn = parts[1][0],
                len = Ext.max(Ext.pluck(arrs, "length")),
                ret = [];

            for (var i = 0; i < len; i++) {
                ret[i] = [];
                if(fn){
                    ret[i] = fn.apply(fn, Ext.pluck(arrs, i));
                }else{
                    for (var j = 0, aLen = arrs.length; j < aLen; j++){
                        ret[i].push( arrs[j][i] );
                    }
                }
            }
            return ret;
        },

        
        toSentence: function(items, connector) {
            var length = items.length;

            if (length <= 1) {
                return items[0];
            } else {
                var head = items.slice(0, length - 1),
                    tail = items[length - 1];

                return Ext.util.Format.format("{0} {1} {2}", head.join(", "), connector || 'and', tail);
            }
        },

        
        useShims: isIE6
    });
})();


Ext.application = function(config) {
    Ext.require('Ext.app.Application');

    Ext.onReady(function() {
        new Ext.app.Application(config);
    });
};



(function() {
    Ext.ns('Ext.util');

    Ext.util.Format = {};
    var UtilFormat     = Ext.util.Format,
        stripTagsRE    = /<\/?[^>]+>/gi,
        stripScriptsRe = /(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)/ig,
        nl2brRe        = /\r?\n/g,

        
        formatCleanRe  = /[^\d\.]/g,

        
        
        I18NFormatCleanRe;

    Ext.apply(UtilFormat, {
        
        
        thousandSeparator: ',',
        

        
        
        decimalSeparator: '.',
        

        
        
        currencyPrecision: 2,
        

        
         
        currencySign: '$',
        

        
        
        currencyAtEnd: false,
        

        
        undef : function(value) {
            return value !== undefined ? value : "";
        },

        
        defaultValue : function(value, defaultValue) {
            return value !== undefined && value !== '' ? value : defaultValue;
        },

        
        substr : function(value, start, length) {
            return String(value).substr(start, length);
        },

        
        lowercase : function(value) {
            return String(value).toLowerCase();
        },

        
        uppercase : function(value) {
            return String(value).toUpperCase();
        },

        
        usMoney : function(v) {
            return UtilFormat.currency(v, '$', 2);
        },

        
        currency: function(v, currencySign, decimals, end) {
            var negativeSign = '',
                format = ",0",
                i = 0;
            v = v - 0;
            if (v < 0) {
                v = -v;
                negativeSign = '-';
            }
            decimals = Ext.isDefined(decimals) ? decimals : UtilFormat.currencyPrecision;
            format += format + (decimals > 0 ? '.' : '');
            for (; i < decimals; i++) {
                format += '0';
            }
            v = UtilFormat.number(v, format);
            if ((end || UtilFormat.currencyAtEnd) === true) {
                return Ext.String.format("{0}{1}{2}", negativeSign, v, currencySign || UtilFormat.currencySign);
            } else {
                return Ext.String.format("{0}{1}{2}", negativeSign, currencySign || UtilFormat.currencySign, v);
            }
        },

        
        date: function(v, format) {
            if (!v) {
                return "";
            }
            if (!Ext.isDate(v)) {
                v = new Date(Date.parse(v));
            }
            return Ext.Date.dateFormat(v, format || Ext.Date.defaultFormat);
        },

        
        dateRenderer : function(format) {
            return function(v) {
                return UtilFormat.date(v, format);
            };
        },

        
        stripTags : function(v) {
            return !v ? v : String(v).replace(stripTagsRE, "");
        },

        
        stripScripts : function(v) {
            return !v ? v : String(v).replace(stripScriptsRe, "");
        },

        
        fileSize : function(size) {
            if (size < 1024) {
                return size + " bytes";
            } else if (size < 1048576) {
                return (Math.round(((size*10) / 1024))/10) + " KB";
            } else {
                return (Math.round(((size*10) / 1048576))/10) + " MB";
            }
        },

        
        math : function(){
            var fns = {};

            return function(v, a){
                if (!fns[a]) {
                    fns[a] = Ext.functionFactory('v', 'return v ' + a + ';');
                }
                return fns[a](v);
            };
        }(),

        
        round : function(value, precision) {
            var result = Number(value);
            if (typeof precision == 'number') {
                precision = Math.pow(10, precision);
                result = Math.round(value * precision) / precision;
            }
            return result;
        },

        
        number: function(v, formatString) {
            if (!formatString) {
                return v;
            }
            v = Ext.Number.from(v, NaN);
            if (isNaN(v)) {
                return '';
            }
            var comma = UtilFormat.thousandSeparator,
                dec   = UtilFormat.decimalSeparator,
                i18n  = false,
                neg   = v < 0,
                hasComma,
                psplit;

            v = Math.abs(v);

            
            
            
            
            if (formatString.substr(formatString.length - 2) == '/i') {
                if (!I18NFormatCleanRe) {
                    I18NFormatCleanRe = new RegExp('[^\\d\\' + UtilFormat.decimalSeparator + ']','g');
                }
                formatString = formatString.substr(0, formatString.length - 2);
                i18n   = true;
                hasComma = formatString.indexOf(comma) != -1;
                psplit = formatString.replace(I18NFormatCleanRe, '').split(dec);
            } else {
                hasComma = formatString.indexOf(',') != -1;
                psplit = formatString.replace(formatCleanRe, '').split('.');
            }

            if (1 < psplit.length) {
                v = Ext.Number.toFixed(v, psplit[1].length);
            } else if(2 < psplit.length) {
            } else {
                v = Ext.Number.toFixed(v, 0);
            }

            var fnum = v.toString();

            psplit = fnum.split('.');

            if (hasComma) {
                var cnum = psplit[0],
                    parr = [],
                    j    = cnum.length,
                    m    = Math.floor(j / 3),
                    n    = cnum.length % 3 || 3,
                    i;

                for (i = 0; i < j; i += n) {
                    if (i !== 0) {
                        n = 3;
                    }

                    parr[parr.length] = cnum.substr(i, n);
                    m -= 1;
                }
                fnum = parr.join(comma);
                if (psplit[1]) {
                    fnum += dec + psplit[1];
                }
            } else {
                if (psplit[1]) {
                    fnum = psplit[0] + dec + psplit[1];
                }
            }

            if (neg) {
                
                neg = fnum.replace(/[^1-9]/g, '') !== '';
            }

            return (neg ? '-' : '') + formatString.replace(/[\d,?\.?]+/, fnum);
        },

        
        numberRenderer : function(format) {
            return function(v) {
                return UtilFormat.number(v, format);
            };
        },

        
        plural : function(v, s, p) {
            return v +' ' + (v == 1 ? s : (p ? p : s+'s'));
        },

        
        nl2br : function(v) {
            return Ext.isEmpty(v) ? '' : v.replace(nl2brRe, '<br/>');
        },

        
        capitalize: Ext.String.capitalize,

        
        ellipsis: Ext.String.ellipsis,

        
        format: Ext.String.format,

        
        htmlDecode: Ext.String.htmlDecode,

        
        htmlEncode: Ext.String.htmlEncode,

        
        leftPad: Ext.String.leftPad,

        
        trim : Ext.String.trim,

        
        parseBox : function(box) {
            if (Ext.isNumber(box)) {
                box = box.toString();
            }
            var parts  = box.split(' '),
                ln = parts.length;

            if (ln == 1) {
                parts[1] = parts[2] = parts[3] = parts[0];
            }
            else if (ln == 2) {
                parts[2] = parts[0];
                parts[3] = parts[1];
            }
            else if (ln == 3) {
                parts[3] = parts[1];
            }

            return {
                top   :parseInt(parts[0], 10) || 0,
                right :parseInt(parts[1], 10) || 0,
                bottom:parseInt(parts[2], 10) || 0,
                left  :parseInt(parts[3], 10) || 0
            };
        },

        
        escapeRegex : function(s) {
            return s.replace(/([\-.*+?\^${}()|\[\]\/\\])/g, "\\$1");
        }
    });
})();


Ext.ns('Ext.util');

Ext.util.TaskRunner = function(interval) {
    interval = interval || 10;
    var tasks = [],
    removeQueue = [],
    id = 0,
    running = false,

    
    stopThread = function() {
        running = false;
        clearInterval(id);
        id = 0;
    },

    
    startThread = function() {
        if (!running) {
            running = true;
            id = setInterval(runTasks, interval);
        }
    },

    
    removeTask = function(t) {
        removeQueue.push(t);
        if (t.onStop) {
            t.onStop.apply(t.scope || t);
        }
    },

    
    runTasks = function() {
        var rqLen = removeQueue.length,
            now = new Date().getTime(),
            i;

        if (rqLen > 0) {
            for (i = 0; i < rqLen; i++) {
                Ext.Array.remove(tasks, removeQueue[i]);
            }
            removeQueue = [];
            if (tasks.length < 1) {
                stopThread();
                return;
            }
        }
        i = 0;
        var t,
            itime,
            rt,
            len = tasks.length;
        for (; i < len; ++i) {
            t = tasks[i];
            itime = now - t.taskRunTime;
            if (t.interval <= itime) {
                rt = t.run.apply(t.scope || t, t.args || [++t.taskRunCount]);
                t.taskRunTime = now;
                if (rt === false || t.taskRunCount === t.repeat) {
                    removeTask(t);
                    return;
                }
            }
            if (t.duration && t.duration <= (now - t.taskStartTime)) {
                removeTask(t);
            }
        }
    };

    
    this.start = function(task) {
        tasks.push(task);
        task.taskStartTime = new Date().getTime();
        task.taskRunTime = 0;
        task.taskRunCount = 0;
        startThread();
        return task;
    };

    
    this.stop = function(task) {
        removeTask(task);
        return task;
    };

    
    this.stopAll = function() {
        stopThread();
        for (var i = 0, len = tasks.length; i < len; i++) {
            if (tasks[i].onStop) {
                tasks[i].onStop();
            }
        }
        tasks = [];
        removeQueue = [];
    };
};


Ext.TaskManager = new Ext.util.TaskRunner();


Ext.define('Ext.perf.Accumulator', function () {
    var currentFrame = null,
        khrome = Ext.global['chrome'],
        formatTpl,
        
        
        getTimestamp = function () {

            getTimestamp = function () {
                return new Date().getTime();
            }

            
            if (Ext.isChrome && khrome && khrome.Interval) {
                var interval = new khrome.Interval();
                interval.start();
                getTimestamp = function () {
                    return interval.microseconds() / 1000;
                }
            }
            else if (window.ActiveXObject) {
                try {
                    
                    var toolbox = new ActiveXObject('SenchaToolbox.Toolbox');
                    getTimestamp = function () {
                        return toolbox.milliseconds;
                    };
                } catch (e) {
                    
                }
            } else if (Date.now) {
                getTimestamp = Date.now;
            }

            Ext.perf.getTimestamp = Ext.perf.Accumulator.getTimestamp = getTimestamp;
            return getTimestamp();
        };

    function adjustSet (set, time) {
        set.sum += time;
        set.min = Math.min(set.min, time);
        set.max = Math.max(set.max, time);
    }

    function leaveFrame (time) {
        var totalTime = time ? time : (getTimestamp() - this.time), 
            me = this, 
            accum = me.accum;

        ++accum.count;
        if (! --accum.depth) {
            adjustSet(accum.total, totalTime);
        }
        adjustSet(accum.pure, totalTime - me.childTime);

        currentFrame = me.parent;
        if (currentFrame) {
            ++currentFrame.accum.childCount;
            currentFrame.childTime += totalTime;
        }
    }

    function makeSet () {
        return {
            min: Number.MAX_VALUE,
            max: 0,
            sum: 0
        }
    }

    function makeTap (me, fn) {
        return function () {
            var frame = me.enter(),
                ret = fn.apply(this, arguments);

            frame.leave();
            return ret;
        };
    }

    function round (x) {
        return Math.round(x * 100) / 100;
    }

    function setToJSON (count, childCount, calibration, set) {
        var data = {
            avg: 0,
            min: set.min,
            max: set.max,
            sum: 0
        };

        if (count) {
            calibration = calibration || 0;
            data.sum = set.sum - childCount * calibration;
            data.avg = data.sum / count;
            
            
        }

        return data;
    }

    return {
        constructor: function (name) {
            var me = this;

            me.count = me.childCount = me.depth = me.maxDepth = 0;
            me.pure = makeSet();
            me.total = makeSet();
            me.name = name;
        },

        statics: {
            getTimestamp: getTimestamp
        },

        format: function (calibration) {
            if (!formatTpl) {
                formatTpl = new Ext.XTemplate([
                        '{name} - {count} call(s)',
                        '<tpl if="count">',
                            '<tpl if="childCount">',
                                ' ({childCount} children)',
                            '</tpl>',
                            '<tpl if="depth - 1">',
                                ' ({depth} deep)',
                            '</tpl>',
                            '<tpl for="times">',
                                ', {type}: {[this.time(values.sum)]} msec (',
                                     
                                     'avg={[this.time(values.sum / parent.count)]}',
                                     
                                     ')',
                            '</tpl>',
                        '</tpl>'
                    ].join(''), {
                        time: function (t) {
                            return Math.round(t * 100) / 100;
                        }
                    });
            }

            var data = this.getData(calibration);
            data.name = this.name;
            data.pure.type = 'Pure';
            data.total.type = 'Total';
            data.times = [data.pure, data.total];
            return formatTpl.apply(data);
        },

        getData: function (calibration) {
            var me = this;

            return {
                count: me.count,
                childCount: me.childCount,
                depth: me.maxDepth,
                pure: setToJSON(me.count, me.childCount, calibration, me.pure),
                total: setToJSON(me.count, me.childCount, calibration, me.total)
            };
        },

        enter: function () {
            var me = this,
                frame = {
                    accum: me,
                    leave: leaveFrame,
                    childTime: 0,
                    parent: currentFrame
                };

            ++me.depth;
            if (me.maxDepth < me.depth) {
                me.maxDepth = me.depth;
            }

            currentFrame = frame;
            frame.time = getTimestamp(); 
            return frame;
        },

        monitor: function (fn, scope, args) {
            var frame = this.enter();
            if (args) {
                fn.apply(scope, args);
            } else {
                fn.call(scope);
            }
            frame.leave();
        },

        report: function () {
            Ext.log(this.format());
        },

        tap: function (className, methodName) {
            var me = this,
                methods = typeof methodName == 'string' ? [methodName] : methodName,
                klass, statik, i, parts, length, name, src;

            var tapFunc = function(){
                if (typeof className == 'string') {
                    klass = Ext.global;
                    parts = className.split('.');
                    for (i = 0, length = parts.length; i < length; ++i) {
                        klass = klass[parts[i]];
                    }
                } else {
                    klass = className;
                }

                for (i = 0, length = methods.length; i < length; ++i) {
                    name = methods[i];
                    statik = name.charAt(0) == '!';

                    if (statik) {
                        name = name.substring(1);
                    } else {
                        statik = !(name in klass.prototype);
                    }

                    src = statik ? klass : klass.prototype;
                    src[name] = makeTap(me, src[name]);
                }
            };

            Ext.ClassManager.onCreated(tapFunc, me, className);

            return me;
        }
    };
}(),

function () {
    Ext.perf.getTimestamp = this.getTimestamp;
});


Ext.define('Ext.perf.Monitor', {
    singleton: true,
    alternateClassName: 'Ext.Perf',

    requires: [
        'Ext.perf.Accumulator'
    ],

    constructor: function () {
        this.accumulators = [];
        this.accumulatorsByName = {};
    },

    calibrate: function () {
        var accum = new Ext.perf.Accumulator('$'),
            total = accum.total,
            getTimestamp = Ext.perf.Accumulator.getTimestamp,
            count = 0,
            frame,
            endTime,
            startTime;

        startTime = getTimestamp();

        do {
            frame = accum.enter();
            frame.leave();
            ++count;
        } while (total.sum < 100);

        endTime = getTimestamp();

        return (endTime - startTime) / count;
    },

    get: function (name) {
        var me = this,
            accum = me.accumulatorsByName[name];

        if (!accum) {
            me.accumulatorsByName[name] = accum = new Ext.perf.Accumulator(name);
            me.accumulators.push(accum);
        }

        return accum;
    },

    enter: function (name) {
        return this.get(name).enter();
    },

    monitor: function (name, fn, scope) {
        this.get(name).monitor(fn, scope);
    },

    report: function () {
        var me = this,
            accumulators = me.accumulators,
            calibration = me.calibrate(),
            report = ['Calibration: ' + Math.round(calibration * 100) / 100 + ' msec/sample'];

        accumulators.sort(function (a, b) {
            return (a.name < b.name) ? -1 : ((b.name < a.name) ? 1 : 0);
        });

        Ext.each(accumulators, function (accum) {
            report.push(accum.format(calibration));
        });
        Ext.log(report.join('\n'));
    },

    getData: function (all) {
        var ret = {},
            accumulators = this.accumulators;

        Ext.each(accumulators, function (accum) {
            if (all || accum.count) {
                ret[accum.name] = accum.getData();
            }
        });

        return ret;
    },

    setup: function (config) {
        if (!config) {
            config = {
                
                






                render: {
                    'Ext.AbstractComponent': 'render'
                },

































                layout: {
                    'Ext.layout.Context': 'run'
                }
            };
        }

        this.currentConfig = config;

        Ext.Object.each(config, function (accumName, taps) {
            var accum = Ext.Perf.get(accumName);

            Ext.Object.each(taps, function (className, methods) {
                accum.tap(className, methods);
            });
        });
    }
});


Ext.is = {
    init : function(navigator) {
        var platforms = this.platforms,
            ln = platforms.length,
            i, platform;

        navigator = navigator || window.navigator;

        for (i = 0; i < ln; i++) {
            platform = platforms[i];
            this[platform.identity] = platform.regex.test(navigator[platform.property]);
        }

        
        this.Desktop = this.Mac || this.Windows || (this.Linux && !this.Android);
        
        this.Tablet = this.iPad;
        
        this.Phone = !this.Desktop && !this.Tablet;
        
        this.iOS = this.iPhone || this.iPad || this.iPod;
        
        
        this.Standalone = !!window.navigator.standalone;
    },
    
    
    platforms: [{
        property: 'platform',
        regex: /iPhone/i,
        identity: 'iPhone'
    },
    
    
    {
        property: 'platform',
        regex: /iPod/i,
        identity: 'iPod'
    },
    
    
    {
        property: 'userAgent',
        regex: /iPad/i,
        identity: 'iPad'
    },
    
    
    {
        property: 'userAgent',
        regex: /Blackberry/i,
        identity: 'Blackberry'
    },
    
    
    {
        property: 'userAgent',
        regex: /Android/i,
        identity: 'Android'
    },
    
    
    {
        property: 'platform',
        regex: /Mac/i,
        identity: 'Mac'
    },
    
    
    {
        property: 'platform',
        regex: /Win/i,
        identity: 'Windows'
    },
    
    
    {
        property: 'platform',
        regex: /Linux/i,
        identity: 'Linux'
    }]
};

Ext.is.init();


Ext.supports = {
    
    init : function() {
        var me = this,
            doc = document,
            tests = me.tests,
            n = tests.length,
            div = n && Ext.isReady && doc.createElement('div'),
            test, notRun = [];

        if (div) {
            div.innerHTML = [
                '<div style="height:30px;width:50px;">',
                    '<div style="height:20px;width:20px;"></div>',
                '</div>',
                '<div style="width: 200px; height: 200px; position: relative; padding: 5px;">',
                    '<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></div>',
                '</div>',
                '<div style="position: absolute; left: 10%; top: 10%;"></div>',
                '<div style="float:left; background-color:transparent;"></div>'
            ].join('');

            doc.body.appendChild(div);
        }

        while (n--) {
            test = tests[n];
            if (div || test.early) {
                me[test.identity] = test.fn.call(me, doc, div);
            } else {
                notRun.push(test);
            }
        }

        if (div) {
            doc.body.removeChild(div);
        }

        me.tests = notRun;
    },

    
    PointerEvents: 'pointerEvents' in document.documentElement.style,

    
    CSS3BoxShadow: 'boxShadow' in document.documentElement.style,

    
    ClassList: !!document.documentElement.classList,

    
    OrientationChange: ((typeof window.orientation != 'undefined') && ('onorientationchange' in window)),
    
    
    DeviceMotion: ('ondevicemotion' in window),
    
    
    
    
    Touch: ('ontouchstart' in window) && (!Ext.is.Desktop),

    tests: [
        
        {
            identity: 'Transitions',
            fn: function(doc, div) {
                var prefix = [
                        'webkit',
                        'Moz',
                        'o',
                        'ms',
                        'khtml'
                    ],
                    TE = 'TransitionEnd',
                    transitionEndName = [
                        prefix[0] + TE,
                        'transitionend', 
                        prefix[2] + TE,
                        prefix[3] + TE,
                        prefix[4] + TE
                    ],
                    ln = prefix.length,
                    i = 0,
                    out = false;
                div = Ext.get(div);
                for (; i < ln; i++) {
                    if (div.getStyle(prefix[i] + "TransitionProperty")) {
                        Ext.supports.CSS3Prefix = prefix[i];
                        Ext.supports.CSS3TransitionEnd = transitionEndName[i];
                        out = true;
                        break;
                    }
                }
                return out;
            }
        },
        
        
        {
            identity: 'RightMargin',
            fn: function(doc, div) {
                var view = doc.defaultView;
                return !(view && view.getComputedStyle(div.firstChild.firstChild, null).marginRight != '0px');
            }
        },

        
        {
            identity: 'DisplayChangeInputSelectionBug',
            early: true,
            fn: function() {
                var webKitVersion = Ext.webKitVersion;
                
                return 0 < webKitVersion && webKitVersion < 533;
            }
        },

        
        {
            identity: 'DisplayChangeTextAreaSelectionBug',
            early: true,
            fn: function() {
                var webKitVersion = Ext.webKitVersion;

                
                return 0 < webKitVersion && webKitVersion < 534.24;
            }
        },

        
        {
            identity: 'TransparentColor',
            fn: function(doc, div, view) {
                view = doc.defaultView;
                return !(view && view.getComputedStyle(div.lastChild, null).backgroundColor != 'transparent');
            }
        },

        
        {
            identity: 'ComputedStyle',
            fn: function(doc, div, view) {
                view = doc.defaultView;
                return view && view.getComputedStyle;
            }
        },
        
        
        {
            identity: 'Svg',
            fn: function(doc) {
                return !!doc.createElementNS && !!doc.createElementNS( "http:/" + "/www.w3.org/2000/svg", "svg").createSVGRect;
            }
        },
    
        
        {
            identity: 'Canvas',
            fn: function(doc) {
                return !!doc.createElement('canvas').getContext;
            }
        },
        
        
        {
            identity: 'Vml',
            fn: function(doc) {
                var d = doc.createElement("div");
                d.innerHTML = "<!--[if vml]><br><br><![endif]-->";
                return (d.childNodes.length == 2);
            }
        },
        
        
        {
            identity: 'Float',
            fn: function(doc, div) {
                return !!div.lastChild.style.cssFloat;
            }
        },
        
        
        {
            identity: 'AudioTag',
            fn: function(doc) {
                return !!doc.createElement('audio').canPlayType;
            }
        },
        
        
        {
            identity: 'History',
            fn: function() {
                var history = window.history;
                return !!(history && history.pushState);
            }
        },
        
        
        {
            identity: 'CSS3DTransform',
            fn: function() {
                return (typeof WebKitCSSMatrix != 'undefined' && new WebKitCSSMatrix().hasOwnProperty('m41'));
            }
        },

		
        {
            identity: 'CSS3LinearGradient',
            fn: function(doc, div) {
                var property = 'background-image:',
                    webkit   = '-webkit-gradient(linear, left top, right bottom, from(black), to(white))',
                    w3c      = 'linear-gradient(left top, black, white)',
                    moz      = '-moz-' + w3c,
                    options  = [property + webkit, property + w3c, property + moz];
                
                div.style.cssText = options.join(';');
                
                return ("" + div.style.backgroundImage).indexOf('gradient') !== -1;
            }
        },
        
        
        {
            identity: 'CSS3BorderRadius',
            fn: function(doc, div) {
                var domPrefixes = ['borderRadius', 'BorderRadius', 'MozBorderRadius', 'WebkitBorderRadius', 'OBorderRadius', 'KhtmlBorderRadius'],
                    pass = false,
                    i;
                for (i = 0; i < domPrefixes.length; i++) {
                    if (document.body.style[domPrefixes[i]] !== undefined) {
                        return true;
                    }
                }
                return pass;
            }
        },
        
        
        {
            identity: 'GeoLocation',
            fn: function() {
                return (typeof navigator != 'undefined' && typeof navigator.geolocation != 'undefined') || (typeof google != 'undefined' && typeof google.gears != 'undefined');
            }
        },
        
        {
            identity: 'MouseEnterLeave',
            fn: function(doc, div){
                return ('onmouseenter' in div && 'onmouseleave' in div);
            }
        },
        
        {
            identity: 'MouseWheel',
            fn: function(doc, div) {
                return ('onmousewheel' in div);
            }
        },
        
        {
            identity: 'Opacity',
            fn: function(doc, div){
                
                if (Ext.isIE6 || Ext.isIE7 || Ext.isIE8) {
                    return false;
                }
                div.firstChild.style.cssText = 'opacity:0.73';
                return div.firstChild.style.opacity == '0.73';
            }
        },
        
        {
            identity: 'Placeholder',
            fn: function(doc) {
                return 'placeholder' in doc.createElement('input');
            }
        },
        
        
        {
            identity: 'Direct2DBug',
            fn: function() {
                return Ext.isString(document.body.style.msTransformOrigin);
            }
        },
        
        {
            identity: 'BoundingClientRect',
            fn: function(doc, div) {
                return Ext.isFunction(div.getBoundingClientRect);
            }
        },
        {
            identity: 'IncludePaddingInWidthCalculation',
            fn: function(doc, div){
                var el = Ext.get(div.childNodes[1].firstChild);
                return el.getWidth() == 210;
            }
        },
        {
            identity: 'IncludePaddingInHeightCalculation',
            fn: function(doc, div){
                var el = Ext.get(div.childNodes[1].firstChild);
                return el.getHeight() == 210;
            }
        },
        
        
        {
            identity: 'ArraySort',
            fn: function() {
                var a = [1,2,3,4,5].sort(function(){ return 0; });
                return a[0] === 1 && a[1] === 2 && a[2] === 3 && a[3] === 4 && a[4] === 5;
            }
        },
        
        {
            identity: 'Range',
            fn: function() {
                return !!document.createRange;
            }
        },
        
        {
            identity: 'CreateContextualFragment',
            fn: function() {
                var range = Ext.supports.Range ? document.createRange() : false;
                
                return range && !!range.createContextualFragment;
            }
        },

        
        {
            identity: 'WindowOnError',
            fn: function () {
                
                return Ext.isIE || Ext.isGecko || Ext.webKitVersion >= 534.16; 
            }
        },
        
        
        {
            identity: 'TextAreaMaxLength',
            fn: function(){
                var el = document.createElement('textarea');
                return ('maxlength' in el);
            }
        },
        
        
        {
            identity: 'GetPositionPercentage',
            fn: function(doc, div){
                return Ext.get(div.childNodes[2]).getStyle('left') == '10%';
            }
        }
    ]
};

Ext.supports.init(); 



Ext.util.DelayedTask = function(fn, scope, args) {
    var me = this,
        id,
        call = function() {
            clearInterval(id);
            id = null;
            fn.apply(scope, args || []);
        };

    
    this.delay = function(delay, newFn, newScope, newArgs) {
        me.cancel();
        fn = newFn || fn;
        scope = newScope || scope;
        args = newArgs || args;
        id = setInterval(call, delay);
    };

    
    this.cancel = function(){
        if (id) {
            clearInterval(id);
            id = null;
        }
    };
};
Ext.require('Ext.util.DelayedTask', function() {

    
    Ext.util.Event = Ext.extend(Object, (function() {
        function createBuffered(handler, listener, o, scope) {
            listener.task = new Ext.util.DelayedTask();
            return function() {
                listener.task.delay(o.buffer, handler, scope, Ext.Array.toArray(arguments));
            };
        }

        function createDelayed(handler, listener, o, scope) {
            return function() {
                var task = new Ext.util.DelayedTask();
                if (!listener.tasks) {
                    listener.tasks = [];
                }
                listener.tasks.push(task);
                task.delay(o.delay || 10, handler, scope, Ext.Array.toArray(arguments));
            };
        }

        function createSingle(handler, listener, o, scope) {
            return function() {
                listener.ev.removeListener(listener.fn, scope);
                return handler.apply(scope, arguments);
            };
        }

        return {
            
            isEvent: true,

            constructor: function(observable, name) {
                this.name = name;
                this.observable = observable;
                this.listeners = [];
            },

            addListener: function(fn, scope, options) {
                var me = this,
                    listener;
                    scope = scope || me.observable;


                if (!me.isListening(fn, scope)) {
                    listener = me.createListener(fn, scope, options);
                    if (me.firing) {
                        
                        me.listeners = me.listeners.slice(0);
                    }
                    me.listeners.push(listener);
                }
            },

            createListener: function(fn, scope, o) {
                o = o || {};
                scope = scope || this.observable;

                var listener = {
                        fn: fn,
                        scope: scope,
                        o: o,
                        ev: this
                    },
                    handler = fn;

                
                
                if (o.single) {
                    handler = createSingle(handler, listener, o, scope);
                }
                if (o.delay) {
                    handler = createDelayed(handler, listener, o, scope);
                }
                if (o.buffer) {
                    handler = createBuffered(handler, listener, o, scope);
                }

                listener.fireFn = handler;
                return listener;
            },

            findListener: function(fn, scope) {
                var listeners = this.listeners,
                i = listeners.length,
                listener,
                s;

                while (i--) {
                    listener = listeners[i];
                    if (listener) {
                        s = listener.scope;
                        if (listener.fn == fn && (s == scope || s == this.observable)) {
                            return i;
                        }
                    }
                }

                return - 1;
            },

            isListening: function(fn, scope) {
                return this.findListener(fn, scope) !== -1;
            },

            removeListener: function(fn, scope) {
                var me = this,
                    index,
                    listener,
                    k;
                index = me.findListener(fn, scope);
                if (index != -1) {
                    listener = me.listeners[index];

                    if (me.firing) {
                        me.listeners = me.listeners.slice(0);
                    }

                    
                    if (listener.task) {
                        listener.task.cancel();
                        delete listener.task;
                    }

                    
                    k = listener.tasks && listener.tasks.length;
                    if (k) {
                        while (k--) {
                            listener.tasks[k].cancel();
                        }
                        delete listener.tasks;
                    }

                    
                    Ext.Array.erase(me.listeners, index, 1);
                    return true;
                }

                return false;
            },

            
            clearListeners: function() {
                var listeners = this.listeners,
                    i = listeners.length;

                while (i--) {
                    this.removeListener(listeners[i].fn, listeners[i].scope);
                }
            },

            fire: function() {
                var me = this,
                    listeners = me.listeners,
                    count = listeners.length,
                    i,
                    args,
                    listener;

                if (count > 0) {
                    me.firing = true;
                    for (i = 0; i < count; i++) {
                        listener = listeners[i];
                        args = arguments.length ? Array.prototype.slice.call(arguments, 0) : [];
                        if (listener.o) {
                            args.push(listener.o);
                        }
                        if (listener && listener.fireFn.apply(listener.scope || me.observable, args) === false) {
                            return (me.firing = false);
                        }
                    }
                }
                me.firing = false;
                return true;
            }
        };
    })());
});


Ext.EventManager = {

    

    
    hasBoundOnReady: false,

    
    hasFiredReady: false,

    
    readyTimeout: null,

    
    hasOnReadyStateChange: false,

    
    readyEvent:
        (function () {
            var event = new Ext.util.Event();
            event.fire = function () {
                  if (!/[?&]ext-pauseReadyFire\b/i.test(location.search) || Ext._continueFireReady) {
                      Ext._beforeReadyTime = new Date().getTime();
                      event.self.prototype.fire.apply(event, arguments);
                      Ext._afterReadytime = new Date().getTime();
                  }
                
            }
            return event;
        })(),

    
    checkReadyState: function(){
        var me = Ext.EventManager;

        if(window.attachEvent){
            
            
            if (window != top) {
                return false;
            }
            try{
                document.documentElement.doScroll('left');
            }catch(e){
                return false;
            }
            me.fireDocReady();
            return true;
        }
        if (document.readyState == 'complete') {
            me.fireDocReady();
            return true;
        }
        me.readyTimeout = setTimeout(arguments.callee, 2);
        return false;
    },

    
    bindReadyEvent: function(){
        var me = Ext.EventManager;
        if (me.hasBoundOnReady) {
            return;
        }

        if (document.addEventListener) {
            document.addEventListener('DOMContentLoaded', me.fireDocReady, false);
            
            window.addEventListener('load', me.fireDocReady, false);
        } else {
            
            if (!me.checkReadyState()) {
                document.attachEvent('onreadystatechange', me.checkReadyState);
                me.hasOnReadyStateChange = true;
            }
            
            window.attachEvent('onload', me.fireDocReady, false);
        }
        me.hasBoundOnReady = true;
    },

    
    fireDocReady: function(){
        var me = Ext.EventManager;

        
        if (!Ext.isReady) {
            Ext._readyTime = new Date().getTime();
            Ext.isReady = true;

            if (document.addEventListener) {
                document.removeEventListener('DOMContentLoaded', me.fireDocReady, false);
                window.removeEventListener('load', me.fireDocReady, false);
            } else {
                if (me.readyTimeout !== null) {
                    clearTimeout(me.readyTimeout);
                }
                if (me.hasOnReadyStateChange) {
                    document.detachEvent('onreadystatechange', me.checkReadyState);
                }
                window.detachEvent('onload', me.fireDocReady);
            }

            Ext.supports.init();
            me.onWindowUnload();
            me.readyEvent.fire();
        }
    },

    
    onDocumentReady: function(fn, scope, options){
        options = options || {};
        var me = Ext.EventManager,
            readyEvent = me.readyEvent;

        
        options.single = true;
        readyEvent.addListener(fn, scope, options);

        
        if (Ext.isReady) {
            readyEvent.fire();
        } else if (document.readyState == 'complete') {
            
            
            
            me.fireDocReady();
        } else {
            me.bindReadyEvent();
        }
    },


    

    
    stoppedMouseDownEvent: new Ext.util.Event(),

    
    propRe: /^(?:scope|delay|buffer|single|stopEvent|preventDefault|stopPropagation|normalized|args|delegate|freezeEvent)$/,

    
    getId : function(element) {
        var skipGarbageCollection = false,
            id;

        element = Ext.getDom(element);

        if (element === document || element === window) {
            id = element === document ? Ext.documentId : Ext.windowId;
        }
        else {
            id = Ext.id(element);
        }
        
        if (element && (element.getElementById || element.navigator)) {
            skipGarbageCollection = true;
        }

        if (!Ext.cache[id]){
            Ext.Element.addToCache(new Ext.Element(element), id);
            if (skipGarbageCollection) {
                Ext.cache[id].skipGarbageCollection = true;
            }
        }
        return id;
    },

    
    prepareListenerConfig: function(element, config, isRemove){
        var me = this,
            propRe = me.propRe,
            key, value, args;

        
        for (key in config) {
            if (config.hasOwnProperty(key)) {
                
                if (!propRe.test(key)) {
                    value = config[key];
                    
                    
                    if (typeof value == 'function') {
                        
                        args = [element, key, value, config.scope, config];
                    } else {
                        
                        args = [element, key, value.fn, value.scope, value];
                    }

                    if (isRemove) {
                        me.removeListener.apply(me, args);
                    } else {
                        me.addListener.apply(me, args);
                    }
                }
            }
        }
    },

    mouseEnterLeaveRe: /mouseenter|mouseleave/,

    
    normalizeEvent: function(eventName, fn){
        if (this.mouseEnterLeaveRe.test(eventName) && !Ext.supports.MouseEnterLeave) {
            if (fn) {
                fn = Ext.Function.createInterceptor(fn, this.contains, this);
            }
            eventName = eventName == 'mouseenter' ? 'mouseover' : 'mouseout';
        } else if (eventName == 'mousewheel' && !Ext.supports.MouseWheel && !Ext.isOpera){
            eventName = 'DOMMouseScroll';
        }
        return {
            eventName: eventName,
            fn: fn
        };
    },

    
    contains: function(event){
        var parent = event.browserEvent.currentTarget,
            child = this.getRelatedTarget(event);

        if (parent && parent.firstChild) {
            while (child) {
                if (child === parent) {
                    return false;
                }
                child = child.parentNode;
                if (child && (child.nodeType != 1)) {
                    child = null;
                }
            }
        }
        return true;
    },

    
    addListener: function(element, eventName, fn, scope, options){
        
        if (typeof eventName !== 'string') {
            this.prepareListenerConfig(element, eventName);
            return;
        }

        var dom = element.dom || Ext.getDom(element),
            bind, wrap;


        
        options = options || {};

        bind = this.normalizeEvent(eventName, fn);
        wrap = this.createListenerWrap(dom, eventName, bind.fn, scope, options);

        if (dom.attachEvent) {
            dom.attachEvent('on' + bind.eventName, wrap);
        } else {
            dom.addEventListener(bind.eventName, wrap, options.capture || false);
        }

        if (dom == document && eventName == 'mousedown') {
            this.stoppedMouseDownEvent.addListener(wrap);
        }

        
        this.getEventListenerCache(element.dom ? element : dom, eventName).push({
            fn: fn,
            wrap: wrap,
            scope: scope
        });
    },

    
    removeListener : function(element, eventName, fn, scope) {
        
        if (typeof eventName !== 'string') {
            this.prepareListenerConfig(element, eventName, true);
            return;
        }

        var dom = Ext.getDom(element),
            el = element.dom ? element : Ext.get(dom),
            cache = this.getEventListenerCache(el, eventName),
            bindName = this.normalizeEvent(eventName).eventName,
            i = cache.length, j,
            listener, wrap, tasks;


        while (i--) {
            listener = cache[i];

            if (listener && (!fn || listener.fn == fn) && (!scope || listener.scope === scope)) {
                wrap = listener.wrap;

                
                if (wrap.task) {
                    clearTimeout(wrap.task);
                    delete wrap.task;
                }

                
                j = wrap.tasks && wrap.tasks.length;
                if (j) {
                    while (j--) {
                        clearTimeout(wrap.tasks[j]);
                    }
                    delete wrap.tasks;
                }

                if (dom.detachEvent) {
                    dom.detachEvent('on' + bindName, wrap);
                } else {
                    dom.removeEventListener(bindName, wrap, false);
                }

                if (wrap && dom == document && eventName == 'mousedown') {
                    this.stoppedMouseDownEvent.removeListener(wrap);
                }

                
                Ext.Array.erase(cache, i, 1);
            }
        }
    },

    
    removeAll : function(element){
        var el = element.dom ? element : Ext.get(element),
            cache, events, eventName;

        if (!el) {
            return;
        }
        cache = (el.$cache || el.getCache());
        events = cache.events;

        for (eventName in events) {
            if (events.hasOwnProperty(eventName)) {
                this.removeListener(el, eventName);
            }
        }
        cache.events = {};
    },

    
    purgeElement : function(element, eventName) {
        var dom = Ext.getDom(element),
            i = 0, len;

        if(eventName) {
            this.removeListener(element, eventName);
        }
        else {
            this.removeAll(element);
        }

        if(dom && dom.childNodes) {
            for(len = element.childNodes.length; i < len; i++) {
                this.purgeElement(element.childNodes[i], eventName);
            }
        }
    },

    
    createListenerWrap : function(dom, ename, fn, scope, options) {
        options = options || {};

        var f, gen;

        return function wrap(e, args) {
            
            if (!gen) {
                f = ['if(!' + Ext.name + ') {return;}'];

                if(options.buffer || options.delay || options.freezeEvent) {
                    f.push('e = new ' + Ext.name + '.EventObjectImpl(e, ' + (options.freezeEvent ? 'true' : 'false' ) + ');');
                } else {
                    f.push('e = ' + Ext.name + '.EventObject.setEvent(e);');
                }

                if (options.delegate) {
                    f.push('var t = e.getTarget("' + options.delegate + '", this);');
                    f.push('if(!t) {return;}');
                } else {
                    f.push('var t = e.target;');
                }

                if (options.target) {
                    f.push('if(e.target !== options.target) {return;}');
                }

                if(options.stopEvent) {
                    f.push('e.stopEvent();');
                } else {
                    if(options.preventDefault) {
                        f.push('e.preventDefault();');
                    }
                    if(options.stopPropagation) {
                        f.push('e.stopPropagation();');
                    }
                }

                if(options.normalized === false) {
                    f.push('e = e.browserEvent;');
                }

                if(options.buffer) {
                    f.push('(wrap.task && clearTimeout(wrap.task));');
                    f.push('wrap.task = setTimeout(function(){');
                }

                if(options.delay) {
                    f.push('wrap.tasks = wrap.tasks || [];');
                    f.push('wrap.tasks.push(setTimeout(function(){');
                }

                
                f.push('fn.call(scope || dom, e, t, options);');

                if(options.single) {
                    f.push('Ext.EventManager.removeListener(dom, ename, fn, scope);');
                }

                if(options.delay) {
                    f.push('}, ' + options.delay + '));');
                }

                if(options.buffer) {
                    f.push('}, ' + options.buffer + ');');
                }

                gen = Ext.cacheableFunctionFactory('e', 'options', 'fn', 'scope', 'ename', 'dom', 'wrap', 'args', f.join('\n'));
            }

            gen.call(dom, e, options, fn, scope, ename, dom, wrap, args);
        };
    },

    
    getEventListenerCache : function(element, eventName) {
        var elementCache, eventCache, id;
        if (!element) {
            return [];
        }

        if (element.$cache) {
            elementCache = element.$cache;
        } else {
            elementCache = Ext.cache[id = this.getId(element)] || (Ext.cache[id] = {});
        }
        eventCache = elementCache.events || (elementCache.events = {});
        
        return eventCache[eventName] || (eventCache[eventName] = []);
    },

    
    mouseLeaveRe: /(mouseout|mouseleave)/,
    mouseEnterRe: /(mouseover|mouseenter)/,

    
    stopEvent: function(event) {
        this.stopPropagation(event);
        this.preventDefault(event);
    },

    
    stopPropagation: function(event) {
        event = event.browserEvent || event;
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    },

    
    preventDefault: function(event) {
        event = event.browserEvent || event;
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
            
            try {
              
              if (event.ctrlKey || event.keyCode > 111 && event.keyCode < 124) {
                  event.keyCode = -1;
              }
            } catch (e) {
                
            }
        }
    },

    
    getRelatedTarget: function(event) {
        event = event.browserEvent || event;
        var target = event.relatedTarget;
        if (!target) {
            if (this.mouseLeaveRe.test(event.type)) {
                target = event.toElement;
            } else if (this.mouseEnterRe.test(event.type)) {
                target = event.fromElement;
            }
        }
        return this.resolveTextNode(target);
    },

    
    getPageX: function(event) {
        return this.getXY(event)[0];
    },

    
    getPageY: function(event) {
        return this.getXY(event)[1];
    },

    
    getPageXY: function(event) {
        event = event.browserEvent || event;
        var x = event.pageX,
            y = event.pageY,
            doc = document.documentElement,
            body = document.body;

        
        if (!x && x !== 0) {
            x = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
            y = event.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0);
        }
        return [x, y];
    },

    
    getTarget: function(event) {
        event = event.browserEvent || event;
        return this.resolveTextNode(event.target || event.srcElement);
    },

    
    
    resolveTextNode: Ext.isGecko ?
        function(node) {
            if (!node) {
                return;
            }
            
            var s = HTMLElement.prototype.toString.call(node);
            if (s == '[xpconnect wrapped native prototype]' || s == '[object XULElement]') {
                return;
            }
                return node.nodeType == 3 ? node.parentNode: node;
            }: function(node) {
                return node && node.nodeType == 3 ? node.parentNode: node;
            },

    

    
    curWidth: 0,
    curHeight: 0,

    
    onWindowResize: function(fn, scope, options){
        var me = this,
            resize = me.resizeEvent;
            
        if(!resize){
            me.resizeEvent = resize = new Ext.util.Event();
            me.on(window, 'resize', me.fireResize, me, {buffer: 100});
        }
        resize.addListener(fn, scope, options);
    },

    
    fireResize: function(){
        var me = this,
            w = Ext.Element.getViewWidth(),
            h = Ext.Element.getViewHeight();

         
         if(me.curHeight != h || me.curWidth != w){
             me.curHeight = h;
             me.curWidth = w;
             me.resizeEvent.fire(w, h);
         }
    },

    
    removeResizeListener: function(fn, scope){
        var resize = this.resizeEvent;
        if (resize) {
            resize.removeListener(fn, scope);
        }
    },

    
    onWindowUnload: function(fn, scope, options) {
        var me = this,
            unload = me.unloadEvent;
            
        if (!unload) {
            me.unloadEvent = unload = new Ext.util.Event();
            me.addListener(window, 'unload', me.fireUnload, me);
        }
        if (fn) {
            unload.addListener(fn, scope, options);
        }
    },

    
    fireUnload: function() {
        
        try {
            this.unloadEvent.fire();
            
            if (Ext.isGecko3) {
                var gridviews = Ext.ComponentQuery.query('gridview'),
                    i = 0,
                    ln = gridviews.length;
                for (; i < ln; i++) {
                    gridviews[i].scrollToTop();
                }
            }
            
            var el,
                cache = Ext.cache;
                
            for (el in cache) {
                if (cache.hasOwnProperty(el)) {
                    Ext.EventManager.removeAll(el);
                }
            }
        } catch(e) {
        }
    },

    
    removeUnloadListener: function(fn, scope){
        var unload = this.unloadEvent;
        if (unload) {
            unload.removeListener(fn, scope);
        }
    },

    
    useKeyDown: Ext.isWebKit ?
                   parseInt(navigator.userAgent.match(/AppleWebKit\/(\d+)/)[1], 10) >= 525 :
                   !((Ext.isGecko && !Ext.isWindows) || Ext.isOpera),

    
    getKeyEvent: function(){
        return this.useKeyDown ? 'keydown' : 'keypress';
    }
};


Ext.onReady = function(fn, scope, options) {
    Ext.Loader.onReady(fn, scope, true, options);
};


Ext.onDocumentReady = Ext.EventManager.onDocumentReady;


Ext.EventManager.on = Ext.EventManager.addListener;


Ext.EventManager.un = Ext.EventManager.removeListener;

(function(){
    var initExtCss = function() {
        
        var bd = document.body || document.getElementsByTagName('body')[0],
            baseCSSPrefix = Ext.baseCSSPrefix,
            cls = [baseCSSPrefix + 'body'],
            htmlCls = [],
            html;

        if (!bd) {
            return false;
        }

        html = bd.parentNode;

        function add (c) {
            cls.push(baseCSSPrefix + c);
        }

        
        if (Ext.isIE) {
            add('ie');

            
            
            
            
            
            
            
            
            
            
            
            if (Ext.isIE6) {
                add('ie6');
            } else { 
                add('ie7p');

                if (Ext.isIE7) {
                    add('ie7');
                } else {
                    add('ie8p');

                    if (Ext.isIE8) {
                        add('ie8');
                    } else {
                        add('ie9p');

                        if (Ext.isIE9) {
                            add('ie9');
                        }
                    }
                }
            }

            if (Ext.isIE6 || Ext.isIE7) {
                add('ie7m');
            }
            if (Ext.isIE6 || Ext.isIE7 || Ext.isIE8) {
                add('ie8m');
            }
            if (Ext.isIE7 || Ext.isIE8) {
                add('ie78');
            }
        }
        if (Ext.isGecko) {
            add('gecko');
            if (Ext.isGecko3) {
                add('gecko3');
            }
            if (Ext.isGecko4) {
                add('gecko4');
            }
            if (Ext.isGecko5) {
                add('gecko5');
            }
        }
        if (Ext.isOpera) {
            add('opera');
        }
        if (Ext.isWebKit) {
            add('webkit');
        }
        if (Ext.isSafari) {
            add('safari');
            if (Ext.isSafari2) {
                add('safari2');
            }
            if (Ext.isSafari3) {
                add('safari3');
            }
            if (Ext.isSafari4) {
                add('safari4');
            }
            if (Ext.isSafari5) {
                add('safari5');
            }
        }
        if (Ext.isChrome) {
            add('chrome');
        }
        if (Ext.isMac) {
            add('mac');
        }
        if (Ext.isLinux) {
            add('linux');
        }
        if (!Ext.supports.CSS3BorderRadius) {
            add('nbr');
        }
        if (!Ext.supports.CSS3LinearGradient) {
            add('nlg');
        }
        if (!Ext.scopeResetCSS) {
            add('reset');
        }

        
        if (html) {
            if (Ext.isStrict && (Ext.isIE6 || Ext.isIE7)) {
                Ext.isBorderBox = false;
            }
            else {
                Ext.isBorderBox = true;
            }

            if(Ext.isBorderBox) {
                htmlCls.push(baseCSSPrefix + 'border-box');
            }
            if (Ext.isStrict) {
                htmlCls.push(baseCSSPrefix + 'strict');
            } else {
                htmlCls.push(baseCSSPrefix + 'quirks');
            }
            Ext.fly(html, '_internal').addCls(htmlCls);
        }

        Ext.fly(bd, '_internal').addCls(cls);
        return true;
    };

    Ext.onReady(initExtCss);
})();


Ext.define('Ext.EventObjectImpl', {
    uses: ['Ext.util.Point'],

    
    BACKSPACE: 8,
    
    TAB: 9,
    
    NUM_CENTER: 12,
    
    ENTER: 13,
    
    RETURN: 13,
    
    SHIFT: 16,
    
    CTRL: 17,
    
    ALT: 18,
    
    PAUSE: 19,
    
    CAPS_LOCK: 20,
    
    ESC: 27,
    
    SPACE: 32,
    
    PAGE_UP: 33,
    
    PAGE_DOWN: 34,
    
    END: 35,
    
    HOME: 36,
    
    LEFT: 37,
    
    UP: 38,
    
    RIGHT: 39,
    
    DOWN: 40,
    
    PRINT_SCREEN: 44,
    
    INSERT: 45,
    
    DELETE: 46,
    
    ZERO: 48,
    
    ONE: 49,
    
    TWO: 50,
    
    THREE: 51,
    
    FOUR: 52,
    
    FIVE: 53,
    
    SIX: 54,
    
    SEVEN: 55,
    
    EIGHT: 56,
    
    NINE: 57,
    
    A: 65,
    
    B: 66,
    
    C: 67,
    
    D: 68,
    
    E: 69,
    
    F: 70,
    
    G: 71,
    
    H: 72,
    
    I: 73,
    
    J: 74,
    
    K: 75,
    
    L: 76,
    
    M: 77,
    
    N: 78,
    
    O: 79,
    
    P: 80,
    
    Q: 81,
    
    R: 82,
    
    S: 83,
    
    T: 84,
    
    U: 85,
    
    V: 86,
    
    W: 87,
    
    X: 88,
    
    Y: 89,
    
    Z: 90,
    
    CONTEXT_MENU: 93,
    
    NUM_ZERO: 96,
    
    NUM_ONE: 97,
    
    NUM_TWO: 98,
    
    NUM_THREE: 99,
    
    NUM_FOUR: 100,
    
    NUM_FIVE: 101,
    
    NUM_SIX: 102,
    
    NUM_SEVEN: 103,
    
    NUM_EIGHT: 104,
    
    NUM_NINE: 105,
    
    NUM_MULTIPLY: 106,
    
    NUM_PLUS: 107,
    
    NUM_MINUS: 109,
    
    NUM_PERIOD: 110,
    
    NUM_DIVISION: 111,
    
    F1: 112,
    
    F2: 113,
    
    F3: 114,
    
    F4: 115,
    
    F5: 116,
    
    F6: 117,
    
    F7: 118,
    
    F8: 119,
    
    F9: 120,
    
    F10: 121,
    
    F11: 122,
    
    F12: 123,
    
    WHEEL_SCALE: (function () {
        var scale;

        if (Ext.isGecko) {
            
            scale = 3;
        } else if (Ext.isMac) {
            
            
            

            if (Ext.isSafari && Ext.webKitVersion >= 532.0) {
                
                
                
                
                
                
                scale = 120;
            } else {
                
                
                scale = 12;
            }

            
            
            
            
            scale *= 3;
        } else {
            
            scale = 120;
        }

        return scale;
    })(),

    
    clickRe: /(dbl)?click/,
    
    safariKeys: {
        3: 13, 
        63234: 37, 
        63235: 39, 
        63232: 38, 
        63233: 40, 
        63276: 33, 
        63277: 34, 
        63272: 46, 
        63273: 36, 
        63275: 35 
    },
    
    btnMap: Ext.isIE ? {
        1: 0,
        4: 1,
        2: 2
    } : {
        0: 0,
        1: 1,
        2: 2
    },
    
    
    
    

    constructor: function(event, freezeEvent){
        if (event) {
            this.setEvent(event.browserEvent || event, freezeEvent);
        }
    },

    setEvent: function(event, freezeEvent){
        var me = this, button, options;

        if (event == me || (event && event.browserEvent)) { 
            return event;
        }
        me.browserEvent = event;
        if (event) {
            
            button = event.button ? me.btnMap[event.button] : (event.which ? event.which - 1 : -1);
            if (me.clickRe.test(event.type) && button == -1) {
                button = 0;
            }
            options = {
                type: event.type,
                button: button,
                shiftKey: event.shiftKey,
                
                ctrlKey: event.ctrlKey || event.metaKey || false,
                altKey: event.altKey,
                
                keyCode: event.keyCode,
                charCode: event.charCode,
                
                target: Ext.EventManager.getTarget(event),
                relatedTarget: Ext.EventManager.getRelatedTarget(event),
                currentTarget: event.currentTarget,
                xy: (freezeEvent ? me.getXY() : null)
            };
        } else {
            options = {
                button: -1,
                shiftKey: false,
                ctrlKey: false,
                altKey: false,
                keyCode: 0,
                charCode: 0,
                target: null,
                xy: [0, 0]
            };
        }
        Ext.apply(me, options);
        return me;
    },

    
    stopEvent: function(){
        this.stopPropagation();
        this.preventDefault();
    },

    
    preventDefault: function(){
        if (this.browserEvent) {
            Ext.EventManager.preventDefault(this.browserEvent);
        }
    },

    
    stopPropagation: function(){
        var browserEvent = this.browserEvent;

        if (browserEvent) {
            if (browserEvent.type == 'mousedown') {
                Ext.EventManager.stoppedMouseDownEvent.fire(this);
            }
            Ext.EventManager.stopPropagation(browserEvent);
        }
    },

    
    getCharCode: function(){
        return this.charCode || this.keyCode;
    },

    
    getKey: function(){
        return this.normalizeKey(this.keyCode || this.charCode);
    },

    
    normalizeKey: function(key){
        
        return Ext.isWebKit ? (this.safariKeys[key] || key) : key;
    },

    
    getPageX: function(){
        return this.getX();
    },

    
    getPageY: function(){
        return this.getY();
    },

    
    getX: function() {
        return this.getXY()[0];
    },

    
    getY: function() {
        return this.getXY()[1];
    },

    
    getXY: function() {
        if (!this.xy) {
            
            this.xy = Ext.EventManager.getPageXY(this.browserEvent);
        }
        return this.xy;
    },

    
    getTarget : function(selector, maxDepth, returnEl){
        if (selector) {
            return Ext.fly(this.target).findParent(selector, maxDepth, returnEl);
        }
        return returnEl ? Ext.get(this.target) : this.target;
    },

    
    getRelatedTarget : function(selector, maxDepth, returnEl){
        if (selector) {
            return Ext.fly(this.relatedTarget).findParent(selector, maxDepth, returnEl);
        }
        return returnEl ? Ext.get(this.relatedTarget) : this.relatedTarget;
    },

    
    correctWheelDelta : function (delta) {
        var scale = this.WHEEL_SCALE,
            ret = Math.round(delta / scale);

        if (!ret && delta) {
            ret = (delta < 0) ? -1 : 1; 
        }

        return ret;
    },

    
    getWheelDeltas : function () {
        var me = this,
            event = me.browserEvent,
            dx = 0, dy = 0; 

        if (Ext.isDefined(event.wheelDeltaX)) { 
            dx = event.wheelDeltaX;
            dy = event.wheelDeltaY;
        } else if (event.wheelDelta) { 
            dy = event.wheelDelta;
        } else if (event.detail) { 
            dy = -event.detail; 

            
            
            if (dy > 100) {
                dy = 3;
            } else if (dy < -100) {
                dy = -3;
            }

            
            
            if (Ext.isDefined(event.axis) && event.axis === event.HORIZONTAL_AXIS) {
                dx = dy;
                dy = 0;
            }
        }

        return {
            x: me.correctWheelDelta(dx),
            y: me.correctWheelDelta(dy)
        };
    },

    
    getWheelDelta : function(){
        var deltas = this.getWheelDeltas();

        return deltas.y;
    },

    
    within : function(el, related, allowEl){
        if(el){
            var t = related ? this.getRelatedTarget() : this.getTarget(),
                result;

            if (t) {
                result = Ext.fly(el).contains(t);
                if (!result && allowEl) {
                    result = t == Ext.getDom(el);
                }
                return result;
            }
        }
        return false;
    },

    
    isNavKeyPress : function(){
        var me = this,
            k = this.normalizeKey(me.keyCode);

       return (k >= 33 && k <= 40) ||  
       k == me.RETURN ||
       k == me.TAB ||
       k == me.ESC;
    },

    
    isSpecialKey : function(){
        var k = this.normalizeKey(this.keyCode);
        return (this.type == 'keypress' && this.ctrlKey) ||
        this.isNavKeyPress() ||
        (k == this.BACKSPACE) || 
        (k >= 16 && k <= 20) || 
        (k >= 44 && k <= 46);   
    },

    
    getPoint : function(){
        var xy = this.getXY();
        return new Ext.util.Point(xy[0], xy[1]);
    },

   
    hasModifier : function(){
        return this.ctrlKey || this.altKey || this.shiftKey || this.metaKey;
    },

    
    injectEvent: function () {
        var API,
            dispatchers = {}; 

        

        
        

        if (!Ext.isIE && document.createEvent) { 
            API = {
                createHtmlEvent: function (doc, type, bubbles, cancelable) {
                    var event = doc.createEvent('HTMLEvents');

                    event.initEvent(type, bubbles, cancelable);
                    return event;
                },

                createMouseEvent: function (doc, type, bubbles, cancelable, detail,
                                            clientX, clientY, ctrlKey, altKey, shiftKey, metaKey,
                                            button, relatedTarget) {
                    var event = doc.createEvent('MouseEvents'),
                        view = doc.defaultView || window;

                    if (event.initMouseEvent) {
                        event.initMouseEvent(type, bubbles, cancelable, view, detail,
                                    clientX, clientY, clientX, clientY, ctrlKey, altKey,
                                    shiftKey, metaKey, button, relatedTarget);
                    } else { 
                        event = doc.createEvent('UIEvents');
                        event.initEvent(type, bubbles, cancelable);
                        event.view = view;
                        event.detail = detail;
                        event.screenX = clientX;
                        event.screenY = clientY;
                        event.clientX = clientX;
                        event.clientY = clientY;
                        event.ctrlKey = ctrlKey;
                        event.altKey = altKey;
                        event.metaKey = metaKey;
                        event.shiftKey = shiftKey;
                        event.button = button;
                        event.relatedTarget = relatedTarget;
                    }

                    return event;
                },

                createUIEvent: function (doc, type, bubbles, cancelable, detail) {
                    var event = doc.createEvent('UIEvents'),
                        view = doc.defaultView || window;

                    event.initUIEvent(type, bubbles, cancelable, view, detail);
                    return event;
                },

                fireEvent: function (target, type, event) {
                    target.dispatchEvent(event);
                },

                fixTarget: function (target) {
                    
                    if (target == window && !target.dispatchEvent) {
                        return document;
                    }

                    return target;
                }
            };
        } else if (document.createEventObject) { 
            var crazyIEButtons = { 0: 1, 1: 4, 2: 2 };

            API = {
                createHtmlEvent: function (doc, type, bubbles, cancelable) {
                    var event = doc.createEventObject();
                    event.bubbles = bubbles;
                    event.cancelable = cancelable;
                    return event;
                },

                createMouseEvent: function (doc, type, bubbles, cancelable, detail,
                                            clientX, clientY, ctrlKey, altKey, shiftKey, metaKey,
                                            button, relatedTarget) {
                    var event = doc.createEventObject();
                    event.bubbles = bubbles;
                    event.cancelable = cancelable;
                    event.detail = detail;
                    event.screenX = clientX;
                    event.screenY = clientY;
                    event.clientX = clientX;
                    event.clientY = clientY;
                    event.ctrlKey = ctrlKey;
                    event.altKey = altKey;
                    event.shiftKey = shiftKey;
                    event.metaKey = metaKey;
                    event.button = crazyIEButtons[button] || button;
                    event.relatedTarget = relatedTarget; 
                    return event;
                },

                createUIEvent: function (doc, type, bubbles, cancelable, detail) {
                    var event = doc.createEventObject();
                    event.bubbles = bubbles;
                    event.cancelable = cancelable;
                    return event;
                },

                fireEvent: function (target, type, event) {
                    target.fireEvent('on' + type, event);
                },

                fixTarget: function (target) {
                    if (target == document) {
                        
                        
                        return document.documentElement;
                    }

                    return target;
                }
            };
        }

        
        

        Ext.Object.each({
                load:   [false, false],
                unload: [false, false],
                select: [true, false],
                change: [true, false],
                submit: [true, true],
                reset:  [true, false],
                resize: [true, false],
                scroll: [true, false]
            },
            function (name, value) {
                var bubbles = value[0], cancelable = value[1];
                dispatchers[name] = function (targetEl, srcEvent) {
                    var e = API.createHtmlEvent(name, bubbles, cancelable);
                    API.fireEvent(targetEl, name, e);
                };
            });

        
        

        function createMouseEventDispatcher (type, detail) {
            var cancelable = (type != 'mousemove');
            return function (targetEl, srcEvent) {
                var xy = srcEvent.getXY(),
                    e = API.createMouseEvent(targetEl.ownerDocument, type, true, cancelable,
                                detail, xy[0], xy[1], srcEvent.ctrlKey, srcEvent.altKey,
                                srcEvent.shiftKey, srcEvent.metaKey, srcEvent.button,
                                srcEvent.relatedTarget);
                API.fireEvent(targetEl, type, e);
            };
        }

        Ext.each(['click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mousemove', 'mouseout'],
            function (eventName) {
                dispatchers[eventName] = createMouseEventDispatcher(eventName, 1);
            });

        
        

        Ext.Object.each({
                focusin:  [true, false],
                focusout: [true, false],
                activate: [true, true],
                focus:    [false, false],
                blur:     [false, false]
            },
            function (name, value) {
                var bubbles = value[0], cancelable = value[1];
                dispatchers[name] = function (targetEl, srcEvent) {
                    var e = API.createUIEvent(targetEl.ownerDocument, name, bubbles, cancelable, 1);
                    API.fireEvent(targetEl, name, e);
                };
            });

        
        if (!API) {
            

            dispatchers = {}; 

            API = {
                fixTarget: function (t) {
                    return t;
                }
            };
        }

        function cannotInject (target, srcEvent) {
        }

        return function (target) {
            var me = this,
                dispatcher = dispatchers[me.type] || cannotInject,
                t = target ? (target.dom || target) : me.getTarget();

            t = API.fixTarget(t);
            dispatcher(t, me);
        };
    }() 

}, function() {

Ext.EventObject = new Ext.EventObjectImpl();

});



Ext.define('Ext.dom.AbstractQuery', {
    
    select: function(q, root) {
        var results = [],
            nodes,
            i,
            j,
            qlen,
            nlen;

        root = root || document;

        if (typeof root == 'string') {
            root = document.getElementById(root);
        }

        q = q.split(",");

        for (i = 0,qlen = q.length; i < qlen; i++) {
            if (typeof q[i] == 'string') {
                
                
                if (typeof q[i][0] == '@') {
                    nodes = root.getAttributeNode(q[i].substring(1));
                    results.push(nodes);
                } else {
                    nodes = root.querySelectorAll(q[i]);

                    for (j = 0,nlen = nodes.length; j < nlen; j++) {
                        results.push(nodes[j]);
                    }
                }
            }
        }

        return results;
    },

    
    selectNode: function(q, root) {
        return this.select(q, root)[0];
    },

    
    is: function(el, q) {
        if (typeof el == "string") {
            el = document.getElementById(el);
        }
        return this.select(q).indexOf(el) !== -1;
    }

});


Ext.define('Ext.dom.AbstractHelper', {
    emptyTags : /^(?:br|frame|hr|img|input|link|meta|range|spacer|wbr|area|param|col)$/i,
    confRe : /tag|children|cn|html|tpl|tplData$/i,
    endRe : /end/i,

    attribXlat: { cls : 'class', htmlFor : 'for' },

    closeTags: {},

    decamelizeName : function () {
        var camelCaseRe = /([a-z])([A-Z])/g,
            cache = {};

        function decamel (match, p1, p2) {
            return p1 + '-' + p2.toLowerCase();
        }

        return function (s) {
            return cache[s] || (cache[s] = s.replace(camelCaseRe, decamel));
        };
    }(),

    generateMarkup: function(spec, buffer) {
        var me = this,
            attr, val, tag, i, closeTags;

        if (typeof spec == "string") {
            buffer.push(spec);
        } else if (Ext.isArray(spec)) {
            for (i = 0; i < spec.length; i++) {
                if (spec[i]) {
                    me.generateMarkup(spec[i], buffer);
                }
            }
        } else {
            tag = spec.tag || 'div';
            buffer.push('<', tag);

            for (attr in spec) {
                if (spec.hasOwnProperty(attr)) {
                    val = spec[attr];
                    if (!me.confRe.test(attr)) {
                        if (typeof val == "object") {
                            buffer.push(' ', attr, '="');
                            me.generateStyles(val, buffer).push('"');
                        } else {
                            buffer.push(' ', me.attribXlat[attr] || attr, '="', val, '"');
                        }
                    }
                }
            }

            
            if (me.emptyTags.test(tag)) {
                buffer.push('/>');
            } else {
                buffer.push('>');

                
                if ((val = spec.tpl)) {
                    val.applyOut(spec.tplData, buffer);
                }
                if ((val = spec.html)) {
                    buffer.push(val);
                }
                if ((val = spec.cn || spec.children)) {
                    me.generateMarkup(val, buffer);
                }

                
                closeTags = me.closeTags;
                buffer.push(closeTags[tag] || (closeTags[tag] = '</' + tag + '>'));
            }
        }

        return buffer;
    },

    
    generateStyles: function (styles, buffer) {
        var a = buffer || [],
            name;

        for (name in styles) {
            if (styles.hasOwnProperty(name)) {
                a.push(this.decamelizeName(name), ':', styles[name], ';');
            }
        }

        return buffer || a.join('');
    },

    
    markup: function(spec) {
        if (typeof spec == "string") {
            return spec;
        }

        var buf = this.generateMarkup(spec, []);
        return buf.join('');
    },

    
    applyStyles: function(el, styles) {
        if (styles) {
            var i = 0,
                len,
                style;

            el = Ext.fly(el);
            if (typeof styles == 'function') {
                styles = styles.call();
            }
            if (typeof styles == 'string'){
                styles = Ext.util.Format.trim(styles).split(/\s*(?::|;)\s*/);
                for(len = styles.length; i < len;){
                    el.setStyle(styles[i++], styles[i++]);
                }
            } else if (Ext.isObject(styles)) {
                el.setStyle(styles);
            }
        }
    },

    
    insertHtml: function(where, el, html) {
        var hash = {},
            hashVal,
            setStart,
            range,
            frag,
            rangeEl,
            rs;

        where = where.toLowerCase();

        
        hash['beforebegin'] = ['BeforeBegin', 'previousSibling'];
        hash['afterend'] = ['AfterEnd', 'nextSibling'];

        range = el.ownerDocument.createRange();
        setStart = 'setStart' + (this.endRe.test(where) ? 'After' : 'Before');
        if (hash[where]) {
            range[setStart](el);
            frag = range.createContextualFragment(html);
            el.parentNode.insertBefore(frag, where == 'beforebegin' ? el : el.nextSibling);
            return el[(where == 'beforebegin' ? 'previous' : 'next') + 'Sibling'];
        }
        else {
            rangeEl = (where == 'afterbegin' ? 'first' : 'last') + 'Child';
            if (el.firstChild) {
                range[setStart](el[rangeEl]);
                frag = range.createContextualFragment(html);
                if (where == 'afterbegin') {
                    el.insertBefore(frag, el.firstChild);
                }
                else {
                    el.appendChild(frag);
                }
            }
            else {
                el.innerHTML = html;
            }
            return el[rangeEl];
        }

        throw 'Illegal insertion point -> "' + where + '"';
    },

    
    insertBefore: function(el, o, returnElement) {
        return this.doInsert(el, o, returnElement, 'beforebegin');
    },

    
    insertAfter: function(el, o, returnElement) {
        return this.doInsert(el, o, returnElement, 'afterend', 'nextSibling');
    },

    
    insertFirst: function(el, o, returnElement) {
        return this.doInsert(el, o, returnElement, 'afterbegin', 'firstChild');
    },

    
    append: function(el, o, returnElement) {
        return this.doInsert(el, o, returnElement, 'beforeend', '', true);
    },

    
    overwrite: function(el, o, returnElement) {
        el = Ext.getDom(el);
        el.innerHTML = this.markup(o);
        return returnElement ? Ext.get(el.firstChild) : el.firstChild;
    },

    doInsert: function(el, o, returnElement, pos, sibling, append) {
        var newNode = this.insertHtml(pos, Ext.getDom(el), this.markup(o));
        return returnElement ? Ext.get(newNode, true) : newNode;
    }

});


(function() {

var document = window.document,
    trimRe = /^\s+|\s+$/g,
    whitespaceRe = /\s/;

if (!Ext.cache){
    Ext.cache = {};
}

Ext.define('Ext.dom.AbstractElement', {

    inheritableStatics: {

        
        get: function(el) {
            var me = this,
                El = Ext.dom.Element,
                cache,
                extEl,
                dom,
                id;

            if (!el) {
                return null;
            }

            if (typeof el == "string") { 
                if (el == Ext.windowId) {
                    return El.get(window);
                } else if (el == Ext.documentId) {
                    return El.get(document);
                }
                
                cache = Ext.cache[el];
                
                
                
                
                if (cache && cache.skipGarbageCollection) {
                    extEl = cache.el;
                    return extEl;
                }
                
                if (!(dom = document.getElementById(el))) {
                    return null;
                }

                if (cache && cache.el) {
                    extEl = cache.el;
                    extEl.dom = dom;
                } else {
                    
                    extEl = new El(dom, !!cache);
                }
                return extEl;
            } else if (el.tagName) { 
                if (!(id = el.id)) {
                    id = Ext.id(el);
                }
                cache = Ext.cache[id];
                if (cache && cache.el) {
                    extEl = Ext.cache[id].el;
                    extEl.dom = el;
                } else {
                    
                    extEl = new El(el, !!cache);
                }
                return extEl;
            } else if (el instanceof me) {
                if (el != me.docEl && el != me.winEl) {
                    
                    
                    el.dom = document.getElementById(el.id) || el.dom;
                }
                return el;
            } else if (el.isComposite) {
                return el;
            } else if (Ext.isArray(el)) {
                return me.select(el);
            } else if (el === document) {
                
                if (!me.docEl) {
                    me.docEl = Ext.Object.chain(El.prototype);
                    me.docEl.dom = document;
                    me.docEl.id = Ext.id(document);
                    me.addToCache(me.docEl);
                }
                return me.docEl;
            } else if (el === window) {
                if (!me.winEl) {
                    me.winEl = Ext.Object.chain(El.prototype);
                    me.winEl.dom = window;
                    me.winEl.id = Ext.id(window);
                    me.addToCache(me.winEl);
                }
                return me.winEl;
            }
            return null;
        },

        addToCache: function(el, id) {
            if (el) {
                id = id || el.id;
                el.$cache = Ext.cache[id] || (Ext.cache[id] = {
                    data: {},
                    events: {}
                });
                
                
                
                el.$cache.el = el;
            }
            return el;
        },

        addMethods: function() {
            this.override.apply(this, arguments);
        },

        
        mergeClsList: function() {
            var clsList, clsHash = {},
                i, length, j, listLength, clsName, result = [],
                changed = false;

            for (i = 0, length = arguments.length; i < length; i++) {
                clsList = arguments[i];
                if (Ext.isString(clsList)) {
                    clsList = clsList.replace(trimRe, '').split(whitespaceRe);
                }
                if (clsList) {
                    for (j = 0, listLength = clsList.length; j < listLength; j++) {
                        clsName = clsList[j];
                        if (!clsHash[clsName]) {
                            if (i) {
                                changed = true;
                            }
                            clsHash[clsName] = true;
                        }
                    }
                }
            }

            for (clsName in clsHash) {
                result.push(clsName);
            }
            result.changed = changed;
            return result;
        },

        
        removeCls: function(existingClsList, removeClsList) {
            var clsHash = {},
                i, length, clsName, result = [],
                changed = false;

            if (existingClsList) {
                if (Ext.isString(existingClsList)) {
                    existingClsList = existingClsList.replace(trimRe, '').split(whitespaceRe);
                }
                for (i = 0, length = existingClsList.length; i < length; i++) {
                    clsHash[existingClsList[i]] = true;
                }
            }
            if (removeClsList) {
                if (Ext.isString(removeClsList)) {
                    removeClsList = removeClsList.split(whitespaceRe);
                }
                for (i = 0, length = removeClsList.length; i < length; i++) {
                    clsName = removeClsList[i];
                    if (clsHash[clsName]) {
                        changed = true;
                        delete clsHash[clsName];
                    }
                }
            }
            for (clsName in clsHash) {
                result.push(clsName);
            }
            result.changed = changed;
            return result;
        },

        
        VISIBILITY: 1,

        
        DISPLAY: 2,

        
        OFFSETS: 3
    },

    constructor: function(element, forceNew) {
        var me = this,
            dom = typeof element == 'string'
                ? document.getElementById(element)
                : element,
            id;

        if (!dom) {
            return null;
        }

        id = dom.id;
        if (!forceNew && id && Ext.cache[id]) {
            
            return Ext.cache[id].el;
        }

        
        me.dom = dom;

        
        me.id = id || Ext.id(dom);

        me.self.addToCache(me);
    },

    
    set: function(o, useSet) {
         var el = this.dom,
             attr,
             value;

         for (attr in o) {
             if (o.hasOwnProperty(attr)) {
                 value = o[attr];
                 if (attr == 'style') {
                     this.applyStyles(value);
                 }
                 else if (attr == 'cls') {
                     el.className = value;
                 }
                 else if (useSet !== false) {
                     if (value === undefined) {
                         el.removeAttribute(attr);
                     } else {
                        el.setAttribute(attr, value);
                     }
                 }
                 else {
                     el[attr] = value;
                 }
             }
         }
         return this;
     },

    
    defaultUnit: "px",

    
    is: function(simpleSelector) {
        return Ext.DomQuery.is(this.dom, simpleSelector);
    },

    
    getValue: function(asNumber) {
        var val = this.dom.value;
        return asNumber ? parseInt(val, 10) : val;
    },

    
    remove: function() {
        var me = this,
        dom = me.dom;

        if (dom) {
            Ext.removeNode(dom);
            delete me.dom;
        }
    },

    
    contains: function(el) {
        if (!el) {
            return false;
        }

        var me = this,
            dom = el.dom || el;

        
        return (dom === me.dom) || Ext.dom.AbstractElement.isAncestor(me.dom, dom);
    },

    
    getAttribute: function(name, ns) {
        var dom = this.dom;
        return dom.getAttributeNS(ns, name) || dom.getAttribute(ns + ":" + name) || dom.getAttribute(name) || dom[name];
    },

    
    update: function(html) {
        if (this.dom) {
            this.dom.innerHTML = html;
        }
        return this;
    },


    
    setHTML: function(html) {
        if(this.dom) {
            this.dom.innerHTML = html;
        }
        return this;
    },

    
    getHTML: function() {
        return this.dom ? this.dom.innerHTML : '';
    },

    
    hide: function() {
        this.setVisible(false);
        return this;
    },

    
    show: function() {
        this.setVisible(true);
        return this;
    },

    
    setVisible: function(visible, animate) {
        var me = this,
            statics = me.self,
            mode = me.getVisibilityMode(),
            prefix = Ext.baseCSSPrefix;

        switch (mode) {
            case statics.VISIBILITY:
                me.removeCls([prefix + 'hidden-display', prefix + 'hidden-offsets']);
                me[visible ? 'removeCls' : 'addCls'](prefix + 'hidden-visibility');
            break;

            case statics.DISPLAY:
                me.removeCls([prefix + 'hidden-visibility', prefix + 'hidden-offsets']);
                me[visible ? 'removeCls' : 'addCls'](prefix + 'hidden-display');
            break;

            case statics.OFFSETS:
                me.removeCls([prefix + 'hidden-visibility', prefix + 'hidden-display']);
                me[visible ? 'removeCls' : 'addCls'](prefix + 'hidden-offsets');
            break;
        }

        return me;
    },

    getVisibilityMode: function() {
        
        
        
        var data = (this.$cache || this.getCache()).data,
            visMode = data.visibilityMode;

        if (visMode === undefined) {
            data.visibilityMode = visMode = this.self.DISPLAY;
        }
        
        return visMode;
    },

    
    setVisibilityMode: function(mode) {
        (this.$cache || this.getCache()).data.visibilityMode = mode;
        return this;
    },
    
    getCache: function() {
        var me = this,
            id = me.dom.id || Ext.id(me.dom);

        
        
        
        me.$cache = Ext.cache[id] || (Ext.cache[id] = {
            data: {},
            events: {}
        });     
            
        return me.$cache;
    }
    
}, function() {
    var AbstractElement = this,
        validIdRe = /^[a-z_][a-z0-9_\-]*$/i;

    Ext.getDetachedBody = function () {
        var detachedEl = AbstractElement.detachedBodyEl;

        if (!detachedEl) {
            detachedEl = document.createElement('div');
            AbstractElement.detachedBodyEl = detachedEl = new AbstractElement.Fly(detachedEl);
            detachedEl.isDetachedBody = true;
        }

        return detachedEl;
    };

    Ext.getElementById = function (id) {
        var el = document.getElementById(id),
            detachedBodyEl;

        if (!el && (detachedBodyEl = AbstractElement.detachedBodyEl) && validIdRe.test(id)) {
            el = detachedBodyEl.dom.querySelector('#' + id);
        }

        return el;
    };

    
    Ext.get = function(el) {
        return Ext.dom.Element.get(el);
    };

    this.addStatics({
        
        Fly: new Ext.Class({
            extend: AbstractElement,

            
            isFly: true,

            constructor: function(dom) {
                this.dom = dom;
            },

            
            attach: function (dom) {

                
                this.dom = dom;
                
                
                this.$cache = dom.id ? Ext.cache[dom.id] : null;
                return this;
            }
        }),

        _flyweights: {},

        
        fly: function(dom, named) {
            var fly = null,
                _flyweights = AbstractElement._flyweights;

            named = named || '_global';

            dom = Ext.getDom(dom);

            if (dom) {
                fly = _flyweights[named] || (_flyweights[named] = new AbstractElement.Fly());

                
                
                fly.dom = dom;
                
                
                fly.$cache = dom.id ? Ext.cache[dom.id] : null;
            }
            return fly;
        }
    });

    
    Ext.fly = function() {
        return AbstractElement.fly.apply(AbstractElement, arguments);
    };

    (function (proto) {
        
        proto.destroy = proto.remove;

        
        if (document.querySelector) {
            proto.getById = function (id, asDom) {
                
                
                var dom = document.getElementById(id) ||
                          (validIdRe.test(id) ? this.dom.querySelector('#'+id) : null);
                return asDom ? dom : (dom ? Ext.get(dom) : null);
            };
        } else {
            proto.getById = function (id, asDom) {
                var dom = document.getElementById(id);
                return asDom ? dom : (dom ? Ext.get(dom) : null);
            };
        }
    })(this.prototype);
});

})();

Ext.dom.AbstractElement.addInheritableStatics({
    unitRe: /\d+(px|em|%|en|ex|pt|in|cm|mm|pc)$/i,
    camelRe: /(-[a-z])/gi,
    cssRe: /([a-z0-9-]+)\s*:\s*([^;\s]+(?:\s*[^;\s]+)*);?/gi,
    opacityRe: /alpha\(opacity=(.*)\)/i,
    propertyCache: {},
    defaultUnit : "px",
    borders: {l: 'border-left-width', r: 'border-right-width', t: 'border-top-width', b: 'border-bottom-width'},
    paddings: {l: 'padding-left', r: 'padding-right', t: 'padding-top', b: 'padding-bottom'},
    margins: {l: 'margin-left', r: 'margin-right', t: 'margin-top', b: 'margin-bottom'},
    
    addUnits: function(size, units) {
        
        if (typeof size == 'number') {
            return size + (units || this.defaultUnit || 'px');
        }

        
        if (size === "" || size == "auto" || size === undefined || size === null) {
            return size || '';
        }

        
        if (!this.unitRe.test(size)) {
            return size || '';
        }

        return size;
    },

    
    isAncestor: function(p, c) {
        var ret = false;

        p = Ext.getDom(p);
        c = Ext.getDom(c);
        if (p && c) {
            if (p.contains) {
                return p.contains(c);
            } else if (p.compareDocumentPosition) {
                return !!(p.compareDocumentPosition(c) & 16);
            } else {
                while ((c = c.parentNode)) {
                    ret = c == p || ret;
                }
            }
        }
        return ret;
    },

    
    parseBox: function(box) {
        if (typeof box != 'string') {
            box = box.toString();
        }
        var parts  = box.split(' '),
            ln = parts.length;

        if (ln == 1) {
            parts[1] = parts[2] = parts[3] = parts[0];
        }
        else if (ln == 2) {
            parts[2] = parts[0];
            parts[3] = parts[1];
        }
        else if (ln == 3) {
            parts[3] = parts[1];
        }

        return {
            top   :parseFloat(parts[0]) || 0,
            right :parseFloat(parts[1]) || 0,
            bottom:parseFloat(parts[2]) || 0,
            left  :parseFloat(parts[3]) || 0
        };
    },

    
    unitizeBox: function(box, units) {
        var A = this.addUnits,
            B = this.parseBox(box);

        return A(B.top, units) + ' ' +
               A(B.right, units) + ' ' +
               A(B.bottom, units) + ' ' +
               A(B.left, units);

    },

    
    camelReplaceFn: function(m, a) {
        return a.charAt(1).toUpperCase();
    },

    
    normalize: function(prop) {
        
        if (prop == 'float') {
            prop = Ext.supports.Float ? 'cssFloat' : 'styleFloat';
        }
        return this.propertyCache[prop] || (this.propertyCache[prop] = prop.replace(this.camelRe, this.camelReplaceFn));
    },

    
    getDocumentHeight: function() {
        return Math.max(!Ext.isStrict ? document.body.scrollHeight : document.documentElement.scrollHeight, this.getViewportHeight());
    },

    
    getDocumentWidth: function() {
        return Math.max(!Ext.isStrict ? document.body.scrollWidth : document.documentElement.scrollWidth, this.getViewportWidth());
    },

    
    getViewportHeight: function(){
        return window.innerHeight;
    },

    
    getViewportWidth: function() {
        return window.innerWidth;
    },

    
    getViewSize: function() {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        };
    },

    
    getOrientation: function() {
        if (Ext.supports.OrientationChange) {
            return (window.orientation == 0) ? 'portrait' : 'landscape';
        }

        return (window.innerHeight > window.innerWidth) ? 'portrait' : 'landscape';
    },

    
    fromPoint: function(x, y) {
        return Ext.get(document.elementFromPoint(x, y));
    },

    
    parseStyles: function(styles){
        var out = {},
            cssRe = this.cssRe,
            matches;

        if (styles) {
            
            
            
            
            cssRe.lastIndex = 0;
            while ((matches = cssRe.exec(styles))) {
                out[matches[1]] = matches[2];
            }
        }
        return out;
    }
});


(function(){
    var doc = document,
        AbstractElement = Ext.dom.AbstractElement,
        activeElement = null,
        isCSS1 = doc.compatMode == "CSS1Compat",
        flyInstance,
        fly = function (el) {
            if (!flyInstance) {
                flyInstance = new AbstractElement.Fly();
            }
            flyInstance.attach(el);
            return flyInstance;
        };

    
    
    
    if (!('activeElement' in doc) && doc.addEventListener) {
        doc.addEventListener('focus',
            function (ev) {
                if (ev && ev.target) {
                    activeElement = (ev.target == doc) ? null : ev.target;
                }
            }, true);
    }

    
    function makeSelectionRestoreFn (activeEl, start, end) {
        return function () {
            activeEl.selectionStart = start;
            activeEl.selectionEnd = end;
        };
    }

    AbstractElement.addInheritableStatics({
        
        getActiveElement: function () {
            return doc.activeElement || activeElement;
        },

        
        getRightMarginFixCleaner: function (target) {
            var supports = Ext.supports,
                hasInputBug = supports.DisplayChangeInputSelectionBug,
                hasTextAreaBug = supports.DisplayChangeTextAreaSelectionBug;

            if (hasInputBug || hasTextAreaBug) {
                var activeEl = doc.activeElement || activeElement, 
                    tag = activeEl && activeEl.tagName,
                    start,
                    end;

                if ((hasTextAreaBug && tag == 'TEXTAREA') ||
                    (hasInputBug && tag == 'INPUT' && activeEl.type == 'text')) {
                    if (Ext.dom.Element.isAncestor(target, activeEl)) {
                        start = activeEl.selectionStart;
                        end = activeEl.selectionEnd;

                        if (Ext.isNumber(start) && Ext.isNumber(end)) { 
                            
                            
                            
                            
                            return makeSelectionRestoreFn(activeEl, start, end);
                        }
                    }
                }
            }

            return Ext.emptyFn; 
        },

        getViewWidth: function(full) {
            return full ? Ext.dom.Element.getDocumentWidth() : Ext.dom.Element.getViewportWidth();
        },

        getViewHeight: function(full) {
            return full ? Ext.dom.Element.getDocumentHeight() : Ext.dom.Element.getViewportHeight();
        },

        getDocumentHeight: function() {
            return Math.max(!isCSS1 ? doc.body.scrollHeight : doc.documentElement.scrollHeight, Ext.dom.Element.getViewportHeight());
        },

        getDocumentWidth: function() {
            return Math.max(!isCSS1 ? doc.body.scrollWidth : doc.documentElement.scrollWidth, Ext.dom.Element.getViewportWidth());
        },

        getViewportHeight: function(){
            return Ext.isIE ?
                   (Ext.isStrict ? doc.documentElement.clientHeight : doc.body.clientHeight) :
                   self.innerHeight;
        },

        getViewportWidth: function() {
            return (!Ext.isStrict && !Ext.isOpera) ? doc.body.clientWidth :
                   Ext.isIE ? doc.documentElement.clientWidth : self.innerWidth;
        },

        getY: function(el) {
            return Ext.dom.Element.getXY(el)[1];
        },

        getX: function(el) {
            return Ext.dom.Element.getXY(el)[0];
        },

        getXY: function(el) {
            var p,
                pe,
                b,
                bt,
                bl,
                dbd,
                x = 0,
                y = 0,
                scroll,
                hasAbsolute,
                bd = (doc.body || doc.documentElement),
                ret = [0,0];

            el = Ext.getDom(el);

            if(el != bd){
                hasAbsolute = fly(el).isStyle("position", "absolute");

                if (el.getBoundingClientRect) {
                    b = el.getBoundingClientRect();
                    scroll = fly(document).getScroll();
                    ret = [Math.round(b.left + scroll.left), Math.round(b.top + scroll.top)];
                } else {
                    p = el;

                    while (p) {
                        pe = fly(p);
                        x += p.offsetLeft;
                        y += p.offsetTop;

                        hasAbsolute = hasAbsolute || pe.isStyle("position", "absolute");

                        if (Ext.isGecko) {
                            y += bt = parseInt(pe.getStyle("borderTopWidth"), 10) || 0;
                            x += bl = parseInt(pe.getStyle("borderLeftWidth"), 10) || 0;

                            if (p != el && !pe.isStyle('overflow','visible')) {
                                x += bl;
                                y += bt;
                            }
                        }
                        p = p.offsetParent;
                    }

                    if (Ext.isSafari && hasAbsolute) {
                        x -= bd.offsetLeft;
                        y -= bd.offsetTop;
                    }

                    if (Ext.isGecko && !hasAbsolute) {
                        dbd = fly(bd);
                        x += parseInt(dbd.getStyle("borderLeftWidth"), 10) || 0;
                        y += parseInt(dbd.getStyle("borderTopWidth"), 10) || 0;
                    }

                    p = el.parentNode;
                    while (p && p != bd) {
                        if (!Ext.isOpera || (p.tagName != 'TR' && !fly(p).isStyle("display", "inline"))) {
                            x -= p.scrollLeft;
                            y -= p.scrollTop;
                        }
                        p = p.parentNode;
                    }
                    ret = [x,y];
                }
            }
            return ret;
        },

        setXY: function(el, xy) {
            (el = Ext.fly(el, '_setXY')).position();

            var pts = el.translatePoints(xy),
                style = el.dom.style,
                pos;

            for (pos in pts) {
                if (!isNaN(pts[pos])) {
                    style[pos] = pts[pos] + "px";
                }
            }
        },

        setX: function(el, x) {
            Ext.dom.Element.setXY(el, [x, false]);
        },

        setY: function(el, y) {
            Ext.dom.Element.setXY(el, [false, y]);
        },

        
        serializeForm: function(form) {
            var fElements = form.elements || (document.forms[form] || Ext.getDom(form)).elements,
                hasSubmit = false,
                encoder = encodeURIComponent,
                name,
                data = '',
                type,
                hasValue;

            Ext.each(fElements, function(element){
                name = element.name;
                type = element.type;

                if (!element.disabled && name) {
                    if (/select-(one|multiple)/i.test(type)) {
                        Ext.each(element.options, function(opt){
                            if (opt.selected) {
                                hasValue = opt.hasAttribute ? opt.hasAttribute('value') : opt.getAttributeNode('value').specified;
                                data += Ext.String.format("{0}={1}&", encoder(name), encoder(hasValue ? opt.value : opt.text));
                            }
                        });
                    } else if (!(/file|undefined|reset|button/i.test(type))) {
                        if (!(/radio|checkbox/i.test(type) && !element.checked) && !(type == 'submit' && hasSubmit)) {
                            data += encoder(name) + '=' + encoder(element.value) + '&';
                            hasSubmit = /submit/i.test(type);
                        }
                    }
                }
            });
            return data.substr(0, data.length - 1);
        }
    });
})();


Ext.dom.AbstractElement.override({

    
    getAnchorXY: function(anchor, local, size) {
        
        
        anchor = (anchor || "tl").toLowerCase();
        size = size || {};

        var me = this,
            vp = me.dom == document.body || me.dom == document,
            width = size.width || vp ? window.innerWidth: me.getWidth(),
            height = size.height || vp ? window.innerHeight: me.getHeight(),
            xy,
            rnd = Math.round,
            myXY = me.getXY(),
            extraX = vp ? 0: !local ? myXY[0] : 0,
            extraY = vp ? 0: !local ? myXY[1] : 0,
            hash = {
                c: [rnd(width * 0.5), rnd(height * 0.5)],
                t: [rnd(width * 0.5), 0],
                l: [0, rnd(height * 0.5)],
                r: [width, rnd(height * 0.5)],
                b: [rnd(width * 0.5), height],
                tl: [0, 0],
                bl: [0, height],
                br: [width, height],
                tr: [width, 0]
            };

        xy = hash[anchor];
        return [xy[0] + extraX, xy[1] + extraY];
    },

    alignToRe: /^([a-z]+)-([a-z]+)(\?)?$/,

    
    getAlignToXY: function(el, position, offsets, local) {
        local = !!local;
        el = Ext.get(el);

        offsets = offsets || [0, 0];

        if (!position || position == '?') {
            position = 'tl-bl?';
        }
        else if (! (/-/).test(position) && position !== "") {
            position = 'tl-' + position;
        }
        position = position.toLowerCase();

        var me = this,
            matches = position.match(this.alignToRe),
            dw = window.innerWidth,
            dh = window.innerHeight,
            p1 = "",
            p2 = "",
            a1,
            a2,
            x,
            y,
            swapX,
            swapY,
            p1x,
            p1y,
            p2x,
            p2y,
            width,
            height,
            region,
            constrain;

        if (!matches) {
            throw "Element.alignTo with an invalid alignment " + position;
        }

        p1 = matches[1];
        p2 = matches[2];
        constrain = !!matches[3];

        
        
        a1 = me.getAnchorXY(p1, true);
        a2 = el.getAnchorXY(p2, local);

        x = a2[0] - a1[0] + offsets[0];
        y = a2[1] - a1[1] + offsets[1];

        if (constrain) {
            width = me.getWidth();
            height = me.getHeight();

            region = el.getPageBox();

            
            
            
            p1y = p1.charAt(0);
            p1x = p1.charAt(p1.length - 1);
            p2y = p2.charAt(0);
            p2x = p2.charAt(p2.length - 1);

            swapY = ((p1y == "t" && p2y == "b") || (p1y == "b" && p2y == "t"));
            swapX = ((p1x == "r" && p2x == "l") || (p1x == "l" && p2x == "r"));

            if (x + width > dw) {
                x = swapX ? region.left - width: dw - width;
            }
            if (x < 0) {
                x = swapX ? region.right: 0;
            }
            if (y + height > dh) {
                y = swapY ? region.top - height: dh - height;
            }
            if (y < 0) {
                y = swapY ? region.bottom: 0;
            }
        }

        return [x, y];
    },

    
    getAnchor: function(){
        var data = (this.$cache || this.getCache()).data,
            anchor;
            
        if (!this.dom) {
            return;
        }
        anchor = data._anchor;

        if(!anchor){
            anchor = data._anchor = {};
        }
        return anchor;
    },

    
    adjustForConstraints: function(xy, parent) {
        var vector = this.getConstrainVector(parent, xy);
        if (vector) {
            xy[0] += vector[0];
            xy[1] += vector[1];
        }
        return xy;
    }

});


Ext.dom.AbstractElement.addMethods({
    
    appendChild: function(el) {
        return Ext.get(el).appendTo(this);
    },

    
    appendTo: function(el) {
        Ext.getDom(el).appendChild(this.dom);
        return this;
    },

    
    insertBefore: function(el) {
        el = Ext.getDom(el);
        el.parentNode.insertBefore(this.dom, el);
        return this;
    },

    
    insertAfter: function(el) {
        el = Ext.getDom(el);
        el.parentNode.insertBefore(this.dom, el.nextSibling);
        return this;
    },

    
    insertFirst: function(el, returnDom) {
        el = el || {};
        if (el.nodeType || el.dom || typeof el == 'string') { 
            el = Ext.getDom(el);
            this.dom.insertBefore(el, this.dom.firstChild);
            return !returnDom ? Ext.get(el) : el;
        }
        else { 
            return this.createChild(el, this.dom.firstChild, returnDom);
        }
    },

    
    insertSibling: function(el, where, returnDom){
        var me = this, rt,
        isAfter = (where || 'before').toLowerCase() == 'after',
        insertEl;

        if(Ext.isArray(el)){
            insertEl = me;
            Ext.each(el, function(e) {
                rt = Ext.fly(insertEl, '_internal').insertSibling(e, where, returnDom);
                if(isAfter){
                    insertEl = rt;
                }
            });
            return rt;
        }

        el = el || {};

        if(el.nodeType || el.dom){
            rt = me.dom.parentNode.insertBefore(Ext.getDom(el), isAfter ? me.dom.nextSibling : me.dom);
            if (!returnDom) {
                rt = Ext.get(rt);
            }
        }else{
            if (isAfter && !me.dom.nextSibling) {
                rt = Ext.core.DomHelper.append(me.dom.parentNode, el, !returnDom);
            } else {
                rt = Ext.core.DomHelper[isAfter ? 'insertAfter' : 'insertBefore'](me.dom, el, !returnDom);
            }
        }
        return rt;
    },

    
    replace: function(el) {
        el = Ext.get(el);
        this.insertBefore(el);
        el.remove();
        return this;
    },

    
    replaceWith: function(el){
        var me = this;

        if(el.nodeType || el.dom || typeof el == 'string'){
            el = Ext.get(el);
            me.dom.parentNode.insertBefore(el, me.dom);
        }else{
            el = Ext.core.DomHelper.insertBefore(me.dom, el);
        }

        delete Ext.cache[me.id];
        Ext.removeNode(me.dom);
        me.id = Ext.id(me.dom = el);
        Ext.dom.AbstractElement.addToCache(me.isFlyweight ? new Ext.dom.AbstractElement(me.dom) : me);
        return me;
    },

    
    createChild: function(config, insertBefore, returnDom) {
        config = config || {tag:'div'};
        if (insertBefore) {
            return Ext.core.DomHelper.insertBefore(insertBefore, config, returnDom !== true);
        }
        else {
            return Ext.core.DomHelper[!this.dom.firstChild ? 'insertFirst' : 'append'](this.dom, config,  returnDom !== true);
        }
    },

    
    wrap: function(config, returnDom) {
        var newEl = Ext.core.DomHelper.insertBefore(this.dom, config || {tag: "div"}, !returnDom),
            d = newEl.dom || newEl;

        d.appendChild(this.dom);
        return newEl;
    },

    
    insertHtml: function(where, html, returnEl) {
        var el = Ext.core.DomHelper.insertHtml(where, this.dom, html);
        return returnEl ? Ext.get(el) : el;
    }
});


(function(){

var Element = Ext.dom.AbstractElement;

Element.override({

    
    getX: function(el) {
        return this.getXY(el)[0];
    },

    
    getY: function(el) {
        return this.getXY(el)[1];
    },

    
    getXY: function() {
        
        var point = window.webkitConvertPointFromNodeToPage(this.dom, new WebKitPoint(0, 0));
        return [point.x, point.y];
    },

    
    getOffsetsTo: function(el){
        var o = this.getXY(),
            e = Ext.fly(el, '_internal').getXY();
        return [o[0]-e[0],o[1]-e[1]];
    },

    
    setX: function(x){
        return this.setXY([x, this.getY()]);
    },

    
    setY: function(y) {
        return this.setXY([this.getX(), y]);
    },

    
    setLeft: function(left) {
        this.setStyle('left', Element.addUnits(left));
        return this;
    },

    
    setTop: function(top) {
        this.setStyle('top', Element.addUnits(top));
        return this;
    },

    
    setRight: function(right) {
        this.setStyle('right', Element.addUnits(right));
        return this;
    },

    
    setBottom: function(bottom) {
        this.setStyle('bottom', Element.addUnits(bottom));
        return this;
    },

    
    setXY: function(pos) {
        var me = this;

        if (arguments.length > 1) {
            pos = [pos, arguments[1]];
        }

        
        var pts = me.translatePoints(pos),
                style = me.dom.style;

        for (pos in pts) {
            if (!pts.hasOwnProperty(pos)) {
                continue;
            }
            if (!isNaN(pts[pos])) style[pos] = pts[pos] + "px";
        }
        return me;
    },

    
    getLeft: function(local) {
        return parseInt(this.getStyle('left'), 10) || 0;
    },

    
    getRight: function(local) {
        return parseInt(this.getStyle('right'), 10) || 0;
    },

    
    getTop: function(local) {
        return parseInt(this.getStyle('top'), 10) || 0;
    },

    
    getBottom: function(local) {
        return parseInt(this.getStyle('bottom'), 10) || 0;
    },

    
    translatePoints: function(x, y) {
        y = isNaN(x[1]) ? y : x[1];
        x = isNaN(x[0]) ? x : x[0];
        var me = this,
            relative = me.isStyle('position', 'relative'),
            o = me.getXY(),
            l = parseInt(me.getStyle('left'), 10),
            t = parseInt(me.getStyle('top'), 10);

        l = !isNaN(l) ? l : (relative ? 0 : me.dom.offsetLeft);
        t = !isNaN(t) ? t : (relative ? 0 : me.dom.offsetTop);

        return {left: (x - o[0] + l), top: (y - o[1] + t)};
    },

    
    setBox: function(box) {
        var me = this,
            width = box.width,
            height = box.height,
            top = box.top,
            left = box.left;

        if (left !== undefined) {
            me.setLeft(left);
        }
        if (top !== undefined) {
            me.setTop(top);
        }
        if (width !== undefined) {
            me.setWidth(width);
        }
        if (height !== undefined) {
            me.setHeight(height);
        }

        return this;
    },

    
    getBox: function(contentBox, local) {
        var me = this,
            dom = me.dom,
            width = dom.offsetWidth,
            height = dom.offsetHeight,
            xy, box, l, r, t, b;

        if (!local) {
            xy = me.getXY();
        }
        else if (contentBox) {
            xy = [0,0];
        }
        else {
            xy = [parseInt(me.getStyle("left"), 10) || 0, parseInt(me.getStyle("top"), 10) || 0];
        }

        if (!contentBox) {
            box = {
                x: xy[0],
                y: xy[1],
                0: xy[0],
                1: xy[1],
                width: width,
                height: height
            };
        }
        else {
            l = me.getBorderWidth.call(me, "l") + me.getPadding.call(me, "l");
            r = me.getBorderWidth.call(me, "r") + me.getPadding.call(me, "r");
            t = me.getBorderWidth.call(me, "t") + me.getPadding.call(me, "t");
            b = me.getBorderWidth.call(me, "b") + me.getPadding.call(me, "b");
            box = {
                x: xy[0] + l,
                y: xy[1] + t,
                0: xy[0] + l,
                1: xy[1] + t,
                width: width - (l + r),
                height: height - (t + b)
            };
        }

        box.left = box.x;
        box.top = box.y;
        box.right = box.x + box.width;
        box.bottom = box.y + box.height;

        return box;
    },

    
    getPageBox: function(getRegion) {
        var me = this,
            el = me.dom,
            w = el.offsetWidth,
            h = el.offsetHeight,
            xy = me.getXY(),
            t = xy[1],
            r = xy[0] + w,
            b = xy[1] + h,
            l = xy[0];

        if (!el) {
            return new Ext.util.Region();
        }

        if (getRegion) {
            return new Ext.util.Region(t, r, b, l);
        }
        else {
            return {
                left: l,
                top: t,
                width: w,
                height: h,
                right: r,
                bottom: b
            };
        }
    }
});

})();


(function(){
    
    var Element = Ext.dom.AbstractElement,
        view = document.defaultView,
        trimRe = /^\s+|\s+$/g,
        wordsRe = /\w/g,
        spacesRe = /\s+/,
        transparentRe = /^(?:transparent|(?:rgba[(](?:\s*\d+\s*[,]){3}\s*0\s*[)]))$/i,
        hasClassList = Ext.supports.ClassList,

        PADDING = 'padding',
        MARGIN = 'margin',
        BORDER = 'border',
        LEFT_SUFFIX = '-left',
        RIGHT_SUFFIX = '-right',
        TOP_SUFFIX = '-top',
        BOTTOM_SUFFIX = '-bottom',
        WIDTH = '-width',

        supportsTransparentColor = Ext.supports.TransparentColor,

        
        borders = {l: BORDER + LEFT_SUFFIX + WIDTH, r: BORDER + RIGHT_SUFFIX + WIDTH, t: BORDER + TOP_SUFFIX + WIDTH, b: BORDER + BOTTOM_SUFFIX + WIDTH},
        paddings = {l: PADDING + LEFT_SUFFIX, r: PADDING + RIGHT_SUFFIX, t: PADDING + TOP_SUFFIX, b: PADDING + BOTTOM_SUFFIX},
        margins = {l: MARGIN + LEFT_SUFFIX, r: MARGIN + RIGHT_SUFFIX, t: MARGIN + TOP_SUFFIX, b: MARGIN + BOTTOM_SUFFIX};


    Element.override({

        
        styleHooks: {},

        
        addStyles: function(sides, styles){
            var totalSize = 0,
                sidesArr = sides.match(wordsRe),
                i = 0,
                len = sidesArr.length,
                side, size;
            for (; i < len; i++) {
                side = sidesArr[i];
                size = side && parseInt(this.getStyle(styles[side]), 10);
                if (size) {
                    totalSize += Math.abs(size);
                }
            }
            return totalSize;
        },

        
        addCls: hasClassList ?
            function (className) {
                var me = this,
                    dom = me.dom,
                    classList,
                    newCls,
                    i,
                    len,
                    cls;

                if (typeof(className) == 'string') {
                    
                    className = className.replace(trimRe, '').split(spacesRe);
                }

                
                
                if (dom && className && !!(len = className.length)) {
                    if (!dom.className) {
                        dom.className = className.join(' ');
                    } else {
                        classList = dom.classList;
                        for (i = 0; i < len; ++i) {
                            cls = className[i];
                            if (cls) {
                                if (!classList.contains(cls)) {
                                    if (newCls) {
                                        newCls.push(cls);
                                    } else {
                                        newCls = dom.className.replace(trimRe, '');
                                        newCls = newCls ? [newCls, cls] : [cls];
                                    }
                                }
                            }
                        }

                        if (newCls) {
                            dom.className = newCls.join(' '); 
                        }
                    }
                }
                return me;
            } :
            function(className) {
                var me = this,
                    dom = me.dom,
                    changed,
                    elClasses;

                if (dom && className && className.length) {
                    elClasses = Ext.Element.mergeClsList(dom.className, className);
                    if (elClasses.changed) {
                        dom.className = elClasses.join(' '); 
                    }
                }
                return me;
            },


        
        removeCls: function(className) {
            var me = this,
                dom = me.dom,
                len,
                elClasses;

            if (typeof(className) == 'string') {
                
                className = className.replace(trimRe, '').split(spacesRe);
            }

            if (dom && dom.className && className && !!(len = className.length)) {
                if (len == 1 && hasClassList) {
                    if (className[0]) {
                        dom.classList.remove(className[0]); 
                    }
                } else {
                    elClasses = Ext.Element.removeCls(dom.className, className);
                    if (elClasses.changed) {
                        dom.className = elClasses.join(' ');
                    }
                }
            }
            return me;
        },

        
        radioCls: function(className) {
            var cn = this.dom.parentNode.childNodes,
                v;
            className = Ext.isArray(className) ? className: [className];
            for (var i = 0, len = cn.length; i < len; i++) {
                v = cn[i];
                if (v && v.nodeType == 1) {
                    Ext.fly(v, '_internal').removeCls(className);
                }
            };
            return this.addCls(className);
        },

        
        toggleCls: hasClassList ?
            function (className) {
                var me = this,
                    dom = me.dom;

                if (dom) {
                    className = className.replace(trimRe, '');
                    if (className) {
                        dom.classList.toggle(className);
                    }
                }

                return me;
            } :
            function(className) {
                var me = this;
                return me.hasCls(className) ? me.removeCls(className) : me.addCls(className);
            },

        
        hasCls: hasClassList ?
            function (className) {
                var dom = this.dom;
                return (dom && className) ? dom.classList.contains(className) : false;
            } :
            function(className) {
                var dom = this.dom;
                return dom ? className && (' '+dom.className+' ').indexOf(' '+className+' ') != -1 : false;
            },

        
        replaceCls: function(oldClassName, newClassName){
            return this.removeCls(oldClassName).addCls(newClassName);
        },

        
        isStyle: function(style, val) {
            return this.getStyle(style) == val;
        },

        
        getStyle: function(prop) {
            var me = this,
                dom = me.dom,
                hook = me.styleHooks[prop],
                cs, result;

            if (dom == document) {
                return null;
            }
            if (!hook) {
                me.styleHooks[prop] = hook = { name: Element.normalize(prop) };
            }
            if (hook.get) {
                return hook.get(dom, me);
            }

            cs = view.getComputedStyle(dom, '');

            
            
            result = (cs && cs[hook.name]); 

            
            if (!supportsTransparentColor && result == 'rgba(0, 0, 0, 0)') {
                result = 'transparent';
            }
            
            

            return result;
        },

        
        isTransparent: function (prop) {
            var value = this.getStyle(prop);
            return value ? transparentRe.test(value) : false;
        },

        
        setStyle: function(prop, value) {
            var me = this,
                dom = me.dom,
                hooks = me.styleHooks,
                style = dom.style,
                name = prop,
                hook;

            
            if (typeof name == 'string') {
                hook = hooks[name];
                if (!hook) {
                    hooks[name] = hook = { name: Element.normalize(name) };
                }
                value = (value == null) ? '' : value;
                if (hook.set) {
                    hook.set(dom, value, me);
                } else {
                    style[hook.name] = value;
                }
            } else {
                for (name in prop) {
                    if (prop.hasOwnProperty(name)) {
                        hook = hooks[name];
                        if (!hook) {
                            hooks[name] = hook = { name: Element.normalize(name) };
                        }
                        value = prop[name];
                        value = (value == null) ? '' : value;
                        if (hook.set) {
                            hook.set(dom, value, me);
                        } else {
                            style[hook.name] = value;
                        }
                    }
                }
            }

            return me;
        },

        
        getHeight: function(contentHeight) {
            var dom = this.dom,
                height = contentHeight ? (dom.clientHeight - this.getPadding("tb")) : dom.offsetHeight;
            return height > 0 ? height: 0;
        },

        
        getWidth: function(contentWidth) {
            var dom = this.dom,
                width = contentWidth ? (dom.clientWidth - this.getPadding("lr")) : dom.offsetWidth;
            return width > 0 ? width: 0;
        },

        
        setWidth: function(width) {
            var me = this;
                me.dom.style.width = Element.addUnits(width);
            return me;
        },

        
        setHeight: function(height) {
            var me = this;
                me.dom.style.height = Element.addUnits(height);
            return me;
        },

        
        getBorderWidth: function(side){
            return this.addStyles(side, borders);
        },

        
        getPadding: function(side){
            return this.addStyles(side, paddings);
        },

        margins : margins,

        
        applyStyles: function(styles) {
            if (styles) {
                var i,
                    len,
                    dom = this.dom;

                if (typeof styles == 'function') {
                    styles = styles.call();
                }
                if (typeof styles == 'string') {
                    styles = Ext.util.Format.trim(styles).split(/\s*(?::|;)\s*/);
                    for (i = 0, len = styles.length; i < len;) {
                        dom.style[Element.normalize(styles[i++])] = styles[i++];
                    }
                }
                else if (typeof styles == 'object') {
                    this.setStyle(styles);
                }
            }
        },

        
        setSize: function(width, height) {
            var me = this,
                style = me.dom.style;

            if (Ext.isObject(width)) {
                
                height = width.height;
                width = width.width;
            }

            style.width = Element.addUnits(width);
            style.height = Element.addUnits(height);
            return me;
        },

        
        getViewSize: function() {
            var doc = document,
                dom = this.dom;

            if (dom == doc || dom == doc.body) {
                return {
                    width: Element.getViewportWidth(),
                    height: Element.getViewportHeight()
                };
            }
            else {
                return {
                    width: dom.clientWidth,
                    height: dom.clientHeight
                };
            }
        },

        
        getSize: function(contentSize) {
            var dom = this.dom;
            return {
                width: Math.max(0, contentSize ? (dom.clientWidth - this.getPadding("lr")) : dom.offsetWidth),
                height: Math.max(0, contentSize ? (dom.clientHeight - this.getPadding("tb")) : dom.offsetHeight)
            };
        },

        
        repaint: function(){
            var dom = this.dom;
            this.addCls(Ext.baseCSSPrefix + 'repaint');
            setTimeout(function(){
                Ext.fly(dom).removeCls(Ext.baseCSSPrefix + 'repaint');
            }, 1);
            return this;
        },

        
        getMargin: function(side){
            var me = this,
                hash = {t:"top", l:"left", r:"right", b: "bottom"},
                o = {},
                key;

            if (!side) {
                for (key in me.margins){
                    o[hash[key]] = parseFloat(me.getStyle(me.margins[key])) || 0;
                }
                return o;
            } else {
                return me.addStyles.call(me, side, me.margins);
            }
        },

        
        mask: function(msg, msgCls, transparent) {
            var me = this,
                dom = me.dom,
                data = (me.$cache || me.getCache()).data,
                el = data.mask,
                mask,
                size,
                cls = '',
                prefix = Ext.baseCSSPrefix;

            me.addCls(prefix + 'masked');
            if (me.getStyle("position") == "static") {
                me.addCls(prefix + 'masked-relative');
            }
            if (el) {
                el.remove();
            }
            if (Ext.isString(msgCls) && !Ext.isEmpty(msgCls)) {
                cls = ' ' + msgCls;
            }
            else {
                if (msgCls) {
                    cls = ' ' + prefix + 'mask-gray';
                }
            }

            mask = me.createChild({
                cls: prefix + 'mask' + ((transparent !== false) ? '' : (' ' + prefix + 'mask-gray')),
                html: msg ? ('<div class="' + (msgCls || (prefix + 'mask-message')) + '">' + msg + '</div>') : ''
            });

            size = me.getSize();

            data.mask = mask;

            if (dom === document.body) {
                size.height = window.innerHeight;
                if (me.orientationHandler) {
                    Ext.EventManager.unOrientationChange(me.orientationHandler, me);
                }

                me.orientationHandler = function() {
                    size = me.getSize();
                    size.height = window.innerHeight;
                    mask.setSize(size);
                };

                Ext.EventManager.onOrientationChange(me.orientationHandler, me);
            }
            mask.setSize(size);
            if (Ext.is.iPad) {
                Ext.repaint();
            }
        },

        
        unmask: function() {
            var me = this,
                data = (me.$cache || me.getCache()).data,
                mask = data.mask,
                prefix = Ext.baseCSSPrefix;

            if (mask) {
                mask.remove();
                delete data.mask;
            }
            me.removeCls([prefix + 'masked', prefix + 'masked-relative']);

            if (me.dom === document.body) {
                Ext.EventManager.unOrientationChange(me.orientationHandler, me);
                delete me.orientationHandler;
            }
        }
    });

    
    Element.populateStyleMap = function (map, order) {
        var baseStyles = ['margin-', 'padding-', 'border-width-'],
            beforeAfter = ['before', 'after'],
            index, style, name, i;

        for (index = baseStyles.length; index--; ) {
            for (i = 2; i--; ) {
                style = baseStyles[index] + beforeAfter[i]; 
                
                map[Element.normalize(style)] = map[style] = {
                    name: Element.normalize(baseStyles[index] + order[i])
                };
            }
        }
    };
})();

Ext.onReady(function () {
    var view = document.defaultView,
        Element = Ext.dom.AbstractElement,
        supports = Ext.supports;

    function fixRightMargin (dom) {
        var cs = view.getComputedStyle(dom, ''),
            result = cs ? cs.marginRight : null,
            style, display;

        
        
        if (result != '0px') {
            style = dom.style;
            display = style.display;
            style.display = 'inline-block';
            result = view.getComputedStyle(dom, null).marginRight;
            style.display = display;
        }

        return result;
    }

    function fixRightMarginAndInputFocus (dom) {
        var cs = view.getComputedStyle(dom, ''),
            result = cs ? cs.marginRight : null,
            style, cleaner, display;

        if (result != '0px') {
            style = dom.style;
            cleaner = Element.getRightMarginFixCleaner(dom);
            display = style.display;
            style.display = 'inline-block';
            result = view.getComputedStyle(dom, '').marginRight;
            style.display = display;
            cleaner();
        }

        return result;
    }

    var styleHooks = Element.prototype.styleHooks;

    
    Element.populateStyleMap(styleHooks, ['left', 'right']);

    
    
    if (supports.init) {
        supports.init();
    }

    
    if (!supports.RightMargin) {
        styleHooks['margin-right'] = styleHooks.marginRight = {
            name: 'marginRight',
            
            
            get: (supports.DisplayChangeInputSelectionBug || supports.DisplayChangeTextAreaSelectionBug) ?
                    fixRightMarginAndInputFocus : fixRightMargin
        };
    }
});


Ext.dom.AbstractElement.override({
    
    findParent: function(simpleSelector, limit, returnEl) {
        var target = this.dom,
            topmost = document.documentElement,
            depth = 0,
            stopEl;

        limit = limit || 50;
        if (isNaN(limit)) {
            stopEl = Ext.getDom(limit);
            limit = Number.MAX_VALUE;
        }
        while (target && target.nodeType == 1 && depth < limit && target != topmost && target != stopEl) {
            if (Ext.DomQuery.is(target, simpleSelector)) {
                return returnEl ? Ext.get(target) : target;
            }
            depth++;
            target = target.parentNode;
        }
        return null;
    },

    
    findParentNode: function(simpleSelector, limit, returnEl) {
        var p = Ext.fly(this.dom.parentNode, '_internal');
        return p ? p.findParent(simpleSelector, limit, returnEl) : null;
    },

    
    up: function(simpleSelector, limit) {
        return this.findParentNode(simpleSelector, limit, true);
    },

    
    select: function(selector, composite) {
        return Ext.dom.Element.select(selector, this.dom, composite);
    },

    
    query: function(selector) {
        return Ext.DomQuery.select(selector, this.dom);
    },

    
    down: function(selector, returnDom) {
        var n = Ext.DomQuery.selectNode(selector, this.dom);
        return returnDom ? n : Ext.get(n);
    },

    
    child: function(selector, returnDom) {
        var node,
            me = this,
            id;
        id = Ext.get(me).id;
        
        id = id.replace(/[\.:]/g, "\\$0");
        node = Ext.DomQuery.selectNode('#' + id + " > " + selector, me.dom);
        return returnDom ? node : Ext.get(node);
    },

     
    parent: function(selector, returnDom) {
        return this.matchNode('parentNode', 'parentNode', selector, returnDom);
    },

     
    next: function(selector, returnDom) {
        return this.matchNode('nextSibling', 'nextSibling', selector, returnDom);
    },

    
    prev: function(selector, returnDom) {
        return this.matchNode('previousSibling', 'previousSibling', selector, returnDom);
    },


    
    first: function(selector, returnDom) {
        return this.matchNode('nextSibling', 'firstChild', selector, returnDom);
    },

    
    last: function(selector, returnDom) {
        return this.matchNode('previousSibling', 'lastChild', selector, returnDom);
    },

    matchNode: function(dir, start, selector, returnDom) {
        if (!this.dom) {
            return null;
        }

        var n = this.dom[start];
        while (n) {
            if (n.nodeType == 1 && (!selector || Ext.DomQuery.is(n, selector))) {
                return !returnDom ? Ext.get(n) : n;
            }
            n = n[dir];
        }
        return null;
    },

    isAncestor: function(element) {
        return this.self.isAncestor.call(this.self, this.dom, element);
    }
});


(function() {


var afterbegin = 'afterbegin',
    afterend = 'afterend',
    beforebegin = 'beforebegin',
    beforeend = 'beforeend',
    ts = '<table>',
    te = '</table>',
    tbs = ts+'<tbody>',
    tbe = '</tbody>'+te,
    trs = tbs + '<tr>',
    tre = '</tr>'+tbe;

Ext.define('Ext.dom.Helper', {
    extend: 'Ext.dom.AbstractHelper',

    tempTableEl: null,

    tableRe: /^table|tbody|tr|td$/i,

    tableElRe: /td|tr|tbody/i,

    
    useDom : false,

    
    createDom: function(o, parentNode){
        var el,
            doc = document,
            useSet,
            attr,
            val,
            cn;

        if (Ext.isArray(o)) {                       
            el = doc.createDocumentFragment(); 
            for (var i = 0, l = o.length; i < l; i++) {
                this.createDom(o[i], el);
            }
        } else if (typeof o == 'string') {         
            el = doc.createTextNode(o);
        } else {
            el = doc.createElement(o.tag || 'div');
            useSet = !!el.setAttribute; 
            for (attr in o) {
                if (!this.confRe.test(attr)) {
                    val = o[attr];
                    if (attr == 'cls') {
                        el.className = val;
                    } else {
                        if (useSet) {
                            el.setAttribute(attr, val);
                        } else {
                            el[attr] = val;
                        }
                    }
                }
            }
            Ext.DomHelper.applyStyles(el, o.style);

            if ((cn = o.children || o.cn)) {
                this.createDom(cn, el);
            } else if (o.html) {
                el.innerHTML = o.html;
            }
        }
        if (parentNode) {
            parentNode.appendChild(el);
        }
        return el;
    },

    ieTable: function(depth, s, h, e){
        this.tempTableEl.innerHTML = [s, h, e].join('');

        var i = -1,
            el = this.tempTableEl,
            ns;

        while (++i < depth) {
            el = el.firstChild;
        }
        
        ns = el.nextSibling;

        if (ns) {
            var df = document.createDocumentFragment();
            while (el) {
                ns = el.nextSibling;
                df.appendChild(el);
                el = ns;
            }
            el = df;
        }

        return el;
    },


    
    insertIntoTable: function(tag, where, el, html) {
        var node,
            before;

        this.tempTableEl = this.tempTableEl || document.createElement('div');

        if (tag == 'td' && (where == afterbegin || where == beforeend) ||
                !this.tableElRe.test(tag) && (where == beforebegin || where == afterend)) {
            return null;
        }
        before = where == beforebegin ? el :
                where == afterend ? el.nextSibling :
                        where == afterbegin ? el.firstChild : null;

        if (where == beforebegin || where == afterend) {
            el = el.parentNode;
        }

        if (tag == 'td' || (tag == 'tr' && (where == beforeend || where == afterbegin))) {
            node = this.ieTable(4, trs, html, tre);
        } else if ((tag == 'tbody' && (where == beforeend || where == afterbegin)) ||
                (tag == 'tr' && (where == beforebegin || where == afterend))) {
            node = this.ieTable(3, tbs, html, tbe);
        } else {
            node = this.ieTable(2, ts, html, te);
        }
        el.insertBefore(node, before);
        return node;
    },

    
    createContextualFragment: function(html){
        var div = document.createElement("div"),
            fragment = document.createDocumentFragment(),
            i = 0,
            length, childNodes;

        div.innerHTML = html;
        childNodes = div.childNodes;
        length = childNodes.length;

        for (; i < length; i++) {
            fragment.appendChild(childNodes[i].cloneNode(true));
        }

        return fragment;
    },

    applyStyles: function(el, styles) {
        if (styles) {
            el = Ext.fly(el);
            if (typeof styles == "function") {
                styles = styles.call();
            }
            if (typeof styles == "string") {
                styles = Ext.dom.Element.parseStyles(styles);
            }
            if (typeof styles == "object") {
                el.setStyle(styles);
            }
        }
    },

    
    createHtml: function(spec) {
        return this.markup(spec);
    },

    doInsert: function(el, o, returnElement, pos, sibling, append) {
        
        el = el.dom || Ext.getDom(el);

        var newNode;

        if (this.useDom) {
            newNode = this.createDom(o, null);

            if (append) {
                el.appendChild(newNode);
            }
            else {
                (sibling == 'firstChild' ? el : el.parentNode).insertBefore(newNode, el[sibling] || el);
            }

        } else {
            newNode = this.insertHtml(pos, el, this.markup(o));
        }
        return returnElement ? Ext.get(newNode, true) : newNode;
    },

    insertHtml: function(where, el, html) {
        var hash = {},
            hashVal,
            range,
            rangeEl,
            setStart,
            frag,
            rs;

        where = where.toLowerCase();
        
        hash[beforebegin] = ['BeforeBegin', 'previousSibling'];
        hash[afterend] = ['AfterEnd', 'nextSibling'];

        
        if (el.insertAdjacentHTML) {
            if (this.tableRe.test(el.tagName) && (rs = this.insertIntoTable(el.tagName.toLowerCase(), where, el, html))) {
                return rs;
            }

            
            hash[afterbegin] = ['AfterBegin', 'firstChild'];
            hash[beforeend] = ['BeforeEnd', 'lastChild'];
            if ((hashVal = hash[where])) {
                el.insertAdjacentHTML(hashVal[0], html);
                return el[hashVal[1]];
            }
            
        } else {
            
            if (Ext.isTextNode(el)) {
                where = where === 'afterbegin' ? 'beforebegin' : where;
                where = where === 'beforeend' ? 'afterend' : where;
            }
            range = Ext.supports.CreateContextualFragment ? el.ownerDocument.createRange() : undefined;
            setStart = 'setStart' + (this.endRe.test(where) ? 'After' : 'Before');
            if (hash[where]) {
                if (range) {
                    range[setStart](el);
                    frag = range.createContextualFragment(html);
                } else {
                    frag = this.createContextualFragment(html);
                }
                el.parentNode.insertBefore(frag, where == beforebegin ? el : el.nextSibling);
                return el[(where == beforebegin ? 'previous' : 'next') + 'Sibling'];
            } else {
                rangeEl = (where == afterbegin ? 'first' : 'last') + 'Child';
                if (el.firstChild) {
                    if (range) {
                        range[setStart](el[rangeEl]);
                        frag = range.createContextualFragment(html);
                    } else {
                        frag = this.createContextualFragment(html);
                    }

                    if (where == afterbegin) {
                        el.insertBefore(frag, el.firstChild);
                    } else {
                        el.appendChild(frag);
                    }
                } else {
                    el.innerHTML = html;
                }
                return el[rangeEl];
            }
        }
    },

    
    createTemplate: function(o) {
        var html = this.markup(o);
        return new Ext.Template(html);
    }

}, function() {
    Ext.ns('Ext.core');
    Ext.DomHelper = Ext.core.DomHelper = new this;
});


})();



Ext.ns('Ext.core');

Ext.dom.Query = Ext.core.DomQuery = Ext.DomQuery = function(){
    var cache = {},
        simpleCache = {},
        valueCache = {},
        nonSpace = /\S/,
        trimRe = /^\s+|\s+$/g,
        tplRe = /\{(\d+)\}/g,
        modeRe = /^(\s?[\/>+~]\s?|\s|$)/,
        tagTokenRe = /^(#)?([\w\-\*]+)/,
        nthRe = /(\d*)n\+?(\d*)/,
        nthRe2 = /\D/,
        startIdRe = /^\s*\#/,
        
    
    
    isIE = window.ActiveXObject ? true : false,
    key = 30803;

    
    
    eval("var batch = 30803;");

    
    
    function child(parent, index){
        var i = 0,
            n = parent.firstChild;
        while(n){
            if(n.nodeType == 1){
               if(++i == index){
                   return n;
               }
            }
            n = n.nextSibling;
        }
        return null;
    }

    
    function next(n){
        while((n = n.nextSibling) && n.nodeType != 1);
        return n;
    }

    
    function prev(n){
        while((n = n.previousSibling) && n.nodeType != 1);
        return n;
    }

    
    
    function children(parent){
        var n = parent.firstChild,
        nodeIndex = -1,
        nextNode;
        while(n){
            nextNode = n.nextSibling;
            
            if(n.nodeType == 3 && !nonSpace.test(n.nodeValue)){
            parent.removeChild(n);
            }else{
            
            n.nodeIndex = ++nodeIndex;
            }
            n = nextNode;
        }
        return this;
    }


    
    
    function byClassName(nodeSet, cls){
        if(!cls){
            return nodeSet;
        }
        var result = [], ri = -1;
        for(var i = 0, ci; ci = nodeSet[i]; i++){
            if((' '+ci.className+' ').indexOf(cls) != -1){
                result[++ri] = ci;
            }
        }
        return result;
    };

    function attrValue(n, attr){
        
        if(!n.tagName && typeof n.length != "undefined"){
            n = n[0];
        }
        if(!n){
            return null;
        }

        if(attr == "for"){
            return n.htmlFor;
        }
        if(attr == "class" || attr == "className"){
            return n.className;
        }
        return n.getAttribute(attr) || n[attr];

    };


    
    
    
    function getNodes(ns, mode, tagName){
        var result = [], ri = -1, cs;
        if(!ns){
            return result;
        }
        tagName = tagName || "*";
        
        if(typeof ns.getElementsByTagName != "undefined"){
            ns = [ns];
        }

        
        
        if(!mode){
            for(var i = 0, ni; ni = ns[i]; i++){
                cs = ni.getElementsByTagName(tagName);
                for(var j = 0, ci; ci = cs[j]; j++){
                    result[++ri] = ci;
                }
            }
        
        
        } else if(mode == "/" || mode == ">"){
            var utag = tagName.toUpperCase();
            for(var i = 0, ni, cn; ni = ns[i]; i++){
                cn = ni.childNodes;
                for(var j = 0, cj; cj = cn[j]; j++){
                    if(cj.nodeName == utag || cj.nodeName == tagName  || tagName == '*'){
                        result[++ri] = cj;
                    }
                }
            }
        
        
        }else if(mode == "+"){
            var utag = tagName.toUpperCase();
            for(var i = 0, n; n = ns[i]; i++){
                while((n = n.nextSibling) && n.nodeType != 1);
                if(n && (n.nodeName == utag || n.nodeName == tagName || tagName == '*')){
                    result[++ri] = n;
                }
            }
        
        
        }else if(mode == "~"){
            var utag = tagName.toUpperCase();
            for(var i = 0, n; n = ns[i]; i++){
                while((n = n.nextSibling)){
                    if (n.nodeName == utag || n.nodeName == tagName || tagName == '*'){
                        result[++ri] = n;
                    }
                }
            }
        }
        return result;
    }

    function concat(a, b){
        if(b.slice){
            return a.concat(b);
        }
        for(var i = 0, l = b.length; i < l; i++){
            a[a.length] = b[i];
        }
        return a;
    }

    function byTag(cs, tagName){
        if(cs.tagName || cs == document){
            cs = [cs];
        }
        if(!tagName){
            return cs;
        }
        var result = [], ri = -1;
        tagName = tagName.toLowerCase();
        for(var i = 0, ci; ci = cs[i]; i++){
            if(ci.nodeType == 1 && ci.tagName.toLowerCase() == tagName){
                result[++ri] = ci;
            }
        }
        return result;
    }

    function byId(cs, id){
        if(cs.tagName || cs == document){
            cs = [cs];
        }
        if(!id){
            return cs;
        }
        var result = [], ri = -1;
        for(var i = 0, ci; ci = cs[i]; i++){
            if(ci && ci.id == id){
                result[++ri] = ci;
                return result;
            }
        }
        return result;
    }

    
    
    function byAttribute(cs, attr, value, op, custom){
        var result = [],
            ri = -1,
            useGetStyle = custom == "{",
            fn = Ext.DomQuery.operators[op],
            a,
            xml,
            hasXml;

        for(var i = 0, ci; ci = cs[i]; i++){
            
            if(ci.nodeType != 1){
                continue;
            }
            
            if(!hasXml){
                xml = Ext.DomQuery.isXml(ci);
                hasXml = true;
            }

            
            if(!xml){
                if(useGetStyle){
                    a = Ext.DomQuery.getStyle(ci, attr);
                } else if (attr == "class" || attr == "className"){
                    a = ci.className;
                } else if (attr == "for"){
                    a = ci.htmlFor;
                } else if (attr == "href"){
                    
                    
                    a = ci.getAttribute("href", 2);
                } else{
                    a = ci.getAttribute(attr);
                }
            }else{
                a = ci.getAttribute(attr);
            }
            if((fn && fn(a, value)) || (!fn && a)){
                result[++ri] = ci;
            }
        }
        return result;
    }

    function byPseudo(cs, name, value){
        return Ext.DomQuery.pseudos[name](cs, value);
    }

    function nodupIEXml(cs){
        var d = ++key,
            r;
        cs[0].setAttribute("_nodup", d);
        r = [cs[0]];
        for(var i = 1, len = cs.length; i < len; i++){
            var c = cs[i];
            if(!c.getAttribute("_nodup") != d){
                c.setAttribute("_nodup", d);
                r[r.length] = c;
            }
        }
        for(var i = 0, len = cs.length; i < len; i++){
            cs[i].removeAttribute("_nodup");
        }
        return r;
    }

    function nodup(cs){
        if(!cs){
            return [];
        }
        var len = cs.length, c, i, r = cs, cj, ri = -1;
        if(!len || typeof cs.nodeType != "undefined" || len == 1){
            return cs;
        }
        if(isIE && typeof cs[0].selectSingleNode != "undefined"){
            return nodupIEXml(cs);
        }
        var d = ++key;
        cs[0]._nodup = d;
        for(i = 1; c = cs[i]; i++){
            if(c._nodup != d){
                c._nodup = d;
            }else{
                r = [];
                for(var j = 0; j < i; j++){
                    r[++ri] = cs[j];
                }
                for(j = i+1; cj = cs[j]; j++){
                    if(cj._nodup != d){
                        cj._nodup = d;
                        r[++ri] = cj;
                    }
                }
                return r;
            }
        }
        return r;
    }

    function quickDiffIEXml(c1, c2){
        var d = ++key,
            r = [];
        for(var i = 0, len = c1.length; i < len; i++){
            c1[i].setAttribute("_qdiff", d);
        }
        for(var i = 0, len = c2.length; i < len; i++){
            if(c2[i].getAttribute("_qdiff") != d){
                r[r.length] = c2[i];
            }
        }
        for(var i = 0, len = c1.length; i < len; i++){
           c1[i].removeAttribute("_qdiff");
        }
        return r;
    }

    function quickDiff(c1, c2){
        var len1 = c1.length,
            d = ++key,
            r = [];
        if(!len1){
            return c2;
        }
        if(isIE && typeof c1[0].selectSingleNode != "undefined"){
            return quickDiffIEXml(c1, c2);
        }
        for(var i = 0; i < len1; i++){
            c1[i]._qdiff = d;
        }
        for(var i = 0, len = c2.length; i < len; i++){
            if(c2[i]._qdiff != d){
                r[r.length] = c2[i];
            }
        }
        return r;
    }

    function quickId(ns, mode, root, id){
        if(ns == root){
           var d = root.ownerDocument || root;
           return d.getElementById(id);
        }
        ns = getNodes(ns, mode, "*");
        return byId(ns, id);
    }

    return {
        getStyle : function(el, name){
            return Ext.fly(el).getStyle(name);
        },
        
        compile : function(path, type){
            type = type || "select";

            
            var fn = ["var f = function(root){\n var mode; ++batch; var n = root || document;\n"],
                mode,
                lastPath,
                matchers = Ext.DomQuery.matchers,
                matchersLn = matchers.length,
                modeMatch,
                
                lmode = path.match(modeRe);

            if(lmode && lmode[1]){
                fn[fn.length] = 'mode="'+lmode[1].replace(trimRe, "")+'";';
                path = path.replace(lmode[1], "");
            }

            
            while(path.substr(0, 1)=="/"){
                path = path.substr(1);
            }

            while(path && lastPath != path){
                lastPath = path;
                var tokenMatch = path.match(tagTokenRe);
                if(type == "select"){
                    if(tokenMatch){
                        
                        if(tokenMatch[1] == "#"){
                            fn[fn.length] = 'n = quickId(n, mode, root, "'+tokenMatch[2]+'");';
                        }else{
                            fn[fn.length] = 'n = getNodes(n, mode, "'+tokenMatch[2]+'");';
                        }
                        path = path.replace(tokenMatch[0], "");
                    }else if(path.substr(0, 1) != '@'){
                        fn[fn.length] = 'n = getNodes(n, mode, "*");';
                    }
                
                }else{
                    if(tokenMatch){
                        if(tokenMatch[1] == "#"){
                            fn[fn.length] = 'n = byId(n, "'+tokenMatch[2]+'");';
                        }else{
                            fn[fn.length] = 'n = byTag(n, "'+tokenMatch[2]+'");';
                        }
                        path = path.replace(tokenMatch[0], "");
                    }
                }
                while(!(modeMatch = path.match(modeRe))){
                    var matched = false;
                    for(var j = 0; j < matchersLn; j++){
                        var t = matchers[j];
                        var m = path.match(t.re);
                        if(m){
                            fn[fn.length] = t.select.replace(tplRe, function(x, i){
                                return m[i];
                            });
                            path = path.replace(m[0], "");
                            matched = true;
                            break;
                        }
                    }
                    
                    if(!matched){
                    }
                }
                if(modeMatch[1]){
                    fn[fn.length] = 'mode="'+modeMatch[1].replace(trimRe, "")+'";';
                    path = path.replace(modeMatch[1], "");
                }
            }
            
            fn[fn.length] = "return nodup(n);\n}";

            
            eval(fn.join(""));
            return f;
        },

        
        jsSelect: function(path, root, type){
            
            root = root || document;

            if(typeof root == "string"){
                root = document.getElementById(root);
            }
            var paths = path.split(","),
                results = [];

            
            for(var i = 0, len = paths.length; i < len; i++){
                var subPath = paths[i].replace(trimRe, "");
                
                if(!cache[subPath]){
                    cache[subPath] = Ext.DomQuery.compile(subPath);
                    if(!cache[subPath]){
                    }
                }
                var result = cache[subPath](root);
                if(result && result != document){
                    results = results.concat(result);
                }
            }

            
            
            if(paths.length > 1){
                return nodup(results);
            }
            return results;
        },

        isXml: function(el) {
            var docEl = (el ? el.ownerDocument || el : 0).documentElement;
            return docEl ? docEl.nodeName !== "HTML" : false;
        },

        
        select : document.querySelectorAll ? function(path, root, type) {
            root = root || document;
            if (!Ext.DomQuery.isXml(root)) {
                try {
                    
                    if (root.parentNode && (root.nodeType !== 9) && path.indexOf(',') === -1 && !startIdRe.test(path)) {
                        path = '#' + Ext.id(root) + ' ' + path;
                        root = root.parentNode;
                    }
                    return Ext.Array.toArray(root.querySelectorAll(path));
                }
                catch (e) {
                }
            }
            return Ext.DomQuery.jsSelect.call(this, path, root, type);
        } : function(path, root, type) {
            return Ext.DomQuery.jsSelect.call(this, path, root, type);
        },

        
        selectNode : function(path, root){
            return Ext.DomQuery.select(path, root)[0];
        },

        
        selectValue : function(path, root, defaultValue){
            path = path.replace(trimRe, "");
            if(!valueCache[path]){
                valueCache[path] = Ext.DomQuery.compile(path, "select");
            }
            var n = valueCache[path](root), v;
            n = n[0] ? n[0] : n;

            
            
            
            
            if (typeof n.normalize == 'function') n.normalize();

            v = (n && n.firstChild ? n.firstChild.nodeValue : null);
            return ((v === null||v === undefined||v==='') ? defaultValue : v);
        },

        
        selectNumber : function(path, root, defaultValue){
            var v = Ext.DomQuery.selectValue(path, root, defaultValue || 0);
            return parseFloat(v);
        },

        
        is : function(el, ss){
            if(typeof el == "string"){
                el = document.getElementById(el);
            }
            var isArray = Ext.isArray(el),
                result = Ext.DomQuery.filter(isArray ? el : [el], ss);
            return isArray ? (result.length == el.length) : (result.length > 0);
        },

        
        filter : function(els, ss, nonMatches){
            ss = ss.replace(trimRe, "");
            if(!simpleCache[ss]){
                simpleCache[ss] = Ext.DomQuery.compile(ss, "simple");
            }
            var result = simpleCache[ss](els);
            return nonMatches ? quickDiff(result, els) : result;
        },

        
        matchers : [{
                re: /^\.([\w-]+)/,
                select: 'n = byClassName(n, " {1} ");'
            }, {
                re: /^\:([\w-]+)(?:\(((?:[^\s>\/]*|.*?))\))?/,
                select: 'n = byPseudo(n, "{1}", "{2}");'
            },{
                re: /^(?:([\[\{])(?:@)?([\w-]+)\s?(?:(=|.=)\s?['"]?(.*?)["']?)?[\]\}])/,
                select: 'n = byAttribute(n, "{2}", "{4}", "{3}", "{1}");'
            }, {
                re: /^#([\w-]+)/,
                select: 'n = byId(n, "{1}");'
            },{
                re: /^@([\w-]+)/,
                select: 'return {firstChild:{nodeValue:attrValue(n, "{1}")}};'
            }
        ],

        
        operators : {
            "=" : function(a, v){
                return a == v;
            },
            "!=" : function(a, v){
                return a != v;
            },
            "^=" : function(a, v){
                return a && a.substr(0, v.length) == v;
            },
            "$=" : function(a, v){
                return a && a.substr(a.length-v.length) == v;
            },
            "*=" : function(a, v){
                return a && a.indexOf(v) !== -1;
            },
            "%=" : function(a, v){
                return (a % v) == 0;
            },
            "|=" : function(a, v){
                return a && (a == v || a.substr(0, v.length+1) == v+'-');
            },
            "~=" : function(a, v){
                return a && (' '+a+' ').indexOf(' '+v+' ') != -1;
            }
        },

        
        pseudos : {
            "first-child" : function(c){
                var r = [], ri = -1, n;
                for(var i = 0, ci; ci = n = c[i]; i++){
                    while((n = n.previousSibling) && n.nodeType != 1);
                    if(!n){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "last-child" : function(c){
                var r = [], ri = -1, n;
                for(var i = 0, ci; ci = n = c[i]; i++){
                    while((n = n.nextSibling) && n.nodeType != 1);
                    if(!n){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "nth-child" : function(c, a) {
                var r = [], ri = -1,
                    m = nthRe.exec(a == "even" && "2n" || a == "odd" && "2n+1" || !nthRe2.test(a) && "n+" + a || a),
                    f = (m[1] || 1) - 0, l = m[2] - 0;
                for(var i = 0, n; n = c[i]; i++){
                    var pn = n.parentNode;
                    if (batch != pn._batch) {
                        var j = 0;
                        for(var cn = pn.firstChild; cn; cn = cn.nextSibling){
                            if(cn.nodeType == 1){
                               cn.nodeIndex = ++j;
                            }
                        }
                        pn._batch = batch;
                    }
                    if (f == 1) {
                        if (l == 0 || n.nodeIndex == l){
                            r[++ri] = n;
                        }
                    } else if ((n.nodeIndex + l) % f == 0){
                        r[++ri] = n;
                    }
                }

                return r;
            },

            "only-child" : function(c){
                var r = [], ri = -1;;
                for(var i = 0, ci; ci = c[i]; i++){
                    if(!prev(ci) && !next(ci)){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "empty" : function(c){
                var r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    var cns = ci.childNodes, j = 0, cn, empty = true;
                    while(cn = cns[j]){
                        ++j;
                        if(cn.nodeType == 1 || cn.nodeType == 3){
                            empty = false;
                            break;
                        }
                    }
                    if(empty){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "contains" : function(c, v){
                var r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    if((ci.textContent||ci.innerText||'').indexOf(v) != -1){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "nodeValue" : function(c, v){
                var r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    if(ci.firstChild && ci.firstChild.nodeValue == v){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "checked" : function(c){
                var r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    if(ci.checked == true){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "not" : function(c, ss){
                return Ext.DomQuery.filter(c, ss, true);
            },

            "any" : function(c, selectors){
                var ss = selectors.split('|'),
                    r = [], ri = -1, s;
                for(var i = 0, ci; ci = c[i]; i++){
                    for(var j = 0; s = ss[j]; j++){
                        if(Ext.DomQuery.is(ci, s)){
                            r[++ri] = ci;
                            break;
                        }
                    }
                }
                return r;
            },

            "odd" : function(c){
                return this["nth-child"](c, "odd");
            },

            "even" : function(c){
                return this["nth-child"](c, "even");
            },

            "nth" : function(c, a){
                return c[a-1] || [];
            },

            "first" : function(c){
                return c[0] || [];
            },

            "last" : function(c){
                return c[c.length-1] || [];
            },

            "has" : function(c, ss){
                var s = Ext.DomQuery.select,
                    r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    if(s(ss, ci).length > 0){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "next" : function(c, ss){
                var is = Ext.DomQuery.is,
                    r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    var n = next(ci);
                    if(n && is(n, ss)){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "prev" : function(c, ss){
                var is = Ext.DomQuery.is,
                    r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    var n = prev(ci);
                    if(n && is(n, ss)){
                        r[++ri] = ci;
                    }
                }
                return r;
            }
        }
    };
}();


Ext.query = Ext.DomQuery.select;



(function() {

var HIDDEN = 'hidden',
    DOC             = document,
    VISIBILITY      = "visibility",
    DISPLAY         = "display",
    NONE            = "none",
    XMASKED         = Ext.baseCSSPrefix + "masked",
    XMASKEDRELATIVE = Ext.baseCSSPrefix + "masked-relative",
    EXTELMASKMSG    = Ext.baseCSSPrefix + "mask-msg",
    bodyRe          = /^body/i,


    noBoxAdjust = Ext.isStrict ? {
        select: 1
    }: {
        input: 1,
        select: 1,
        textarea: 1
    },

    Element = Ext.define('Ext.dom.Element', {

    extend: 'Ext.dom.AbstractElement',

    alternateClassName: ['Ext.Element', 'Ext.core.Element'],

    addUnits: function() {
        return this.self.addUnits.apply(this.self, arguments);
    },

    
    focus: function(defer,  dom) {
        var me = this,
            scrollTop;

        dom = dom || me.dom;
        try {
            if (Number(defer)) {
                Ext.defer(me.focus, defer, null, [null, dom]);
            } else {
                
                
                
                if (dom.offsetHeight > Element.getViewHeight()) {
                    scrollTop = DOC.body.scrollTop;
                }
                dom.focus();
                if (scrollTop !== undefined) {
                    DOC.body.scrollTop = scrollTop;
                }
            }
        } catch(e) {
        }
        return me;
    },

    
    blur: function() {
        try {
            this.dom.blur();
        } catch(e) {
        }
        return this;
    },

    
    isBorderBox: function() {
        return Ext.isBorderBox || noBoxAdjust[(this.dom.tagName || "").toLowerCase()];
    },

    
    hover: function(overFn, outFn, scope, options) {
        var me = this;
        me.on('mouseenter', overFn, scope || me.dom, options);
        me.on('mouseleave', outFn, scope || me.dom, options);
        return me;
    },

    
    getAttributeNS: function(ns, name) {
        return this.getAttribute(name, ns);
    },

    getAttribute: (Ext.isIE && !(Ext.isIE9 && DOC.documentMode === 9)) ?
        function(name, ns) {
            var d = this.dom,
                    type;
            if (ns) {
                type = typeof d[ns + ":" + name];
                if (type != 'undefined' && type != 'unknown') {
                    return d[ns + ":" + name] || null;
                }
                return null;
            }
            if (name === "for") {
                name = "htmlFor";
            }
            return d[name] || null;
        } : function(name, ns) {
            var d = this.dom;
            if (ns) {
                return d.getAttributeNS(ns, name) || d.getAttribute(ns + ":" + name);
            }
            return  d.getAttribute(name) || d[name] || null;
        },

    
    autoBoxAdjust: true,

    
    isVisible : function(deep) {
        var vis = !this.isStyle(VISIBILITY, HIDDEN) && !this.isStyle(DISPLAY, NONE),
            p   = this.dom.parentNode;

        if (deep !== true || !vis) {
            return vis;
        }
        while (p && !(bodyRe.test(p.tagName))) {
            if (!Ext.fly(p, '_isVisible').isVisible()) {
                return false;
            }
            p = p.parentNode;
        }
        return true;
    },

    
    isDisplayed : function() {
        return !this.isStyle(DISPLAY, NONE);
    },

    
    enableDisplayMode : function(display) {
        var me = this;
        
        me.setVisibilityMode(Element.DISPLAY);

        if (!Ext.isEmpty(display)) {
            (me.$cache || me.getCache()).data.originalDisplay = display;
        }

        return me;
    },

    
    mask : function(msg, msgCls , elHeight) {
        var me            = this,
            dom           = me.dom,
            setExpression = dom.style.setExpression,
            data          = (me.$cache || me.getCache()).data,
            maskEl        = data.maskEl,
            maskMsg       = data.maskMsg;

        if (!(bodyRe.test(dom.tagName) && me.getStyle('position') == 'static')) {
            me.addCls(XMASKEDRELATIVE);
        }
        
        
        if (maskEl) {
            maskEl.remove();
        }
        
        if (maskMsg) {
            maskMsg.remove();
        }

        Ext.DomHelper.append(dom, [{
            cls : Ext.baseCSSPrefix + "mask"
        }, {
            cls : msgCls ? EXTELMASKMSG + " " + msgCls : EXTELMASKMSG,
            cn  : {
                tag: 'div',
                html: msg || ''
            }
        }]);
            
        maskMsg = Ext.get(dom.lastChild);
        maskEl = Ext.get(maskMsg.dom.previousSibling);
        data.maskMsg = maskMsg;
        data.maskEl = maskEl;

        me.addCls(XMASKED);
        maskEl.setDisplayed(true);

        if (typeof msg == 'string') {
            maskMsg.setDisplayed(true);
            maskMsg.center(me);
        } else {
            maskMsg.setDisplayed(false);
        }
        
        
        
        
        
        if (!Ext.supports.IncludePaddingInWidthCalculation && setExpression) {
            maskEl.dom.style.setExpression('width', 'this.parentNode.clientWidth + "px"');
        }

        
        
        if (!Ext.supports.IncludePaddingInHeightCalculation && setExpression) {
            maskEl.dom.style.setExpression('height', 'this.parentNode.' + (dom == DOC.body ? 'scrollHeight' : 'offsetHeight') + ' + "px"');
        }
        
        else if (Ext.isIE && !(Ext.isIE7 && Ext.isStrict) && me.getStyle('height') == 'auto') {
            maskEl.setSize(undefined, elHeight || me.getHeight());
        }
        return maskEl;
    },

    
    unmask : function() {
        var me      = this,
            data    = (me.$cache || me.getCache()).data,
            maskEl  = data.maskEl,
            maskMsg = data.maskMsg,
            style;

        if (maskEl) {
            style = maskEl.dom.style;
            
            if (style.clearExpression) {
                style.clearExpression('width');
                style.clearExpression('height');
            }
            
            if (maskEl) {
                maskEl.remove();
                delete data.maskEl;
            }
            
            if (maskMsg) {
                maskMsg.remove();
                delete data.maskMsg;
            }
            
            me.removeCls([XMASKED, XMASKEDRELATIVE]);
        }
    },

    
    isMasked : function() {
        var me      = this,
            data    = (me.$cache || me.getCache()).data,
            maskEl  = data.maskEl,
            maskMsg = data.maskMsg,
            hasMask = false; 

        if (maskEl && maskEl.isVisible()) {
            if (maskMsg) {
                maskMsg.center(me);
            }
            hasMask = true;
        }
        return hasMask;
    },

    
    createShim : function() {
        var el = DOC.createElement('iframe'),
            shim;

        el.frameBorder = '0';
        el.className = Ext.baseCSSPrefix + 'shim';
        el.src = Ext.SSL_SECURE_URL;
        shim = Ext.get(this.dom.parentNode.insertBefore(el, this.dom));
        shim.autoBoxAdjust = false;
        return shim;
    },

    
    addKeyListener : function(key, fn, scope){
        var config;
        if(typeof key != 'object' || Ext.isArray(key)){
            config = {
                target: this,
                key: key,
                fn: fn,
                scope: scope
            };
        }else{
            config = {
                target: this,
                key : key.key,
                shift : key.shift,
                ctrl : key.ctrl,
                alt : key.alt,
                fn: fn,
                scope: scope
            };
        }
        return new Ext.util.KeyMap(config);
    },

    
    addKeyMap : function(config) {
        return new Ext.util.KeyMap(Ext.apply({
            target: this
        }, config));
    },

    
    
    
    
    
    
    
    
    
    
    

    
    
    
    

    
    
    
    
    
    
    

    
    
    
    
    
    
    

    
    
    
    

    
    
    
    
    
    
    
    

    
    on: function(eventName, fn, scope, options) {
        Ext.EventManager.on(this, eventName, fn, scope || this, options);
        return this;
    },

    
    un: function(eventName, fn, scope) {
        Ext.EventManager.un(this, eventName, fn, scope || this);
        return this;
    },

    
    removeAllListeners: function() {
        Ext.EventManager.removeAll(this);
        return this;
    },

    
    purgeAllListeners: function() {
        Ext.EventManager.purgeElement(this);
        return this;
    }

}, function() {

    var EC              = Ext.cache,
        El              = this,
        AbstractElement = Ext.dom.AbstractElement,
        focusRe         = /a|button|embed|iframe|img|input|object|select|textarea/i,
        nonSpaceRe      = /\S/,
        scriptTagRe     = /(?:<script([^>]*)?>)((\n|\r|.)*?)(?:<\/script>)/ig,
        replaceScriptTagRe = /(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)/ig,
        srcRe           = /\ssrc=([\'\"])(.*?)\1/i,
        typeRe          = /\stype=([\'\"])(.*?)\1/i,
        useDocForId = !(Ext.isIE6 || Ext.isIE7 || Ext.isIE8);

    El.boxMarkup = '<div class="{0}-tl"><div class="{0}-tr"><div class="{0}-tc"></div></div></div><div class="{0}-ml"><div class="{0}-mr"><div class="{0}-mc"></div></div></div><div class="{0}-bl"><div class="{0}-br"><div class="{0}-bc"></div></div></div>';
    

    
    
    
    function garbageCollect() {
        if (!Ext.enableGarbageCollector) {
            clearInterval(El.collectorThreadId);
        } else {
            var eid,
                el,
                d,
                o;

            for (eid in EC) {
                if (!EC.hasOwnProperty(eid)) {
                    continue;
                }
                o = EC[eid];
                if (o.skipGarbageCollection) {
                    continue;
                }
                el = o.el;
                if (!el) {
                    continue;
                }
                d = el.dom;
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                if (!d || !d.parentNode || (!d.offsetParent && !Ext.getElementById(eid))) {
                    if (d && Ext.enableListenerCollection) {
                        Ext.EventManager.removeAll(d);
                    }
                    delete EC[eid];
                }
            }
            
            if (Ext.isIE) {
                var t = {};
                for (eid in EC) {
                    if (!EC.hasOwnProperty(eid)) {
                        continue;
                    }
                    t[eid] = EC[eid];
                }
                EC = Ext.cache = t;
            }
        }
    }

    El.collectorThreadId = setInterval(garbageCollect, 30000);

    
    El.addMethods({

        
        monitorMouseLeave: function(delay, handler, scope) {
            var me = this,
                timer,
                listeners = {
                    mouseleave: function(e) {
                        timer = setTimeout(Ext.Function.bind(handler, scope||me, [e]), delay);
                    },
                    mouseenter: function() {
                        clearTimeout(timer);
                    },
                    freezeEvent: true
                };

            me.on(listeners);
            return listeners;
        },

        
        swallowEvent : function(eventName, preventDefault) {
            var me = this;
            function fn(e) {
                e.stopPropagation();
                if (preventDefault) {
                    e.preventDefault();
                }
            }

            if (Ext.isArray(eventName)) {
                Ext.each(eventName, function(e) {
                     me.on(e, fn);
                });
                return me;
            }
            me.on(eventName, fn);
            return me;
        },

        
        relayEvent : function(eventName, observable) {
            this.on(eventName, function(e) {
                observable.fireEvent(eventName, e);
            });
        },

        
        clean : function(forceReclean) {
            var me   = this,
                dom  = me.dom,
                data = (me.$cache || me.getCache()).data,
                n    = dom.firstChild,
                ni   = -1,
                nx;

            if (data.isCleaned && forceReclean !== true) {
                return me;
            }

            while (n) {
                nx = n.nextSibling;
                if (n.nodeType == 3) {
                    
                    if (!(nonSpaceRe.test(n.nodeValue))) {
                        dom.removeChild(n);
                    
                    } else if (nx && nx.nodeType == 3) {
                        n.appendData(Ext.String.trim(nx.data));
                        dom.removeChild(nx);
                        nx = n.nextSibling;
                        n.nodeIndex = ++ni;
                    }
                } else {
                    
                    Ext.fly(n).clean();
                    n.nodeIndex = ++ni;
                }
                n = nx;
            }

            data.isCleaned = true;
            return me;
        },

        
        load : function(options) {
            this.getLoader().load(options);
            return this;
        },

        
        getLoader : function() {
            var me = this,
                data = (me.$cache || me.getCache()).data,
                loader = data.loader;

            if (!loader) {
                data.loader = loader = new Ext.ElementLoader({
                    target: me
                });
            }
            return loader;
        },

        
        update : function(html, loadScripts, callback) {
            var me = this,
                id,
                dom,
                interval;

            if (!me.dom) {
                return me;
            }
            html = html || '';
            dom = me.dom;

            if (loadScripts !== true) {
                dom.innerHTML = html;
                Ext.callback(callback, me);
                return me;
            }

            id  = Ext.id();
            html += '<span id="' + id + '"></span>';

            interval = setInterval(function() {
                if (!(el = DOC.getElementById(id))) {
                    return false;
                }
                clearInterval(interval);
                Ext.removeNode(el);
                var hd     = Ext.getHead().dom,
                    match,
                    attrs,
                    srcMatch,
                    typeMatch,
                    el,
                    s;

                while ((match = scriptTagRe.exec(html))) {
                    attrs = match[1];
                    srcMatch = attrs ? attrs.match(srcRe) : false;
                    if (srcMatch && srcMatch[2]) {
                       s = DOC.createElement("script");
                       s.src = srcMatch[2];
                       typeMatch = attrs.match(typeRe);
                       if (typeMatch && typeMatch[2]) {
                           s.type = typeMatch[2];
                       }
                       hd.appendChild(s);
                    } else if (match[2] && match[2].length > 0) {
                        if (window.execScript) {
                           window.execScript(match[2]);
                        } else {
                           window.eval(match[2]);
                        }
                    }
                }
                Ext.callback(callback, me);
            }, 20);
            dom.innerHTML = html.replace(replaceScriptTagRe, '');
            return me;
        },

        
        removeAllListeners : function() {
            this.removeAnchor();
            Ext.EventManager.removeAll(this.dom);
            return this;
        },

        
        createProxy : function(config, renderTo, matchBox) {
            config = (typeof config == 'object') ? config : {tag : "div", cls: config};

            var me = this,
                proxy = renderTo ? Ext.DomHelper.append(renderTo, config, true) :
                                   Ext.DomHelper.insertBefore(me.dom, config, true);

            proxy.setVisibilityMode(Element.DISPLAY);
            proxy.hide();
            if (matchBox && me.setBox && me.getBox) { 
               proxy.setBox(me.getBox());
            }
            return proxy;
        },
        
        
        getScopeParent: function() {
            var parent = this.dom.parentNode;
            return Ext.scopeResetCSS ? parent.parentNode : parent;
        },

        
        needsTabIndex: function() {
            if (this.dom) {
                if ((this.dom.nodeName === 'a') && (!this.dom.href)) {
                    return true;
                }
                return !focusRe.test(this.dom.nodeName);
            }
        },

        
        focusable: function () {
            var dom = this.dom,
                nodeName = dom.nodeName,
                canFocus = false;

            if (!dom.disabled) {
                if (focusRe.test(nodeName)) {
                    if ((nodeName !== 'a') || dom.href) {
                        canFocus = true;
                    }
                } else {
                    canFocus = !isNaN(dom.tabIndex);
                }
            }
            return canFocus && this.isVisible(true);
        }
    });

    if (Ext.isIE) {
        El.prototype.getById = function (id, asDom) {
            var dom = this.dom,
                cached, el, ret;

            if (dom) {
                
                
                el = (useDocForId && DOC.getElementById(id)) || dom.all[id];
                if (el) {
                    if (asDom) {
                        ret = el;
                    } else {
                        
                        
                        cached = EC[id];
                        if (cached && cached.el) {
                            ret = cached.el;
                            ret.dom = el;
                        } else {
                            ret = new Element(el);
                        }
                    }
                    return ret;
                }
            }

            return asDom ? Ext.getDom(id) : El.get(id);
        };
    }

    El.createAlias({
        
        addListener: 'on',
        
        removeListener: 'un',
        
        clearListeners: 'removeAllListeners'
    });

    El.Fly = AbstractElement.Fly = new Ext.Class({
        extend: El,

        constructor: function(dom) {
            this.dom = dom;
        },
        
        attach: AbstractElement.Fly.prototype.attach
    });

    if (Ext.isIE) {
        Ext.getElementById = function (id) {
            var el = DOC.getElementById(id),
                detachedBodyEl;

            if (!el && (detachedBodyEl = AbstractElement.detachedBodyEl)) {
                el = detachedBodyEl.dom.all[id];
            }

            return el;
        };
    } else if (!DOC.querySelector) {
        Ext.getDetachedBody = Ext.getBody;

        Ext.getElementById = function (id) {
            return DOC.getElementById(id);
        };
    }
});

})();


Ext.dom.Element.override((function() {

    var doc = document,
        win = window,
        alignRe = /^([a-z]+)-([a-z]+)(\?)?$/,
        round = Math.round;

    return {

        
        getAnchorXY: function(anchor, local, mySize) {
            
            
            anchor = (anchor || "tl").toLowerCase();
            mySize = mySize || {};

            var me = this,
                isViewport = me.dom == doc.body || me.dom == doc,
                myWidth = mySize.width || isViewport ? Ext.dom.Element.getViewWidth() : me.getWidth(),
                myHeight = mySize.height || isViewport ? Ext.dom.Element.getViewHeight() : me.getHeight(),
                xy,
                myPos = me.getXY(),
                scroll = me.getScroll(),
                extraX = isViewport ? scroll.left : !local ? myPos[0] : 0,
                extraY = isViewport ? scroll.top : !local ? myPos[1] : 0;

            
            
            switch (anchor) {
                case 'tl' : xy = [ 0,                    0];
                            break;
                case 'bl' : xy = [ 0,                    myHeight];
                            break;
                case 'tr' : xy = [ myWidth,              0];
                            break;
                case 'c'  : xy = [ round(myWidth * 0.5), round(myHeight * 0.5)];
                            break;
                case 't'  : xy = [ round(myWidth * 0.5), 0];
                            break;
                case 'l'  : xy = [ 0,                    round(myHeight * 0.5)];
                            break;
                case 'r'  : xy = [ myWidth,              round(myHeight * 0.5)];
                            break;
                case 'b'  : xy = [ round(myWidth * 0.5), myHeight];
                            break;
                case 'br' : xy = [ myWidth,              myHeight];
            }
            return [xy[0] + extraX, xy[1] + extraY];
        },

        
        getAlignToXY : function(alignToEl, posSpec, offset) {
            alignToEl = Ext.get(alignToEl);

            if (!alignToEl || !alignToEl.dom) {
            }

            offset = offset || [0,0];
            posSpec = (!posSpec || posSpec == "?" ? "tl-bl?" : (!(/-/).test(posSpec) && posSpec !== "" ? "tl-" + posSpec : posSpec || "tl-bl")).toLowerCase();

            var me = this,
                    myPosition,
                    alignToElPosition,
                    x,
                    y,
                    myWidth,
                    myHeight,
                    alignToElRegion,
                    viewportWidth = Ext.dom.Element.getViewWidth() - 10, 
                    viewportHeight = Ext.dom.Element.getViewHeight() - 10, 
                    p1y,
                    p1x,
                    p2y,
                    p2x,
                    swapY,
                    swapX,
                    docElement = doc.documentElement,
                    docBody = doc.body,
                    scrollX = (docElement.scrollLeft || docBody.scrollLeft || 0),
                    scrollY = (docElement.scrollTop  || docBody.scrollTop  || 0),
                    constrain, 
                    align1,
                    align2,
                    alignMatch = posSpec.match(alignRe);


            align1 = alignMatch[1];
            align2 = alignMatch[2];
            constrain = !!alignMatch[3];

            
            
            myPosition = me.getAnchorXY(align1, true);
            alignToElPosition = alignToEl.getAnchorXY(align2, false);

            x = alignToElPosition[0] - myPosition[0] + offset[0];
            y = alignToElPosition[1] - myPosition[1] + offset[1];

            
            if (constrain) {
                myWidth = me.getWidth();
                myHeight = me.getHeight();
                alignToElRegion = alignToEl.getRegion();
                
                
                
                p1y = align1.charAt(0);
                p1x = align1.charAt(align1.length - 1);
                p2y = align2.charAt(0);
                p2x = align2.charAt(align2.length - 1);
                swapY = ((p1y == "t" && p2y == "b") || (p1y == "b" && p2y == "t"));
                swapX = ((p1x == "r" && p2x == "l") || (p1x == "l" && p2x == "r"));

                if (x + myWidth > viewportWidth + scrollX) {
                    x = swapX ? alignToElRegion.left - myWidth : viewportWidth + scrollX - myWidth;
                }
                if (x < scrollX) {
                    x = swapX ? alignToElRegion.right : scrollX;
                }
                if (y + myHeight > viewportHeight + scrollY) {
                    y = swapY ? alignToElRegion.top - myHeight : viewportHeight + scrollY - myHeight;
                }
                if (y < scrollY) {
                    y = swapY ? alignToElRegion.bottom : scrollY;
                }
            }
            return [x,y];
        },


        
        anchorTo : function(el, alignment, offsets, animate, monitorScroll, callback) {
            var me = this,
                dom = me.dom,
                scroll = !Ext.isEmpty(monitorScroll),
                action = function() {
                    Ext.fly(dom).alignTo(el, alignment, offsets, animate);
                    Ext.callback(callback, Ext.fly(dom));
                },
                anchor = this.getAnchor();

            
            this.removeAnchor();
            Ext.apply(anchor, {
                fn: action,
                scroll: scroll
            });

            Ext.EventManager.onWindowResize(action, null);

            if (scroll) {
                Ext.EventManager.on(win, 'scroll', action, null,
                        {buffer: !isNaN(monitorScroll) ? monitorScroll : 50});
            }
            action.call(me); 
            return me;
        },

        
        removeAnchor : function() {
            var me = this,
                anchor = this.getAnchor();

            if (anchor && anchor.fn) {
                Ext.EventManager.removeResizeListener(anchor.fn);
                if (anchor.scroll) {
                    Ext.EventManager.un(win, 'scroll', anchor.fn);
                }
                delete anchor.fn;
            }
            return me;
        },

        getAlignVector: function(el, spec, offset) {
            var me = this,
                myPos = me.getXY(),
                alignedPos = me.getAlignToXY(el, spec, offset);

            el = Ext.get(el);

            alignedPos[0] -= myPos[0];
            alignedPos[1] -= myPos[1];
            return alignedPos;
        },

        
        alignTo: function(element, position, offsets, animate) {
            var me = this;
            return me.setXY(me.getAlignToXY(element, position, offsets),
                    me.anim && !!animate ? me.anim(animate) : false);
        },

        
        getConstrainVector: function(constrainTo, proposedPosition) {
            if (!(constrainTo instanceof Ext.util.Region)) {
                constrainTo = Ext.get(constrainTo).getViewRegion();
            }
            var thisRegion = this.getRegion(),
                    vector = [0, 0],
                    shadowSize = this.shadow && this.shadow.offset,
                    overflowed = false;

            
            if (proposedPosition) {
                thisRegion.translateBy(proposedPosition[0] - thisRegion.x, proposedPosition[1] - thisRegion.y);
            }

            
            
            if (shadowSize) {
                constrainTo.adjust(0, -shadowSize, -shadowSize, shadowSize);
            }

            
            if (thisRegion.right > constrainTo.right) {
                overflowed = true;
                vector[0] = (constrainTo.right - thisRegion.right);    
            }
            if (thisRegion.left + vector[0] < constrainTo.left) {
                overflowed = true;
                vector[0] = (constrainTo.left - thisRegion.left);      
            }

            
            if (thisRegion.bottom > constrainTo.bottom) {
                overflowed = true;
                vector[1] = (constrainTo.bottom - thisRegion.bottom);  
            }
            if (thisRegion.top + vector[1] < constrainTo.top) {
                overflowed = true;
                vector[1] = (constrainTo.top - thisRegion.top);        
            }
            return overflowed ? vector : false;
        },

        
        getCenterXY : function(){
            return this.getAlignToXY(doc, 'c-c');
        },

        
        center : function(centerIn){
            return this.alignTo(centerIn || doc, 'c-c');
        }
    };
})());



Ext.dom.Element.override({
    
    animate: function(config) {
        var me = this,
            listeners,
            anim,
            animId = me.dom.id || Ext.id(me.dom);

        if (!Ext.fx.Manager.hasFxBlock(animId)) {
            
            if (config.listeners) {
                listeners = config.listeners;
                delete config.listeners;
            }
            if (config.internalListeners) {
                config.listeners = config.internalListeners;
                delete config.internalListeners;
            }
            anim = new Ext.fx.Anim(me.anim(config));
            if (listeners) {
                anim.on(listeners);
            }
            Ext.fx.Manager.queueFx(anim);
        }
        return me;
    },

    
    anim: function(config) {
        if (!Ext.isObject(config)) {
            return (config) ? {} : false;
        }

        var me = this,
            duration = config.duration || Ext.fx.Anim.prototype.duration,
            easing = config.easing || 'ease',
            animConfig;

        if (config.stopAnimation) {
            me.stopAnimation();
        }

        Ext.applyIf(config, Ext.fx.Manager.getFxDefaults(me.id));

        
        Ext.fx.Manager.setFxDefaults(me.id, {
            delay: 0
        });

        animConfig = {
            
            target: me.dom,
            remove: config.remove,
            alternate: config.alternate || false,
            duration: duration,
            easing: easing,
            callback: config.callback,
            listeners: config.listeners,
            iterations: config.iterations || 1,
            scope: config.scope,
            block: config.block,
            concurrent: config.concurrent,
            delay: config.delay || 0,
            paused: true,
            keyframes: config.keyframes,
            from: config.from || {},
            to: Ext.apply({}, config)
        };
        Ext.apply(animConfig.to, config.to);

        
        delete animConfig.to.to;
        delete animConfig.to.from;
        delete animConfig.to.remove;
        delete animConfig.to.alternate;
        delete animConfig.to.keyframes;
        delete animConfig.to.iterations;
        delete animConfig.to.listeners;
        delete animConfig.to.target;
        delete animConfig.to.paused;
        delete animConfig.to.callback;
        delete animConfig.to.scope;
        delete animConfig.to.duration;
        delete animConfig.to.easing;
        delete animConfig.to.concurrent;
        delete animConfig.to.block;
        delete animConfig.to.stopAnimation;
        delete animConfig.to.delay;
        return animConfig;
    },

    
    slideIn: function(anchor, obj, slideOut) {
        var me = this,
            elStyle = me.dom.style,
            beforeAnim, wrapAnim;

        anchor = anchor || "t";
        obj = obj || {};

        beforeAnim = function() {
            var animScope = this,
                listeners = obj.listeners,
                box, originalStyles, anim, wrap;

            if (!slideOut) {
                me.fixDisplay();
            }

            box = me.getBox();
            if ((anchor == 't' || anchor == 'b') && box.height === 0) {
                box.height = me.dom.scrollHeight;
            }
            else if ((anchor == 'l' || anchor == 'r') && box.width === 0) {
                box.width = me.dom.scrollWidth;
            }

            originalStyles = me.getStyles('width', 'height', 'left', 'right', 'top', 'bottom', 'position', 'z-index', true);
            me.setSize(box.width, box.height);

            wrap = me.wrap({
                id: Ext.id() + '-anim-wrap-for-' + me.id,
                style: {
                    visibility: slideOut ? 'visible' : 'hidden'
                }
            });
            wrap.setPositioning(me.getPositioning());
            if (wrap.isStyle('position', 'static')) {
                wrap.position('relative');
            }
            me.clearPositioning('auto');
            wrap.clip();

            
            
            
            me.setStyle({
                visibility: '',
                position: 'absolute'
            });
            if (slideOut) {
                wrap.setSize(box.width, box.height);
            }

            switch (anchor) {
                case 't':
                    anim = {
                        from: {
                            width: box.width + 'px',
                            height: '0px'
                        },
                        to: {
                            width: box.width + 'px',
                            height: box.height + 'px'
                        }
                    };
                    elStyle.bottom = '0px';
                    break;
                case 'l':
                    anim = {
                        from: {
                            width: '0px',
                            height: box.height + 'px'
                        },
                        to: {
                            width: box.width + 'px',
                            height: box.height + 'px'
                        }
                    };
                    elStyle.right = '0px';
                    break;
                case 'r':
                    anim = {
                        from: {
                            x: box.x + box.width,
                            width: '0px',
                            height: box.height + 'px'
                        },
                        to: {
                            x: box.x,
                            width: box.width + 'px',
                            height: box.height + 'px'
                        }
                    };
                    break;
                case 'b':
                    anim = {
                        from: {
                            y: box.y + box.height,
                            width: box.width + 'px',
                            height: '0px'
                        },
                        to: {
                            y: box.y,
                            width: box.width + 'px',
                            height: box.height + 'px'
                        }
                    };
                    break;
                case 'tl':
                    anim = {
                        from: {
                            x: box.x,
                            y: box.y,
                            width: '0px',
                            height: '0px'
                        },
                        to: {
                            width: box.width + 'px',
                            height: box.height + 'px'
                        }
                    };
                    elStyle.bottom = '0px';
                    elStyle.right = '0px';
                    break;
                case 'bl':
                    anim = {
                        from: {
                            x: box.x + box.width,
                            width: '0px',
                            height: '0px'
                        },
                        to: {
                            x: box.x,
                            width: box.width + 'px',
                            height: box.height + 'px'
                        }
                    };
                    elStyle.right = '0px';
                    break;
                case 'br':
                    anim = {
                        from: {
                            x: box.x + box.width,
                            y: box.y + box.height,
                            width: '0px',
                            height: '0px'
                        },
                        to: {
                            x: box.x,
                            y: box.y,
                            width: box.width + 'px',
                            height: box.height + 'px'
                        }
                    };
                    break;
                case 'tr':
                    anim = {
                        from: {
                            y: box.y + box.height,
                            width: '0px',
                            height: '0px'
                        },
                        to: {
                            y: box.y,
                            width: box.width + 'px',
                            height: box.height + 'px'
                        }
                    };
                    elStyle.bottom = '0px';
                    break;
            }

            wrap.show();
            wrapAnim = Ext.apply({}, obj);
            delete wrapAnim.listeners;
            wrapAnim = new Ext.fx.Anim(Ext.applyIf(wrapAnim, {
                target: wrap,
                duration: 500,
                easing: 'ease-out',
                from: slideOut ? anim.to : anim.from,
                to: slideOut ? anim.from : anim.to
            }));

            
            wrapAnim.on('afteranimate', function() {
                me.setStyle(originalStyles);
                if (slideOut) {
                    if (obj.useDisplay) {
                        me.setDisplayed(false);
                    } else {
                        me.hide();
                    }
                }
                if (wrap.dom) {
                    wrap.dom.parentNode.insertBefore(me.dom, wrap.dom);
                    wrap.remove();
                }
                
                animScope.end();
            });
            
            if (listeners) {
                wrapAnim.on(listeners);
            }
        };

        me.animate({
            
            duration: obj.duration ? Math.max(obj.duration, 500) * 2 : 1000,
            listeners: {
                beforeanimate: beforeAnim, 
                afteranimate: function() {
                    if (wrapAnim && wrapAnim.running) {
                        
                        wrapAnim.end();
                    }
                }
            }
        });
        return me;
    },


    
    slideOut: function(anchor, o) {
        return this.slideIn(anchor, o, true);
    },

    
    puff: function(obj) {
        var me = this,
            beforeAnim;
        obj = Ext.applyIf(obj || {}, {
            easing: 'ease-out',
            duration: 500,
            useDisplay: false
        });

        beforeAnim = function() {
            me.clearOpacity();
            me.show();

            var box = me.getBox(),
                fontSize = me.getStyle('fontSize'),
                position = me.getPositioning();
            this.to = {
                width: box.width * 2,
                height: box.height * 2,
                x: box.x - (box.width / 2),
                y: box.y - (box.height /2),
                opacity: 0,
                fontSize: '200%'
            };
            this.on('afteranimate',function() {
                if (me.dom) {
                    if (obj.useDisplay) {
                        me.setDisplayed(false);
                    } else {
                        me.hide();
                    }
                    me.clearOpacity();
                    me.setPositioning(position);
                    me.setStyle({fontSize: fontSize});
                }
            });
        };

        me.animate({
            duration: obj.duration,
            easing: obj.easing,
            listeners: {
                beforeanimate: {
                    fn: beforeAnim
                }
            }
        });
        return me;
    },

    
    switchOff: function(obj) {
        var me = this,
            beforeAnim;

        obj = Ext.applyIf(obj || {}, {
            easing: 'ease-in',
            duration: 500,
            remove: false,
            useDisplay: false
        });

        beforeAnim = function() {
            var animScope = this,
                size = me.getSize(),
                xy = me.getXY(),
                keyframe, position;
            me.clearOpacity();
            me.clip();
            position = me.getPositioning();

            keyframe = new Ext.fx.Animator({
                target: me,
                duration: obj.duration,
                easing: obj.easing,
                keyframes: {
                    33: {
                        opacity: 0.3
                    },
                    66: {
                        height: 1,
                        y: xy[1] + size.height / 2
                    },
                    100: {
                        width: 1,
                        x: xy[0] + size.width / 2
                    }
                }
            });
            keyframe.on('afteranimate', function() {
                if (obj.useDisplay) {
                    me.setDisplayed(false);
                } else {
                    me.hide();
                }
                me.clearOpacity();
                me.setPositioning(position);
                me.setSize(size);
                
                animScope.end();
            });
        };
        
        me.animate({
            
            duration: (Math.max(obj.duration, 500) * 2),
            listeners: {
                beforeanimate: {
                    fn: beforeAnim
                }
            }
        });
        return me;
    },

    
    frame : function(color, count, obj){
        var me = this,
            beforeAnim;

        color = color || '#C3DAF9';
        count = count || 1;
        obj = obj || {};

        beforeAnim = function() {
            me.show();
            var animScope = this,
                box = me.getBox(),
                proxy = Ext.getBody().createChild({
                    id: me.id + '-anim-proxy',
                    style: {
                        position : 'absolute',
                        'pointer-events': 'none',
                        'z-index': 35000,
                        border : '0px solid ' + color
                    }
                }),
                proxyAnim;
            proxyAnim = new Ext.fx.Anim({
                target: proxy,
                duration: obj.duration || 1000,
                iterations: count,
                from: {
                    top: box.y,
                    left: box.x,
                    borderWidth: 0,
                    opacity: 1,
                    height: box.height,
                    width: box.width
                },
                to: {
                    top: box.y - 20,
                    left: box.x - 20,
                    borderWidth: 10,
                    opacity: 0,
                    height: box.height + 40,
                    width: box.width + 40
                }
            });
            proxyAnim.on('afteranimate', function() {
                proxy.remove();
                
                animScope.end();
            });
        };

        me.animate({
            
            duration: (Math.max(obj.duration, 500) * 2) || 2000,
            listeners: {
                beforeanimate: {
                    fn: beforeAnim
                }
            }
        });
        return me;
    },

    
    ghost: function(anchor, obj) {
        var me = this,
            beforeAnim;

        anchor = anchor || "b";
        beforeAnim = function() {
            var width = me.getWidth(),
                height = me.getHeight(),
                xy = me.getXY(),
                position = me.getPositioning(),
                to = {
                    opacity: 0
                };
            switch (anchor) {
                case 't':
                    to.y = xy[1] - height;
                    break;
                case 'l':
                    to.x = xy[0] - width;
                    break;
                case 'r':
                    to.x = xy[0] + width;
                    break;
                case 'b':
                    to.y = xy[1] + height;
                    break;
                case 'tl':
                    to.x = xy[0] - width;
                    to.y = xy[1] - height;
                    break;
                case 'bl':
                    to.x = xy[0] - width;
                    to.y = xy[1] + height;
                    break;
                case 'br':
                    to.x = xy[0] + width;
                    to.y = xy[1] + height;
                    break;
                case 'tr':
                    to.x = xy[0] + width;
                    to.y = xy[1] - height;
                    break;
            }
            this.to = to;
            this.on('afteranimate', function () {
                if (me.dom) {
                    me.hide();
                    me.clearOpacity();
                    me.setPositioning(position);
                }
            });
        };

        me.animate(Ext.applyIf(obj || {}, {
            duration: 500,
            easing: 'ease-out',
            listeners: {
                beforeanimate: {
                    fn: beforeAnim
                }
            }
        }));
        return me;
    },

    
    highlight: function(color, o) {
        var me = this,
            dom = me.dom,
            from = {},
            restore, to, attr, lns, event, fn;

        o = o || {};
        lns = o.listeners || {};
        attr = o.attr || 'backgroundColor';
        from[attr] = color || 'ffff9c';

        if (!o.to) {
            to = {};
            to[attr] = o.endColor || me.getColor(attr, 'ffffff', '');
        }
        else {
            to = o.to;
        }

        
        o.listeners = Ext.apply(Ext.apply({}, lns), {
            beforeanimate: function() {
                restore = dom.style[attr];
                me.clearOpacity();
                me.show();

                event = lns.beforeanimate;
                if (event) {
                    fn = event.fn || event;
                    return fn.apply(event.scope || lns.scope || window, arguments);
                }
            },
            afteranimate: function() {
                if (dom) {
                    dom.style[attr] = restore;
                }

                event = lns.afteranimate;
                if (event) {
                    fn = event.fn || event;
                    fn.apply(event.scope || lns.scope || window, arguments);
                }
            }
        });

        me.animate(Ext.apply({}, o, {
            duration: 1000,
            easing: 'ease-in',
            from: from,
            to: to
        }));
        return me;
    },

   
    pause: function(ms) {
        var me = this;
        Ext.fx.Manager.setFxDefaults(me.id, {
            delay: ms
        });
        return me;
    },

    
    fadeIn: function(o) {
        this.animate(Ext.apply({}, o, {
            opacity: 1
        }));
        return this;
    },

    
    fadeOut: function(o) {
        var me = this;
        me.animate(Ext.applyIf(o || {}, {
            opacity: 0,
            internalListeners: {
                afteranimate: function(anim){
                    var dom = me.dom;
                    if (dom && anim.to.opacity === 0) {
                        if (o.useDisplay) {
                            me.setDisplayed(false);
                        } else {
                            me.hide();
                        }
                    }         
                }
            }
        }));
        return me;
    },

    
    scale: function(w, h, o) {
        this.animate(Ext.apply({}, o, {
            width: w,
            height: h
        }));
        return this;
    },

    
    shift: function(config) {
        this.animate(config);
        return this;
    }
});


Ext.dom.Element.override({
    
    initDD : function(group, config, overrides){
        var dd = new Ext.dd.DD(Ext.id(this.dom), group, config);
        return Ext.apply(dd, overrides);
    },

    
    initDDProxy : function(group, config, overrides){
        var dd = new Ext.dd.DDProxy(Ext.id(this.dom), group, config);
        return Ext.apply(dd, overrides);
    },

    
    initDDTarget : function(group, config, overrides){
        var dd = new Ext.dd.DDTarget(Ext.id(this.dom), group, config);
        return Ext.apply(dd, overrides);
    }
});


(function() {

var Element = Ext.dom.Element,
    VISIBILITY      = "visibility",
    DISPLAY         = "display",
    NONE            = "none",
    HIDDEN          = 'hidden',
    OFFSETS = "offsets",
    ASCLASS = "asclass",
    NOSIZE = 'nosize',
    ORIGINALDISPLAY = 'originalDisplay',
    VISMODE = 'visibilityMode',
    ISVISIBLE = 'isVisible',
    getDisplay = function(el){
        var data = (el.$cache || el.getCache()).data,
            display = data[ORIGINALDISPLAY];
            
        if (display === undefined) {
            data[ORIGINALDISPLAY] = display = '';
        }
        return display;
    },
    getVisMode = function(el){
        var data = (el.$cache || el.getCache()).data,
            visMode = data[VISMODE];
            
        if (visMode === undefined) {
            data[VISMODE] = visMode = Ext.dom.Element.VISIBILITY;
        }
        return visMode;
    };

Element.override({
    
    originalDisplay : "",
    visibilityMode : 1,

    
    setVisible : function(visible, animate){
        var me = this, isDisplay, isVisibility, isOffsets, isNosize,
            dom = me.dom,
            visMode = getVisMode(me);


        
        if (typeof animate == 'string'){
            switch (animate) {
                case DISPLAY:
                    visMode = Ext.dom.Element.DISPLAY;
                    break;
                case VISIBILITY:
                    visMode = Ext.dom.Element.VISIBILITY;
                    break;
                case OFFSETS:
                    visMode = Ext.dom.Element.OFFSETS;
                    break;
                case NOSIZE:
                case ASCLASS:
                    visMode = Ext.dom.Element.ASCLASS;
                    break;
            }
            me.setVisibilityMode(visMode);
            animate = false;
        }

        if (!animate || !me.anim) {
            if(visMode == Ext.dom.Element.ASCLASS ){

                me[visible?'removeCls':'addCls'](me.visibilityCls || Ext.dom.Element.visibilityCls);

            } else if (visMode == Ext.dom.Element.DISPLAY){

                return me.setDisplayed(visible);

            } else if (visMode == Ext.dom.Element.OFFSETS){

                if (!visible){
                    
                    if (!me.hideModeStyles) {
                        me.hideModeStyles = {
                            position: me.getStyle('position'),
                            top: me.getStyle('top'),
                            left: me.getStyle('left')
                        };
                    }
                    me.applyStyles({position: 'absolute', top: '-10000px', left: '-10000px'});
                }

                
                
                else if (me.hideModeStyles) {
                    me.applyStyles(me.hideModeStyles || {position: '', top: '', left: ''});
                    delete me.hideModeStyles;
                }

            }else{
                me.fixDisplay();
                
                dom.style.visibility = visible ? '' : HIDDEN;
            }
        }else{
            
            if(visible){
                me.setOpacity(0.01);
                me.setVisible(true);
            }
            if (!Ext.isObject(animate)) {
                animate = {
                    duration: 350,
                    easing: 'ease-in'
                };
            }
            me.animate(Ext.applyIf({
                callback: function() {
                    if (!visible) {
                        me.setVisible(false).setOpacity(1);
                    }
                },
                to: {
                    opacity: (visible) ? 1 : 0
                }
            }, animate));
        }
        (me.$cache || me.getCache()).data[ISVISIBLE] = visible;
        return me;
    },


    
    hasMetrics  : function(){
        var visMode = getVisMode(this);
        return this.isVisible() || (visMode == Ext.dom.Element.OFFSETS) || (visMode == Ext.dom.Element.VISIBILITY);
    },

    
    toggle : function(animate){
        var me = this;
        me.setVisible(!me.isVisible(), me.anim(animate));
        return me;
    },

    
    setDisplayed : function(value) {
        if(typeof value == "boolean"){
           value = value ? getDisplay(this) : NONE;
        }
        this.setStyle(DISPLAY, value);
        return this;
    },

    
    fixDisplay : function(){
        var me = this;
        if (me.isStyle(DISPLAY, NONE)) {
            me.setStyle(VISIBILITY, HIDDEN);
            me.setStyle(DISPLAY, getDisplay(me)); 
            if (me.isStyle(DISPLAY, NONE)) { 
                me.setStyle(DISPLAY, "block");
            }
        }
    },

    
    hide : function(animate){
        
        if (typeof animate == 'string'){
            this.setVisible(false, animate);
            return this;
        }
        this.setVisible(false, this.anim(animate));
        return this;
    },

    
    show : function(animate){
        
        if (typeof animate == 'string'){
            this.setVisible(true, animate);
            return this;
        }
        this.setVisible(true, this.anim(animate));
        return this;
    }
});

})();



(function() {

var Element = Ext.dom.Element,
    LEFT = "left",
    RIGHT = "right",
    TOP = "top",
    BOTTOM = "bottom",
    POSITION = "position",
    STATIC = "static",
    RELATIVE = "relative",
    AUTO = "auto",
    ZINDEX = "z-index";

Element.override({

    getX: function() {
        return Element.getX(this.dom);
    },

    getY: function() {
        return Element.getY(this.dom);
    },

    
    getXY: function() {
        return Element.getXY(this.dom);
    },

    
    getOffsetsTo : function(el){
        var o = this.getXY(),
                e = Ext.fly(el, '_internal').getXY();
        return [o[0] - e[0],o[1] - e[1]];
    },

    setX: function(x, animate) {
        return this.setXY([x, this.getY()], animate);
    },

    setY: function(y, animate) {
        return this.setXY([this.getX(), y], animate);
    },

    setLeft: function(left) {
        this.setStyle(LEFT, this.addUnits(left));
        return this;
    },

    setTop: function(top) {
        this.setStyle(TOP, this.addUnits(top));
        return this;
    },

    setRight: function(right) {
        this.setStyle(RIGHT, this.addUnits(right));
        return this;
    },

    setBottom: function(bottom) {
        this.setStyle(BOTTOM, this.addUnits(bottom));
        return this;
    },

    
    setXY: function(pos, animate) {
        var me = this;
        if (!animate || !me.anim) {
            Element.setXY(me.dom, pos);
        }
        else {
            if (!Ext.isObject(animate)) {
                animate = {};
            }
            me.animate(Ext.applyIf({ to: { x: pos[0], y: pos[1] } }, animate));
        }
        return me;
    },

    getLeft: function(local) {
        return !local ? this.getX() : parseInt(this.getStyle(LEFT), 10) || 0;
    },

    getRight: function(local) {
        var me = this;
        return !local ? me.getX() + me.getWidth() : (me.getLeft(true) + me.getWidth()) || 0;
    },

    getTop: function(local) {
        return !local ? this.getY() : parseInt(this.getStyle(TOP), 10) || 0;
    },

    getBottom: function(local) {
        var me = this;
        return !local ? me.getY() + me.getHeight() : (me.getTop(true) + me.getHeight()) || 0;
    },

    translatePoints: function(x, y) {
        if (Ext.isArray(x)) {
            y = x[1];
            x = x[0];
        }
        var me = this,
                relative = me.isStyle(POSITION, RELATIVE),
                o = me.getXY(),
                left = parseInt(me.getStyle(LEFT), 10),
                top = parseInt(me.getStyle(TOP), 10);

        if (!Ext.isNumber(left)) {
            left = relative ? 0 : me.dom.offsetLeft;
        }
        if (!Ext.isNumber(top)) {
            top = relative ? 0 : me.dom.offsetTop;
        }
        left = (Ext.isNumber(x)) ? x - o[0] + left : undefined;
        top = (Ext.isNumber(y)) ? y - o[1] + top : undefined;
        return {
            left: left,
            top: top
        };
    },



    setBox: function(box, adjust, animate) {
        var me = this,
                w = box.width,
                h = box.height;
        if ((adjust && !me.autoBoxAdjust) && !me.isBorderBox()) {
            w -= (me.getBorderWidth("lr") + me.getPadding("lr"));
            h -= (me.getBorderWidth("tb") + me.getPadding("tb"));
        }
        me.setBounds(box.x, box.y, w, h, animate);
        return me;
    },

    getBox: function(contentBox, local) {
        var me = this,
                xy,
                left,
                top,
                getBorderWidth = me.getBorderWidth,
                getPadding = me.getPadding,
                l, r, t, b, w, h, bx;

        if (!local) {
            xy = me.getXY();
        } else {
            left = parseInt(me.getStyle("left"), 10) || 0;
            top = parseInt(me.getStyle("top"), 10) || 0;
            xy = [left, top];
        }

        w = me.getWidth();
        h = me.getHeight();

        if (!contentBox) {
            bx = {
                x: xy[0],
                y: xy[1],
                0: xy[0],
                1: xy[1],
                width: w,
                height: h
            };
        } else {
            l = getBorderWidth.call(me, "l") + getPadding.call(me, "l");
            r = getBorderWidth.call(me, "r") + getPadding.call(me, "r");
            t = getBorderWidth.call(me, "t") + getPadding.call(me, "t");
            b = getBorderWidth.call(me, "b") + getPadding.call(me, "b");
            bx = {
                x: xy[0] + l,
                y: xy[1] + t,
                0: xy[0] + l,
                1: xy[1] + t,
                width: w - (l + r),
                height: h - (t + b)
            };
        }
        bx.right = bx.x + bx.width;
        bx.bottom = bx.y + bx.height;
        return bx;
    },

    getPageBox: function(getRegion) {
        var me = this,
                el = me.dom,
                isDoc = el === document.body,
                w = isDoc ? Ext.dom.AbstractElement.getViewWidth() : el.offsetWidth,
                h = isDoc ? Ext.dom.AbstractElement.getViewHeight() : el.offsetHeight,
                xy = me.getXY(),
                t = xy[1],
                r = xy[0] + w,
                b = xy[1] + h,
                l = xy[0];

        if (getRegion) {
            return new Ext.util.Region(t, r, b, l);
        }
        else {
            return {
                left: l,
                top: t,
                width: w,
                height: h,
                right: r,
                bottom: b
            };
        }
    },

    
    setLocation : function(x, y, animate) {
        return this.setXY([x, y], animate);
    },

    
    moveTo : function(x, y, animate) {
        return this.setXY([x, y], animate);
    },

    
    position : function(pos, zIndex, x, y) {
        var me = this;

        if (!pos && me.isStyle(POSITION, STATIC)) {
            me.setStyle(POSITION, RELATIVE);
        } else if (pos) {
            me.setStyle(POSITION, pos);
        }
        if (zIndex) {
            me.setStyle(ZINDEX, zIndex);
        }
        if (x || y) {
            me.setXY([x || false, y || false]);
        }
    },

    
    clearPositioning : function(value) {
        value = value || '';
        this.setStyle({
            left : value,
            right : value,
            top : value,
            bottom : value,
            "z-index" : "",
            position : STATIC
        });
        return this;
    },

    
    getPositioning : function() {
        var l = this.getStyle(LEFT);
        var t = this.getStyle(TOP);
        return {
            "position" : this.getStyle(POSITION),
            "left" : l,
            "right" : l ? "" : this.getStyle(RIGHT),
            "top" : t,
            "bottom" : t ? "" : this.getStyle(BOTTOM),
            "z-index" : this.getStyle(ZINDEX)
        };
    },

    
    setPositioning : function(pc) {
        var me = this,
                style = me.dom.style;

        me.setStyle(pc);

        if (pc.right == AUTO) {
            style.right = "";
        }
        if (pc.bottom == AUTO) {
            style.bottom = "";
        }

        return me;
    },

    
    move: function(direction, distance, animate) {
        var me = this,
            xy = me.getXY(),
            x = xy[0],
            y = xy[1],
            left = [x - distance, y],
            right = [x + distance, y],
            top = [x, y - distance],
            bottom = [x, y + distance],
            hash = {
                l: left,
                left: left,
                r: right,
                right: right,
                t: top,
                top: top,
                up: top,
                b: bottom,
                bottom: bottom,
                down: bottom
            };

        direction = direction.toLowerCase();
        me.moveTo(hash[direction][0], hash[direction][1], animate);
    },

    
    setLeftTop: function(left, top) {
        var style = this.dom.style;

        style.left = Element.addUnits(left);
        style.top = Element.addUnits(top);

        return this;
    },

    
    getRegion: function() {
        return this.getPageBox(true);
    },

    
    getViewRegion: function() {
        var me = this,
            isBody = me.dom === document.body,
            scroll, pos, top, left, width, height;

        
        if (isBody) {
            scroll = me.getScroll();
            left = scroll.left;
            top = scroll.top;
            width = Ext.dom.AbstractElement.getViewportWidth();
            height = Ext.dom.AbstractElement.getViewportHeight();
        }
        else {
            pos = me.getXY();
            left = pos[0] + me.getBorderWidth('l') + me.getPadding('l');
            top = pos[1] + me.getBorderWidth('t') + me.getPadding('t');
            width = me.getWidth(true);
            height = me.getHeight(true);
        }

        return new Ext.util.Region(top, left + width, top + height, left);
    },

    
    setBounds: function(x, y, width, height, animate) {
        var me = this;
        if (!animate || !me.anim) {
            me.setSize(width, height);
            me.setLocation(x, y);
        } else {
            if (!Ext.isObject(animate)) {
                animate = {};
            }
            me.animate(Ext.applyIf({
                to: {
                    x: x,
                    y: y,
                    width: me.adjustWidth(width),
                    height: me.adjustHeight(height)
                }
            }, animate));
        }
        return me;
    },

    
    setRegion: function(region, animate) {
        return this.setBounds(region.left, region.top, region.right - region.left, region.bottom - region.top, animate);
    }
});

})();



Ext.dom.Element.override({
    
    isScrollable: function() {
        var dom = this.dom;
        return dom.scrollHeight > dom.clientHeight || dom.scrollWidth > dom.clientWidth;
    },

    
    getScroll: function() {
        var d = this.dom,
            doc = document,
            body = doc.body,
            docElement = doc.documentElement,
            l,
            t,
            ret;

        if (d == doc || d == body) {
            if (Ext.isIE && Ext.isStrict) {
                l = docElement.scrollLeft;
                t = docElement.scrollTop;
            } else {
                l = window.pageXOffset;
                t = window.pageYOffset;
            }
            ret = {
                left: l || (body ? body.scrollLeft : 0),
                top : t || (body ? body.scrollTop : 0)
            };
        } else {
            ret = {
                left: d.scrollLeft,
                top : d.scrollTop
            };
        }

        return ret;
    },

    
    scrollBy: function(deltaX, deltaY, animate) {
        var me = this,
            dom = me.dom;

        
        if (deltaX.length) {
            animate = deltaY;
            deltaY = deltaX[1];
            deltaX = deltaX[0];
        } else if (typeof deltaX != 'number') { 
            animate = deltaY;
            deltaY = deltaX.y;
            deltaX = deltaX.x;
        }

        if (deltaX) {
            me.scrollTo('left', Math.max(Math.min(dom.scrollLeft + deltaX, dom.scrollWidth - dom.clientWidth), 0), animate);
        }
        if (deltaY) {
            me.scrollTo('top', Math.max(Math.min(dom.scrollTop + deltaY, dom.scrollHeight - dom.clientHeight), 0), animate);
        }

        return me;
    },

    
    scrollTo: function(side, value, animate) {
        
        var top = /top/i.test(side),
            me = this,
            dom = me.dom,
            obj = {},
            prop;

        if (!animate || !me.anim) {
            
            prop = 'scroll' + (top ? 'Top' : 'Left');
            dom[prop] = value;
        }
        else {
            if (!Ext.isObject(animate)) {
                animate = {};
            }
            obj['scroll' + (top ? 'Top' : 'Left')] = value;
            me.animate(Ext.applyIf({
                to: obj
            }, animate));
        }
        return me;
    },

    
    scrollIntoView: function(container, hscroll) {
        container = Ext.getDom(container) || Ext.getBody().dom;
        var el = this.dom,
            offsets = this.getOffsetsTo(container),
        
            left = offsets[0] + container.scrollLeft,
            top = offsets[1] + container.scrollTop,
            bottom = top + el.offsetHeight,
            right = left + el.offsetWidth,
        
            ctClientHeight = container.clientHeight,
            ctScrollTop = parseInt(container.scrollTop, 10),
            ctScrollLeft = parseInt(container.scrollLeft, 10),
            ctBottom = ctScrollTop + ctClientHeight,
            ctRight = ctScrollLeft + container.clientWidth;

        if (el.offsetHeight > ctClientHeight || top < ctScrollTop) {
            container.scrollTop = top;
        } else if (bottom > ctBottom) {
            container.scrollTop = bottom - ctClientHeight;
        }
        
        container.scrollTop = container.scrollTop;

        if (hscroll !== false) {
            if (el.offsetWidth > container.clientWidth || left < ctScrollLeft) {
                container.scrollLeft = left;
            }
            else if (right > ctRight) {
                container.scrollLeft = right - container.clientWidth;
            }
            container.scrollLeft = container.scrollLeft;
        }
        return this;
    },

    
    scrollChildIntoView: function(child, hscroll) {
        Ext.fly(child, '_scrollChildIntoView').scrollIntoView(this, hscroll);
    },

    
    scroll: function(direction, distance, animate) {
        if (!this.isScrollable()) {
            return false;
        }
        var el = this.dom,
            l = el.scrollLeft, t = el.scrollTop,
            w = el.scrollWidth, h = el.scrollHeight,
            cw = el.clientWidth, ch = el.clientHeight,
            scrolled = false, v,
            hash = {
                l: Math.min(l + distance, w - cw),
                r: v = Math.max(l - distance, 0),
                t: Math.max(t - distance, 0),
                b: Math.min(t + distance, h - ch)
            };

        hash.d = hash.b;
        hash.u = hash.t;

        direction = direction.substr(0, 1);
        if ((v = hash[direction]) > -1) {
            scrolled = true;
            this.scrollTo(direction == 'l' || direction == 'r' ? 'left' : 'top', v, this.anim(animate));
        }
        return scrolled;
    }
});


(function() {

var Element = Ext.dom.Element,
    view = document.defaultView;

var adjustDirect2DTableRe = /table-row|table-.*-group/,
    INTERNAL = '_internal',
    HIDDEN = 'hidden',
    ISCLIPPED = 'isClipped',
    OVERFLOW = 'overflow',
    OVERFLOWX = 'overflow-x',
    OVERFLOWY = 'overflow-y',
    ORIGINALCLIP = 'originalClip';



Element.inheritedProps = {
    fontSize: 1,
    fontStyle: 1,
    opacity: 1
};

if (!view || !view.getComputedStyle) {
    Element.override({
        getStyle: Ext.isIE6 ?
            
            function (prop) {
                var me = this,
                    dom = me.dom,
                    hook = me.styleHooks[prop],
                    name, cs;

                if (dom == document) {
                    return null;
                }
                if (!hook) {
                    me.styleHooks[prop] = hook = { name: Element.normalize(prop) };
                }
                if (hook.get) {
                    return hook.get(dom, me);
                }

                name = hook.name;

                do {
                    try {
                        return dom.style[name] || ((cs = dom.currentStyle) ? cs[name] : null);
                    } catch (e) {
                        
                        
                    }

                    if (!Element.inheritedProps[name]) {
                        break;
                    }

                    dom = dom.parentNode;
                    
                    
                    
                } while (dom);

                return null;
            } :
            
            function (prop) {
                var me = this,
                    dom = me.dom,
                    hook = me.styleHooks[prop],
                    name, cs;

                if (dom == document) {
                    return null;
                }
                if (!hook) {
                    me.styleHooks[prop] = hook = { name: Element.normalize(prop) };
                }
                if (hook.get) {
                    return hook.get(dom, me);
                }

                name = hook.name;

                return dom.style[name] || ((cs = dom.currentStyle) ? cs[name] : null);
            }
    });
}

Element.override({
    getHeight: function(contentHeight, preciseHeight) {
        var me = this,
            dom = me.dom,
            hidden = Ext.isIE && me.isStyle('display', 'none'),
            height, overflow, style, floating;

        
        
        if (Ext.isIEQuirks) {
            style = dom.style;
            overflow = style.overflow;
            me.setStyle({ overflow: 'hidden'});
        }

        height = dom.offsetHeight;

        height = Math.max(height, hidden ? 0 : dom.clientHeight) || 0;

        
        if (!hidden && Ext.supports.Direct2DBug) {
            floating = me.adjustDirect2DDimension('height');
            if (preciseHeight) {
                height += floating;
            }
            else if (floating > 0 && floating < 0.5) {
                height++;
            }
        }

        if (contentHeight) {
            height -= (me.getBorderWidth("tb") + me.getPadding("tb"));
        }

        if (Ext.isIEQuirks) {
            me.setStyle({ overflow: overflow});
        }

        if (height < 0) {
            height = 0;
        }
        return height;
    },

    getWidth: function(contentWidth, preciseWidth) {
        var me = this,
            dom = me.dom,
            hidden = Ext.isIE && me.isStyle('display', 'none'),
            rect, width, overflow, style, floating, parentPosition;

        
        
        if (Ext.isIEQuirks) {
            style = dom.style;
            overflow = style.overflow;
            me.setStyle({overflow: 'hidden'});
        }

        
        if (Ext.isOpera10_5) {
            if (dom.parentNode.currentStyle.position === 'relative') {
                parentPosition = dom.parentNode.style.position;
                dom.parentNode.style.position = 'static';
                width = dom.offsetWidth;
                dom.parentNode.style.position = parentPosition;
            }
            width = Math.max(width || 0, dom.offsetWidth);

            
            
            
            
            
            
        } else if (Ext.supports.BoundingClientRect) {
            rect = dom.getBoundingClientRect();
            width = rect.right - rect.left;
            width = preciseWidth ? width : Math.ceil(width);
        } else {
            width = dom.offsetWidth;
        }

        width = Math.max(width, hidden ? 0 : dom.clientWidth) || 0;

        
        if (!hidden && Ext.supports.Direct2DBug) {
            
            floating = me.adjustDirect2DDimension('width');
            if (preciseWidth) {
                width += floating;
            }
            
            
            
            else if (floating > 0 && floating < 0.5) {
                width++;
            }
        }

        if (contentWidth) {
            width -= (me.getBorderWidth("lr") + me.getPadding("lr"));
        }

        if (Ext.isIEQuirks) {
            me.setStyle({ overflow: overflow});
        }

        if (width < 0) {
            width = 0;
        }
        return width;
    },

    setWidth: function(width, animate) {
        var me = this;
        width = me.adjustWidth(width);
        if (!animate || !me.anim) {
            me.dom.style.width = me.addUnits(width);
        }
        else {
            if (!Ext.isObject(animate)) {
                animate = {};
            }
            me.animate(Ext.applyIf({
                to: {
                    width: width
                }
            }, animate));
        }
        return me;
    },

    setHeight : function(height, animate) {
        var me = this;

        height = me.adjustHeight(height);
        if (!animate || !me.anim) {
            me.dom.style.height = me.addUnits(height);
        }
        else {
            if (!Ext.isObject(animate)) {
                animate = {};
            }
            me.animate(Ext.applyIf({
                to: {
                    height: height
                }
            }, animate));
        }

        return me;
    },

    applyStyles: function(style) {
        Ext.DomHelper.applyStyles(this.dom, style);
        return this;
    },

    setSize: function(width, height, animate) {
        var me = this;

        if (Ext.isObject(width)) { 
            animate = height;
            height = width.height;
            width = width.width;
        }

        width = me.adjustWidth(width);
        height = me.adjustHeight(height);

        if (!animate || !me.anim) {
            me.dom.style.width = me.addUnits(width);
            me.dom.style.height = me.addUnits(height);
        }
        else {
            if (animate === true) {
                animate = {};
            }
            me.animate(Ext.applyIf({
                to: {
                    width: width,
                    height: height
                }
            }, animate));
        }

        return me;
    },

    getViewSize : function() {
        var me = this,
            dom = me.dom,
            isDoc = (dom == Ext.getDoc().dom || dom == Ext.getBody().dom),
            style, overflow, ret;

        
        if (isDoc) {
            ret = {
                width : Element.getViewWidth(),
                height : Element.getViewHeight()
            };

            
        }
        else {
            
            
            if (Ext.isIE6 || Ext.isIEQuirks) {
                style = dom.style;
                overflow = style.overflow;
                me.setStyle({ overflow: 'hidden'});
            }
            ret = {
                width : dom.clientWidth,
                height : dom.clientHeight
            };
            if (Ext.isIE6 || Ext.isIEQuirks) {
                me.setStyle({ overflow: overflow });
            }
        }
        return ret;
    },

    getSize: function(contentSize) {
        return {width: this.getWidth(contentSize), height: this.getHeight(contentSize)};
    },

    

    
    adjustWidth : function(width) {
        var me = this,
            isNum = (typeof width == 'number');

        if (isNum && me.autoBoxAdjust && !me.isBorderBox()) {
            width -= (me.getBorderWidth("lr") + me.getPadding("lr"));
        }
        return (isNum && width < 0) ? 0 : width;
    },

    
    adjustHeight : function(height) {
        var me = this,
            isNum = (typeof height == "number");

        if (isNum && me.autoBoxAdjust && !me.isBorderBox()) {
            height -= (me.getBorderWidth("tb") + me.getPadding("tb"));
        }
        return (isNum && height < 0) ? 0 : height;
    },

    
    getColor : function(attr, defaultValue, prefix) {
        var v = this.getStyle(attr),
            color = prefix || prefix === '' ? prefix : '#',
            h;

        if (!v || (/transparent|inherit/.test(v))) {
            return defaultValue;
        }
        if (/^r/.test(v)) {
            Ext.each(v.slice(4, v.length - 1).split(','), function(s) {
                h = parseInt(s, 10);
                color += (h < 16 ? '0' : '') + h.toString(16);
            });
        } else {
            v = v.replace('#', '');
            color += v.length == 3 ? v.replace(/^(\w)(\w)(\w)$/, '$1$1$2$2$3$3') : v;
        }
        return(color.length > 5 ? color.toLowerCase() : defaultValue);
    },

    
    setOpacity: function(opacity, animate) {
        var me = this;

        if (!me.dom) {
            return me;
        }

        if (!animate || !me.anim) {
            me.setStyle('opacity', opacity);
        }
        else {
            if (!Ext.isObject(animate)) {
                animate = {
                    duration: 350,
                    easing: 'ease-in'
                };
            }

            me.animate(Ext.applyIf({
                to: {
                    opacity: opacity
                }
            }, animate));
        }
        return me;
    },

    
    clearOpacity : function() {
        return this.setOpacity('');
    },

    
    adjustDirect2DDimension: function(dimension) {
        var me = this,
            dom = me.dom,
            display = me.getStyle('display'),
            inlineDisplay = dom.style.display,
            inlinePosition = dom.style.position,
            originIndex = dimension === 'width' ? 0 : 1,
            floating;

        if (display === 'inline') {
            dom.style.display = 'inline-block';
        }

        dom.style.position = display.match(adjustDirect2DTableRe) ? 'absolute' : 'static';

        
        
        floating = (parseFloat(me.getStyle(dimension)) || parseFloat(dom.currentStyle.msTransformOrigin.split(' ')[originIndex]) * 2) % 1;

        dom.style.position = inlinePosition;

        if (display === 'inline') {
            dom.style.display = inlineDisplay;
        }

        return floating;
    },

    
    clip : function() {
        var me = this,
            data = (me.$cache || me.getCache()).data;

        if (!data[ISCLIPPED]) {
            data[ISCLIPPED] = true;
            data[ORIGINALCLIP] = {
                o: me.getStyle(OVERFLOW),
                x: me.getStyle(OVERFLOWX),
                y: me.getStyle(OVERFLOWY)
            };
            me.setStyle(OVERFLOW, HIDDEN);
            me.setStyle(OVERFLOWX, HIDDEN);
            me.setStyle(OVERFLOWY, HIDDEN);
        }
        return me;
    },

    
    unclip : function() {
        var me = this,
            data = (me.$cache || me.getCache()).data,
            clip;

        if (data[ISCLIPPED]) {
            data[ISCLIPPED] = true;
            clip = data[ORIGINALCLIP];
            if (clip.o) {
                me.setStyle(OVERFLOW, clip.o);
            }
            if (clip.x) {
                me.setStyle(OVERFLOWX, clip.x);
            }
            if (clip.y) {
                me.setStyle(OVERFLOWY, clip.y);
            }
        }
        return me;
    },

    
    getStyles : function() {
        var styles = {},
            len = arguments.length,
            i = 0, style,
            inline = false;

        if (arguments[len - 1] === true) {
            --len;
            inline = true;
        }
        for (; i < len; ++i) {
            style = arguments[i];
            styles[style] = inline ? this.dom.style[Ext.Element.normalize(style)] : this.getStyle(style);
        }
        return styles;
    },

    
    boxWrap : function(cls) {
        cls = cls || Ext.baseCSSPrefix + 'box';
        var el = Ext.get(this.insertHtml("beforeBegin", "<div class='" + cls + "'>" + Ext.String.format(Element.boxMarkup, cls) + "</div>"));
        Ext.DomQuery.selectNode('.' + cls + '-mc', el.dom).appendChild(this.dom);
        return el;
    },

    
    getComputedHeight : function() {
        var me = this,
            h = Math.max(me.dom.offsetHeight, me.dom.clientHeight);
        if (!h) {
            h = parseFloat(me.getStyle('height')) || 0;
            if (!me.isBorderBox()) {
                h += me.getFrameWidth('tb');
            }
        }
        return h;
    },

    
    getComputedWidth : function() {
        var me = this,
            w = Math.max(me.dom.offsetWidth, me.dom.clientWidth);

        if (!w) {
            w = parseFloat(me.getStyle('width')) || 0;
            if (!me.isBorderBox()) {
                w += me.getFrameWidth('lr');
            }
        }
        return w;
    },

    
    getFrameWidth : function(sides, onlyContentBox) {
        return onlyContentBox && this.isBorderBox() ? 0 : (this.getPadding(sides) + this.getBorderWidth(sides));
    },

    
    addClsOnOver : function(className) {
        var dom = this.dom;
        this.hover(
                function() {
                    Ext.fly(dom, INTERNAL).addCls(className);
                },
                function() {
                    Ext.fly(dom, INTERNAL).removeCls(className);
                }
                );
        return this;
    },

    
    addClsOnFocus : function(className) {
        var me = this,
                dom = me.dom;
        me.on("focus", function() {
            Ext.fly(dom, INTERNAL).addCls(className);
        });
        me.on("blur", function() {
            Ext.fly(dom, INTERNAL).removeCls(className);
        });
        return me;
    },

    
    addClsOnClick : function(className) {
        var dom = this.dom;
        this.on("mousedown", function() {
            Ext.fly(dom, INTERNAL).addCls(className);
            var d = Ext.getDoc(),
                    fn = function() {
                        Ext.fly(dom, INTERNAL).removeCls(className);
                        d.removeListener("mouseup", fn);
                    };
            d.on("mouseup", fn);
        });
        return this;
    },

    
    getStyleSize : function() {
        var me = this,
                doc = document,
                d = this.dom,
                isDoc = (d == doc || d == doc.body),
                s = d.style,
                w, h;

        
        if (isDoc) {
            return {
                width : Element.getViewWidth(),
                height : Element.getViewHeight()
            };
        }
        
        if (s.width && s.width != 'auto') {
            w = parseFloat(s.width);
            if (me.isBorderBox()) {
                w -= me.getFrameWidth('lr');
            }
        }
        
        if (s.height && s.height != 'auto') {
            h = parseFloat(s.height);
            if (me.isBorderBox()) {
                h -= me.getFrameWidth('tb');
            }
        }
        
        return {width: w || me.getWidth(true), height: h || me.getHeight(true)};
    },

    
    selectable : function() {
        var me = this;
        me.dom.unselectable = "off";
        
        me.on('selectstart', function (e) {
            e.stopPropagation();
            return true;
        });
        me.applyStyles("-moz-user-select: text; -khtml-user-select: text;");
        me.removeCls(Ext.baseCSSPrefix + 'unselectable');
        return me;
    },
        
    
    unselectable : function() {
        var me = this;
        me.dom.unselectable = "on";

        me.swallowEvent("selectstart", true);
        me.applyStyles("-moz-user-select:-moz-none;-khtml-user-select:none;");
        me.addCls(Ext.baseCSSPrefix + 'unselectable');

        return me;
    }
});

})();



Ext.dom.Element.prototype.styleHooks = Ext.dom.AbstractElement.prototype.styleHooks;

Ext.onReady(function () {
    var opacityRe = /alpha\(opacity=(.*)\)/i,
        trimRe = /^\s+|\s+$/g;

    
    if (!Ext.supports.Opacity && Ext.isIE) {
        Ext.dom.Element.prototype.styleHooks.opacity = {
            name: 'opacity',
            get: function (dom) {
                var filter = dom.style.filter,
                    match, opacity;
                if (filter.match) {
                    match = filter.match(opacityRe);
                    if (match) {
                        opacity = parseFloat(match[1]);
                        if (!isNaN(opacity)) {
                            return opacity ? opacity / 100 : 0;
                        }
                    }
                }
                return 1;
            },
            set: function (dom, value) {
                var style = dom.style,
                    val = style.filter.replace(opacityRe, '').replace(trimRe, '');

                style.zoom = 1; 

                
                if (typeof(value) == 'number' && value >= 0 && value < 1) {
                    value *= 100;
                    style.filter = val + (val.length ? ' ' : '') + 'alpha(opacity='+value+')';
                } else {
                    style.filter = val;
                }
            }
        };
    }
    
    
});


if (Ext.isIEQuirks || Ext.isIE && Ext.ieVersion <= 8){
    Ext.Array.forEach('Top Right Bottom Left'.split(' '), function(side){
        var borderWidth = 'border' + side + 'Width',
            borderStyle = 'border' + side + 'Style';

        Ext.dom.Element.prototype.styleHooks['border-' + side.toLowerCase() + '-width'] = {
            name: borderWidth,
            get: function (dom) {
                var currentStyle = dom.currentStyle;
                if (currentStyle[borderStyle] == 'none'){
                    return '0px';
                }
                return currentStyle[borderWidth];
            }
        };
    });
}


Ext.dom.Element.override({
    select: function(selector) {
        return Ext.dom.Element.select(selector, false,  this.dom);
    }
});


Ext.define('Ext.dom.CompositeElementLite', {
    alternateClassName: 'Ext.CompositeElementLite',

    requires: ['Ext.dom.Element'],

    statics: {
        
        importElementMethods: function() {
            var name,
                elementPrototype = Ext.dom.Element.prototype,
                prototype = this.prototype;

            for (name in elementPrototype) {
                if (typeof elementPrototype[name] == 'function'){
                    (function(key) {
                        prototype[key] = prototype[key] || function() {
                            return this.invoke(key, arguments);
                        };
                    }).call(prototype, name);

                }
            }
        }
    },

    constructor: function(elements, root) {
        
        this.elements = [];
        this.add(elements, root);
        this.el = new Ext.dom.AbstractElement.Fly();
    },

    
    isComposite: true,

    
    getElement: function(el) {
        
        return this.el.attach(el);
    },

    
    transformElement: function(el) {
        return Ext.getDom(el);
    },

    
    getCount: function() {
        return this.elements.length;
    },

    
    add: function(els, root) {
        var elements = this.elements,
            i, ln;

        if (!els) {
            return this;
        }

        if (typeof els == "string") {
            els = Ext.dom.Element.selectorFunction(els, root);
        }
        else if (els.isComposite) {
            els = els.elements;
        }
        else if (!Ext.isIterable(els)) {
            els = [els];
        }

        for (i = 0, ln = els.length; i < ln; ++i) {
            elements.push(this.transformElement(els[i]));
        }

        return this;
    },

    invoke: function(fn, args) {
        var elements = this.elements,
            ln = elements.length,
            element,
            i;

        fn = Ext.dom.Element.prototype[fn];
        for (i = 0; i < ln; i++) {
            element = elements[i];

            if (element) {
                fn.apply(this.getElement(element), args);
            }
        }
        return this;
    },

    
    item: function(index) {
        var el = this.elements[index],
            out = null;

        if (el) {
            out = this.getElement(el);
        }

        return out;
    },

    
    addListener: function(eventName, handler, scope, opt) {
        var els = this.elements,
                len = els.length,
                i, e;

        for (i = 0; i < len; i++) {
            e = els[i];
            if (e) {
                Ext.EventManager.on(e, eventName, handler, scope || e, opt);
            }
        }
        return this;
    },
    
    each: function(fn, scope) {
        var me = this,
                els = me.elements,
                len = els.length,
                i, e;

        for (i = 0; i < len; i++) {
            e = els[i];
            if (e) {
                e = this.getElement(e);
                if (fn.call(scope || e, e, me, i) === false) {
                    break;
                }
            }
        }
        return me;
    },

    
    fill: function(els) {
        var me = this;
        me.elements = [];
        me.add(els);
        return me;
    },

    
    filter: function(selector) {
        var els = [],
                me = this,
                fn = Ext.isFunction(selector) ? selector
                        : function(el) {
                    return el.is(selector);
                };

        me.each(function(el, self, i) {
            if (fn(el, i) !== false) {
                els[els.length] = me.transformElement(el);
            }
        });

        me.elements = els;
        return me;
    },

    
    indexOf: function(el) {
        return Ext.Array.indexOf(this.elements, this.transformElement(el));
    },

    
    replaceElement: function(el, replacement, domReplace) {
        var index = !isNaN(el) ? el : this.indexOf(el),
                d;
        if (index > -1) {
            replacement = Ext.getDom(replacement);
            if (domReplace) {
                d = this.elements[index];
                d.parentNode.insertBefore(replacement, d);
                Ext.removeNode(d);
            }
            Ext.Array.splice(this.elements, index, 1, replacement);
        }
        return this;
    },

    
    clear: function() {
        this.elements = [];
    },

    addElements: function(els, root) {
        if (!els) {
            return this;
        }

        if (typeof els == "string") {
            els = Ext.dom.Element.selectorFunction(els, root);
        }

        var yels = this.elements;

        Ext.each(els, function(e) {
            yels.push(Ext.get(e));
        });

        return this;
    },

    
    first: function() {
        return this.item(0);
    },

    
    last: function() {
        return this.item(this.getCount() - 1);
    },

    
    contains: function(el) {
        return this.indexOf(el) != -1;
    },

    
    removeElement: function(keys, removeDom) {
        var me = this,
                elements = this.elements,
                el;

        Ext.each(keys, function(val) {
            if ((el = (elements[val] || elements[val = me.indexOf(val)]))) {
                if (removeDom) {
                    if (el.dom) {
                        el.remove();
                    }
                    else {
                        Ext.removeNode(el);
                    }
                }
                Ext.Array.erase(elements, val, 1);
            }
        });

        return this;
    }

}, function() {
    this.importElementMethods();

    this.prototype.on = this.prototype.addListener;

    if (Ext.DomQuery){
        Ext.dom.Element.selectorFunction = Ext.DomQuery.select;
    }

    
   Ext.dom.Element.select = function(selector, root) {
        var elements;

        if (typeof selector == "string") {
            elements = Ext.dom.Element.selectorFunction(selector, root);
        }
        else if (selector.length !== undefined) {
            elements = selector;
        }
        else {
        }

        return new Ext.CompositeElementLite(elements);
    };

    
    Ext.select = function() {
        return Ext.dom.Element.select.apply(Ext.dom.Element, arguments);
    };
});


Ext.define('Ext.dom.CompositeElement', {
    alternateClassName: 'Ext.CompositeElement',

    extend: 'Ext.dom.CompositeElementLite',

    
    getElement: function(el) {
        
        return el;
    },

    
    transformElement: function(el) {
        return Ext.get(el);
    }

}, function() {
    

    Ext.dom.Element.select = function(selector, unique, root) {
        var elements;

        if (typeof selector == "string") {
            elements = Ext.dom.Element.selectorFunction(selector, root);
        }
        else if (selector.length !== undefined) {
            elements = selector;
        }
        else {
        }
        return (unique === true) ? new Ext.CompositeElement(elements) : new Ext.CompositeElementLite(elements);
    };
});


Ext.select = Ext.Element.select;
Ext._endTime = new Date().getTime();