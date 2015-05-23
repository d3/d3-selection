var tape = require("tape"),
    jsdom = require("jsdom"),
    selection = require("../../lib/d3/selection");

tape("d3.select can select an element", function(test) {
  var document = jsdom.jsdom("<h1>hello</h1>"),
      s = selection.select(document.documentElement);
  test.ok(s instanceof selection, "is a selection");
  test.equal(s._depth, 1, "_depth is one");
  test.ok(Array.isArray(s._root), "_root is an array");
  test.equal(s._root.length, 1, "_root has length one");
  test.equal(s._root[0], document.documentElement, "_root[0] is the selected element");
  test.equal(s._root._parent, null, "_root._parent is null");
  test.equal(s._enter, null, "_enter is null");
  test.equal(s._exit, null, "_exit is null");
  test.end();
});

tape("d3.select can select a window", function(test) {
  var document = jsdom.jsdom("<h1>hello</h1>"),
      s = selection.select(document.defaultView);
  test.ok(s instanceof selection, "is a selection");
  test.equal(s._depth, 1, "_depth is one");
  test.ok(Array.isArray(s._root), "_root is an array");
  test.equal(s._root.length, 1, "_root has length one");
  test.equal(s._root[0], document.defaultView, "_root[0] is the selected element");
  test.equal(s._root._parent, null, "_root._parent is null");
  test.equal(s._enter, null, "_enter is null");
  test.equal(s._exit, null, "_exit is null");
  test.end();
});

tape("d3.select can select a document", function(test) {
  var document = jsdom.jsdom("<h1>hello</h1>"),
      s = selection.select(document);
  test.ok(s instanceof selection, "is a selection");
  test.equal(s._depth, 1, "_depth is one");
  test.ok(Array.isArray(s._root), "_root is an array");
  test.equal(s._root.length, 1, "_root has length one");
  test.equal(s._root[0], document, "_root[0] is the selected element");
  test.equal(s._root._parent, null, "_root._parent is null");
  test.equal(s._enter, null, "_enter is null");
  test.equal(s._exit, null, "_exit is null");
  test.end();
});

tape("d3.select can select a document element", function(test) {
  var document = jsdom.jsdom("<h1>hello</h1>"),
      s = selection.select(document.documentElement);
  test.ok(s instanceof selection, "is a selection");
  test.equal(s._depth, 1, "_depth is one");
  test.ok(Array.isArray(s._root), "_root is an array");
  test.equal(s._root.length, 1, "_root has length one");
  test.equal(s._root[0], document.documentElement, "_root[0] is the selected element");
  test.equal(s._root._parent, null, "_root._parent is null");
  test.equal(s._enter, null, "_enter is null");
  test.equal(s._exit, null, "_exit is null");
  test.end();
});

tape("d3.select can select null", function(test) {
  var document = jsdom.jsdom("<h1>hello</h1>"),
      s = selection.select(null);
  test.ok(s instanceof selection, "is a selection");
  test.equal(s._depth, 1, "_depth is one");
  test.ok(Array.isArray(s._root), "_root is an array");
  test.equal(s._root.length, 1, "_root has length one");
  test.equal(s._root[0], null, "_root[0] is null");
  test.equal(s._root._parent, null, "_root._parent is null");
  test.equal(s._enter, null, "_enter is null");
  test.equal(s._exit, null, "_exit is null");
  test.end();
});

tape("d3.select can select an arbitrary object", function(test) {
  var object = {},
      s = selection.select(object);
  test.ok(s instanceof selection, "is a selection");
  test.equal(s._depth, 1, "_depth is one");
  test.ok(Array.isArray(s._root), "_root is an array");
  test.equal(s._root.length, 1, "_root has length one");
  test.equal(s._root[0], object, "_root[0] is the selected object");
  test.equal(s._root._parent, null, "_root._parent is null");
  test.equal(s._enter, null, "_enter is null");
  test.equal(s._exit, null, "_exit is null");
  test.end();
});
