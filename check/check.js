// 1.
/*var page = require('webpage').create();
page.open('http://www.baidu.com/', function(status) {
    // setTimeout(function() {
    //     page.render('./baidu.png');
    //     phantom.exit();
    // }, 200);

    if (status === 'success') {
        // page.render('./baidu2.png');
        // phantom.exit();
        var title = page.evaluate(function () {
            return document.title;
        })
        console.log(title);

    }
    phantom.exit();
});*/

// 2.
/*var page = require('webpage').create();
page.open('http://localhost:8080/', function (status) {
    console.log('status:', status);
    if (status === 'success') {
        var body = page.evaluate(function () {
            return document.body.children.length
        });
        console.log(body)
    }
    phantom.exit();
})*/

// 3.
/*var page = require('webpage').create();
page.open('http://localhost:8080/', function (status) {
    console.log('status:', status);
    if (status === 'success') {
        var body = page.evaluate(function () {
            var toString = function (pad, element) {
                var children = element.children;
                var childrenString = '';
                for (var i=0; i<children.length; i++) {
                    childrenString += toString('  ' + pad,  element.children[i]) + '\n';
                }
                var name = element.tagName || element.content;
                return pad + name + (childrenString ? '\n' + childrenString: '');
            };
            return toString('', document.body)
        });
        console.log(body)
    }
    phantom.exit();
})*/


// 4.
var page = require('webpage').create();
page.open('http://localhost:8080/', function (status) {
    console.log('status:', status);
    console.log(Node.TEXT_NODE)
    if (status === 'success') {
        var body = page.evaluate(function () {
            var toString = function (pad, element) {
                var children = element.children;
                // return children;
                var childrenString = '';
                for (var i=0; i<children.length; i++) {
                    childrenString += toString('  ' + pad,  element.children[i]) + '\n';
                }
                var name;
                if (element.nodeType === Node.TEXT_NODE) {
                    name = '#text' + JSON.stringify(element.textContent);
                }
                if (element.nodeType === Node.ELEMENT_NODE) {
                    name = element.tagName;
                }
                return pad + name + (childrenString ? '\n' + childrenString: '');
            };
            return toString('', document.body)
        });
        // console.log(JSON.stringify(body[0].childNodes))
        console.log(body)
    }
    phantom.exit();
})



