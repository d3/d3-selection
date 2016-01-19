var tape = require("tape"),
    jsdom = require("jsdom"),
    d3 = require("../");

tape("d3.select returns a selection", function(test) {
  var document = jsdom.jsdom("<h1>hello</h1>");
  test.ok(d3.select(document.body) instanceof d3.selection);
  test.end();
});

tape("d3.select can select by string", function(test) {
  var document = global.document = jsdom.jsdom();
  try {
    test.deepEqual(d3.select("body"), {_nodes: [[document.body]], _parents: [null]});
    test.end();
  } finally {
    delete global.document;
  }
});

tape("d3.select can select an element", function(test) {
  var document = jsdom.jsdom("<h1>hello</h1>");
  test.deepEqual(d3.select(document.body), {_nodes: [[document.body]], _parents: [null]});
  test.end();
});

tape("d3.select can select a window", function(test) {
  var document = jsdom.jsdom("<h1>hello</h1>");
  test.deepEqual(d3.select(document.defaultView), {_nodes: [[document.defaultView]], _parents: [null]});
  test.end();
});

tape("d3.select can select a document", function(test) {
  var document = jsdom.jsdom("<h1>hello</h1>");
  test.deepEqual(d3.select(document), {_nodes: [[document]], _parents: [null]});
  test.end();
});

tape("d3.select can select a document element", function(test) {
  var document = jsdom.jsdom("<h1>hello</h1>");
  test.deepEqual(d3.select(document.documentElement), {_nodes: [[document.documentElement]], _parents: [null]});
  test.end();
});

tape("d3.select can select null", function(test) {
  var document = jsdom.jsdom("<h1>hello</h1>");
  test.deepEqual(d3.select(null), {_nodes: [[null]], _parents: [null]});
  test.end();
});

tape("d3.select can select an arbitrary object", function(test) {
  var object = {};
  test.deepEqual(d3.select(object), {_nodes: [[object]], _parents: [null]});
  test.end();
});
