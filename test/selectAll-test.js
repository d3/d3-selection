var tape = require("tape"),
    jsdom = require("jsdom"),
    d3 = require("../");

tape("selectAll(…) returns a selection", function(test) {
  var document = jsdom.jsdom("<h1>hello</h1>");
  test.ok(d3.selectAll([document.body]) instanceof d3.selection);
  test.end();
});

tape("selectAll(string) selects all elements that match the selector string, in order", function(test) {
  var document = global.document = jsdom.jsdom("<h1 id='one'>foo</h1><h1 id='two'>bar</h1>");
  try {
    test.deepEqual(d3.selectAll("h1"), {_nodes: [document.querySelectorAll("h1")], _parents: [null]});
    test.end();
  } finally {
    delete global.document;
  }
});

tape("selectAll(nodeList) selects a NodeList of elements", function(test) {
  var document = jsdom.jsdom("<h1>hello</h1><h2>world</h2>");
  test.deepEqual(d3.selectAll(document.querySelectorAll("h1,h2")), {_nodes: [document.querySelectorAll("h1,h2")], _parents: [null]});
  test.end();
});

tape("selectAll(array) selects an array of elements", function(test) {
  var document = jsdom.jsdom("<h1>hello</h1><h2>world</h2>"),
      h1 = document.querySelector("h1"),
      h2 = document.querySelector("h2");
  test.deepEqual(d3.selectAll([h1, h2]), {_nodes: [[h1, h2]], _parents: [null]});
  test.end();
});

tape("selectAll(array) can select an empty array", function(test) {
  test.deepEqual(d3.selectAll([]), {_nodes: [[]], _parents: [null]});
  test.end();
});

tape("selectAll(array) can select an array that contains null", function(test) {
  var document = jsdom.jsdom("<h1>hello</h1><h2>world</h2>"),
      h1 = document.querySelector("h1");
  test.deepEqual(d3.selectAll([null, h1, null]), {_nodes: [[null, h1, null]], _parents: [null]});
  test.end();
});

tape("selectAll(array) can select an array that contains arbitrary objects", function(test) {
  var object = {};
  test.deepEqual(d3.selectAll([object]), {_nodes: [[object]], _parents: [null]});
  test.end();
});
