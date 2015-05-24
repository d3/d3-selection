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

tape("selection.select will propagate data if defined on the originating element", function(test) {
  var document = jsdom.jsdom("<parent><child>hello</child></parent>"),
      parent = document.querySelector("parent"),
      child = document.querySelector("child");
  parent.__data__ = 0; // still counts as data even though falsey
  child.__data__ = 42;
  selection.select(parent).select("child");
  test.equal(child.__data__, 0, "parent datum was propagated to child");
  test.end();
});

tape("selection.select will not propagate data if not defined on the originating element", function(test) {
  var document = jsdom.jsdom("<parent><child>hello</child></parent>"),
      parent = document.querySelector("parent"),
      child = document.querySelector("child");
  child.__data__ = 42;
  selection.select(parent).select("child");
  test.equal(child.__data__, 42, "child datum was not overwritten");
  test.end();
});

tape("selection.select will propagate parents if defined on the originating groups", function(test) {
  var document = jsdom.jsdom("<parent><child>1</child></parent><parent><child>2</child></parent>"),
      root = document.documentElement,
      s = selection.select(root).selectAll("parent").select("child");
  test.equal(s._root[0]._parent, root, "has the expected parent");
  test.end();
});

tape("selection.select can select elements (when the originating selection is nested)", function(test) {
  var document = jsdom.jsdom("<parent id='one'><child><span>1</span></child></parent><parent id='two'><child><span>2</span></child></parent>"),
      s = selection.selectAll(document.querySelectorAll("parent")).selectAll("child").select("span");
  test.equal(s._depth, 2, "has the expected structure");
  test.equal(s._root.length, 2, "has the expected structure");
  test.equal(s._root[0].length, 1, "has the expected structure");
  test.equal(s._root[1].length, 1, "has the expected structure");
  test.equal(s._root._parent, null, "has the expected parent");
  test.equal(s._root[0]._parent, document.querySelector("#one"), "has the expected parent");
  test.equal(s._root[1]._parent, document.querySelector("#two"), "has the expected parent");
  test.equal(s._root[0][0], document.querySelector("#one span"), "has the expected elements");
  test.equal(s._root[1][0], document.querySelector("#two span"), "has the expected elements");
  test.end();
});

tape("selection.select can select elements (when the originating selection contains null)", function(test) {
  var document = jsdom.jsdom("<parent id='one'></parent><parent id='two'><child><span>2</span></child></parent>"),
      s = selection.selectAll(document.querySelectorAll("parent")).select("child").select("span");
  test.equal(s._depth, 1, "has the expected structure");
  test.equal(s._root.length, 2, "has the expected structure");
  test.equal(s._root._parent, null, "has the expected parent");
  test.equal(s._root[0], undefined, "has the expected elements");
  test.equal(s._root[1], document.querySelector("#two span"), "has the expected elements");
  test.end();
});

tape("selection.select can select elements (when the originating selection is nested and contains null)", function(test) {
  var document = jsdom.jsdom("<parent id='one'><child></child></parent><parent id='two'><child><span><b>2</b></span></child></parent>"),
      s = selection.selectAll(document.querySelectorAll("parent")).selectAll("child").select("span").select("b");
  test.equal(s._depth, 2, "has the expected structure");
  test.equal(s._root.length, 2, "has the expected structure");
  test.equal(s._root[0].length, 1, "has the expected structure");
  test.equal(s._root[1].length, 1, "has the expected structure");
  test.equal(s._root[0][0], undefined, "has the expected elements");
  test.equal(s._root[1][0], document.querySelector("#two b"), "has the expected elements");
  test.equal(s._root._parent, null, "has the expected parent");
  test.equal(s._root[0]._parent, document.querySelector("#one"), "has the expected parent");
  test.equal(s._root[1]._parent, document.querySelector("#two"), "has the expected parent");
  test.end();
});

tape("selection.select passes the selector function data and index", function(test) {
  var document = jsdom.jsdom("<parent id='one'><child><span><b>1</b></span></child></parent><parent id='two'><child><span><b>2</b></span></child></parent>"),
      results = [],
      s = selection.selectAll(document.querySelectorAll("parent")).datum(function(d, i) { return "parent-" + i; }).selectAll("child").datum(function(d, i, p, j) { return "child-" + i + "-" + j; }).select("span").select(function() { results.push({this: this, arguments: [].slice.call(arguments)}); });
  test.equal(document.querySelector("#one").__data__, "parent-0");
  test.equal(document.querySelector("#two").__data__, "parent-1");
  test.equal(results.length, 2, "was invoked once per element");
  test.equal(results[0].this, document.querySelector("#one span"), "has the expected this context");
  test.equal(results[1].this, document.querySelector("#two span"), "has the expected this context");
  test.equal(results[0].arguments.length, 4, "has the expected number of arguments");
  test.equal(results[0].arguments[0], "child-0-0", "has the expected data");
  test.equal(results[0].arguments[1], 0, "has the expected index");
  test.equal(results[0].arguments[2], "parent-0", "has the expected data");
  test.equal(results[0].arguments[3], 0, "has the expected index");
  test.equal(results[1].arguments[0], "child-0-1", "has the expected data");
  test.equal(results[1].arguments[1], 0, "has the expected index");
  test.equal(results[1].arguments[2], "parent-1", "has the expected data");
  test.equal(results[1].arguments[3], 1, "has the expected index");
  test.end();
});

tape("selection.select moves enter nodes to the update selection", function(test) {
  var document = jsdom.jsdom(),
      nodes = [],
      update = selection.select(document.documentElement).selectAll("p").data([0, 1, 2]),
      enter = update.enter();
  test.equal(enter._root.length, 1, "enter selection initially contains enter nodes");
  test.equal(enter._root[0].length, 3, "enter selection initially contains enter nodes");
  test.equal(enter._root[0][0].__data__, 0, "enter selection initially contains enter nodes");
  test.equal(enter._root[0][1].__data__, 1, "enter selection initially contains enter nodes");
  test.equal(enter._root[0][2].__data__, 2, "enter selection initially contains enter nodes");
  test.equal(update._root.length, 1, "update selection is initially empty");
  test.equal(update._root[0].length, 3, "update selection is initially empty");
  test.equal(update._root[0][0], undefined, "update selection is initially empty");
  test.equal(update._root[0][1], undefined, "update selection is initially empty");
  test.equal(update._root[0][2], undefined, "update selection is initially empty");
  enter.select(function() { var p = this.appendChild(document.createElement("P")); nodes.push(p); return p; });
  test.equal(enter._root.length, 1, "enter selection is subsequentyl empty");
  test.equal(enter._root[0].length, 3, "enter selection is subsequentyl empty");
  test.equal(enter._root[0][0], undefined, "enter selection is subsequentyl empty");
  test.equal(enter._root[0][1], undefined, "enter selection is subsequentyl empty");
  test.equal(enter._root[0][2], undefined, "enter selection is subsequentyl empty");
  test.equal(update._root.length, 1, "update selection subsequently contains materialized nodes");
  test.equal(update._root[0].length, 3, "update selection subsequently contains materialized nodes");
  test.equal(update._root[0][0], nodes[0], "update selection subsequently contains materialized nodes");
  test.equal(update._root[0][1], nodes[1], "update selection subsequently contains materialized nodes");
  test.equal(update._root[0][2], nodes[2], "update selection subsequently contains materialized nodes");
  test.equal(update._root[0][0].__data__, 0, "update selection subsequently contains materialized nodes");
  test.equal(update._root[0][1].__data__, 1, "update selection subsequently contains materialized nodes");
  test.equal(update._root[0][2].__data__, 2, "update selection subsequently contains materialized nodes");
  test.end();
});
