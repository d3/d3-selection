var tape = require("tape"),
    jsdom = require("jsdom"),
    selection = require("../../lib/d3/selection");

tape("d3.selectAll can select an array of elements", function(test) {
  var document = jsdom.jsdom("<h1>hello</h1><h2>world</h2>"),
      h1 = document.querySelector("h1"),
      h2 = document.querySelector("h2"),
      s = selection.selectAll([h1, h2]);
  test.ok(s instanceof selection, "is a selection");
  test.equal(s._depth, 1, "_depth is one");
  test.ok(Array.isArray(s._root), "_root is an array");
  test.equal(s._root.length, 2, "_root has the expected length");
  test.equal(s._root[0], h1, "_root has the selected elements");
  test.equal(s._root[1], h2, "_root has the selected elements");
  test.equal(s._root._parent, null, "_root._parent is null");
  test.equal(s._enter, null, "_enter is null");
  test.equal(s._exit, null, "_exit is null");
  test.end();
});

tape("d3.selectAll can select a NodeList of elements", function(test) {
  var document = jsdom.jsdom("<h1>hello</h1><h2>world</h2>"),
      h1 = document.querySelector("h1"),
      h2 = document.querySelector("h2"),
      s = selection.selectAll(document.querySelectorAll("h1,h2"));
  test.ok(s instanceof selection, "is a selection");
  test.equal(s._depth, 1, "_depth is one");
  test.ok(s._root instanceof document.defaultView.NodeList, "_root is a NodeList");
  test.equal(s._root.length, 2, "_root has the expected length");
  test.equal(s._root[0], h1, "_root has the selected elements");
  test.equal(s._root[1], h2, "_root has the selected elements");
  test.equal(s._root._parent, null, "_root._parent is null");
  test.equal(s._enter, null, "_enter is null");
  test.equal(s._exit, null, "_exit is null");
  test.end();
});

tape("d3.selectAll can select an empty array", function(test) {
  var document = jsdom.jsdom("<h1>hello</h1><h2>world</h2>"),
      s = selection.selectAll([]);
  test.ok(s instanceof selection, "is a selection");
  test.equal(s._depth, 1, "_depth is one");
  test.ok(Array.isArray(s._root), "_root is an array");
  test.equal(s._root.length, 0, "_root has zero length");
  test.equal(s._root._parent, null, "_root._parent is null");
  test.equal(s._enter, null, "_enter is null");
  test.equal(s._exit, null, "_exit is null");
  test.end();
});

tape("d3.selectAll can select an array that contains null", function(test) {
  var document = jsdom.jsdom("<h1>hello</h1><h2>world</h2>"),
      h1 = document.querySelector("h1"),
      s = selection.selectAll([null, h1, null]);
  test.ok(s instanceof selection, "is a selection");
  test.equal(s._depth, 1, "_depth is one");
  test.ok(Array.isArray(s._root), "_root is an array");
  test.equal(s._root.length, 3, "_root has the expected length");
  test.equal(s._root[0], null, "_root has the selected elements");
  test.equal(s._root[1], h1, "_root has the selected elements");
  test.equal(s._root[2], null, "_root has the selected elements");
  test.equal(s._root._parent, null, "_root._parent is null");
  test.equal(s._enter, null, "_enter is null");
  test.equal(s._exit, null, "_exit is null");
  test.end();
});

tape("d3.selectAll can select an array that contains arbitrary objects", function(test) {
  var object = {},
      s = selection.selectAll([object]);
  test.ok(s instanceof selection, "is a selection");
  test.equal(s._depth, 1, "_depth is one");
  test.ok(Array.isArray(s._root), "_root is an array");
  test.equal(s._root.length, 1, "_root has the expected length");
  test.equal(s._root[0], object, "_root has the selected objects");
  test.equal(s._root._parent, null, "_root._parent is null");
  test.equal(s._enter, null, "_enter is null");
  test.equal(s._exit, null, "_exit is null");
  test.end();
});
