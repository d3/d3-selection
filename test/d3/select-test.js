var tape = require("tape"),
    jsdom = require("jsdom"),
    selection = require("../../lib/d3/selection");

tape("d3.select can select an element", function(test) {
  var document = jsdom.jsdom("<h1>hello</h1>"),
      s = selection.select(document.documentElement);
  test.ok(s instanceof selection);
  test.equal(s._depth, 1);
  test.ok(Array.isArray(s._root));
  test.equal(s._root.length, 1);
  test.equal(s._root[0], document.documentElement);
  test.equal(s._root._parent, null);
  test.equal(s._enter, null);
  test.equal(s._exit, null);
  test.end();
});

tape("d3.select can select a window", function(test) {
  var document = jsdom.jsdom("<h1>hello</h1>"),
      s = selection.select(document.defaultView);
  test.ok(s instanceof selection);
  test.equal(s._depth, 1);
  test.ok(Array.isArray(s._root));
  test.equal(s._root.length, 1);
  test.equal(s._root[0], document.defaultView);
  test.equal(s._root._parent, null);
  test.equal(s._enter, null);
  test.equal(s._exit, null);
  test.end();
});

tape("d3.select can select a document", function(test) {
  var document = jsdom.jsdom("<h1>hello</h1>"),
      s = selection.select(document);
  test.ok(s instanceof selection);
  test.equal(s._depth, 1);
  test.ok(Array.isArray(s._root));
  test.equal(s._root.length, 1);
  test.equal(s._root[0], document);
  test.equal(s._root._parent, null);
  test.equal(s._enter, null);
  test.equal(s._exit, null);
  test.end();
});

tape("d3.select can select a document element", function(test) {
  var document = jsdom.jsdom("<h1>hello</h1>"),
      s = selection.select(document.documentElement);
  test.ok(s instanceof selection);
  test.equal(s._depth, 1);
  test.ok(Array.isArray(s._root));
  test.equal(s._root.length, 1);
  test.equal(s._root[0], document.documentElement);
  test.equal(s._root._parent, null);
  test.equal(s._enter, null);
  test.equal(s._exit, null);
  test.end();
});

tape("d3.select can select null", function(test) {
  var document = jsdom.jsdom("<h1>hello</h1>"),
      s = selection.select(null);
  test.ok(s instanceof selection);
  test.equal(s._depth, 1);
  test.ok(Array.isArray(s._root));
  test.equal(s._root.length, 1);
  test.equal(s._root[0], null);
  test.equal(s._root._parent, null);
  test.equal(s._enter, null);
  test.equal(s._exit, null);
  test.end();
});

tape("d3.select can select an arbitrary object", function(test) {
  var object = {},
      s = selection.select(object);
  test.ok(s instanceof selection);
  test.equal(s._depth, 1);
  test.ok(Array.isArray(s._root));
  test.equal(s._root.length, 1);
  test.equal(s._root[0], object);
  test.equal(s._root._parent, null);
  test.equal(s._enter, null);
  test.equal(s._exit, null);
  test.end();
});
