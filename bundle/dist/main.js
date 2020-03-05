(function(graph){
        function require(module){
            function localRequire(relativePath){
                return require(graph[module].dependecies[relativePath])
            }
            var exports = {};
            (function(require,exports,code){
                eval(code);
            })(localRequire,exports,graph[module].code);
            console.log(exports);
            return exports;
        }
        require('./src/index.js');
    })({"./src/index.js":{"dependecies":{"./hello.js":"./src/hello.js"},"code":"\"use strict\";\n\nvar _hello = require(\"./hello.js\");\n\ndocument.write((0, _hello.say)(\"webapck\"));"},"./src/hello.js":{"dependecies":{"./world.js":"./src/world.js"},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.say = say;\n\nvar _world = require(\"./world.js\");\n\nfunction say(name) {\n  return \"hello \" + name + \";\" + (0, _world.tellYou)();\n}"},"./src/world.js":{"dependecies":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.tellYou = tellYou;\n\nfunction tellYou(name) {\n  return \"love webpack\";\n}"}})