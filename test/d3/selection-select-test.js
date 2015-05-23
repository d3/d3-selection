var tape = require("tape"),
    jsdom = require("jsdom"),
    selection = require("../../lib/d3/selection");

tape("selection.select can select elements (in the simplest case)", function(test) {
  var document = jsdom.jsdom("<h1>hello</h1>"),
      h1 = document.querySelector("h1"),
      s = selection.select(document.documentElement).select("h1");
  test.ok(s instanceof selection);
  test.equal(s._depth, 1, "_depth is one");
  test.ok(Array.isArray(s._root), "_root is an array");
  test.equal(s._root.length, 1, "_root has length one");
  test.equal(s._root[0], h1, "_root contains the selected elements");
  test.equal(s._root._parent, null, "_root._parent is null");
  test.equal(s._enter, null, "_enter is null");
  test.equal(s._exit, null, "_exit is null");
  test.end();
});

tape("selection.select can select elements (where there are multiple matches)", function(test) {
  var document = jsdom.jsdom("<h1>hello</h1><h2>world</h2>"),
      h1 = document.querySelector("h1"),
      s = selection.select(document.documentElement).select("h2,h1");
  test.ok(s instanceof selection);
  test.equal(s._depth, 1, "_depth is one");
  test.ok(Array.isArray(s._root), "_root is an array");
  test.equal(s._root.length, 1, "_root has length one");
  test.equal(s._root[0], h1, "_root contains the selected elements");
  test.equal(s._root._parent, null, "_root._parent is null");
  test.equal(s._enter, null, "_enter is null");
  test.equal(s._exit, null, "_exit is null");
  test.end();
});

tape("selection.select can select elements (with multiple originating elements)", function(test) {
  var document = jsdom.jsdom("<h1><span>hello</span></h1><h2><span>world</span></h2>"),
      h1 = document.querySelector("h1"),
      h2 = document.querySelector("h2"),
      s = selection.selectAll([h1, h2]).select("span");
  test.ok(s instanceof selection);
  test.equal(s._depth, 1, "_depth is one");
  test.ok(Array.isArray(s._root), "_root is an array");
  test.equal(s._root.length, 2, "_root has the expected length");
  test.equal(s._root[0], h1.firstChild, "_root contains the selected elements");
  test.equal(s._root[1], h2.firstChild, "_root contains the selected elements");
  test.equal(s._root._parent, null, "_root._parent is null");
  test.equal(s._enter, null, "_enter is null");
  test.equal(s._exit, null, "_exit is null");
  test.end();
});

tape("selection.select can select elements (with a null originating element)", function(test) {
  var document = jsdom.jsdom("<h1><span>hello</span></h1>"),
      h1 = document.querySelector("h1"),
      s = selection.selectAll([h1, null]).select("span");
  test.ok(s instanceof selection);
  test.equal(s._depth, 1, "_depth is one");
  test.ok(Array.isArray(s._root), "_root is an array");
  test.equal(s._root.length, 2, "_root has the expected length");
  test.equal(s._root[0], h1.firstChild, "_root contains the selected elements");
  test.ok(!(1 in s._root), "_root is missing entries where update is null");
  test.equal(s._root._parent, null, "_root._parent is null");
  test.equal(s._enter, null, "_enter is null");
  test.equal(s._exit, null, "_exit is null");
  test.end();
});

// TODO verify data propagation
// TODO verify _parent propagation
// TODO select where the originating selection is nested
// TODO select where the originating selection is nested and some are null
// TODO test selector function is passed expected arguments (d, i, …)
// TODO test moving of elements from enter to update
