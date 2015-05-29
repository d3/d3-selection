var tape = require("tape"),
    jsdom = require("jsdom"),
    d3 = require("../build/d3");

tape("selection.select can select elements (in the simplest case)", function(test) {
  var document = jsdom.jsdom("<h1>hello</h1>"),
      h1 = document.querySelector("h1"),
      s = d3.select(document.body).select("h1");
  test.ok(s instanceof d3.selection);
  test.equal(s._depth, 1);
  test.ok(Array.isArray(s._root));
  test.equal(s._root.length, 1);
  test.equal(s._root[0], h1);
  test.equal(s._root._parent, null);
  test.equal(s._enter, null);
  test.equal(s._exit, null);
  test.end();
});

tape("selection.select will select the first element of multiple matches", function(test) {
  var document = jsdom.jsdom("<h1>hello</h1><h2>world</h2>"),
      h1 = document.querySelector("h1"),
      s = d3.select(document.body).select("h2,h1");
  test.ok(s instanceof d3.selection);
  test.equal(s._depth, 1);
  test.ok(Array.isArray(s._root));
  test.equal(s._root.length, 1);
  test.equal(s._root[0], h1);
  test.equal(s._root._parent, null);
  test.equal(s._enter, null);
  test.equal(s._exit, null);
  test.end();
});

tape("selection.select can select elements (with multiple originating elements)", function(test) {
  var document = jsdom.jsdom("<h1><span>hello</span></h1><h2><span>world</span></h2>"),
      h1 = document.querySelector("h1"),
      h2 = document.querySelector("h2"),
      s = d3.selectAll([h1, h2]).select("span");
  test.ok(s instanceof d3.selection);
  test.equal(s._depth, 1);
  test.ok(Array.isArray(s._root));
  test.equal(s._root.length, 2);
  test.equal(s._root[0], h1.firstChild);
  test.equal(s._root[1], h2.firstChild);
  test.equal(s._root._parent, null);
  test.equal(s._enter, null);
  test.equal(s._exit, null);
  test.end();
});

tape("selection.select can select elements (with a null originating element)", function(test) {
  var document = jsdom.jsdom("<h1><span>hello</span></h1>"),
      h1 = document.querySelector("h1"),
      s = d3.selectAll([h1, null]).select("span");
  test.ok(s instanceof d3.selection);
  test.equal(s._depth, 1);
  test.ok(Array.isArray(s._root));
  test.equal(s._root.length, 2);
  test.equal(s._root[0], h1.firstChild);
  test.ok(!(1 in s._root));
  test.equal(s._root._parent, null);
  test.equal(s._enter, null);
  test.equal(s._exit, null);
  test.end();
});

tape("selection.select will propagate data if defined on the originating element", function(test) {
  var document = jsdom.jsdom("<parent><child>hello</child></parent>"),
      parent = document.querySelector("parent"),
      child = document.querySelector("child");
  parent.__data__ = 0; // still counts as data even though falsey
  child.__data__ = 42;
  d3.select(parent).select("child");
  test.equal(child.__data__, 0);
  test.end();
});

tape("selection.select will not propagate data if not defined on the originating element", function(test) {
  var document = jsdom.jsdom("<parent><child>hello</child></parent>"),
      parent = document.querySelector("parent"),
      child = document.querySelector("child");
  child.__data__ = 42;
  d3.select(parent).select("child");
  test.equal(child.__data__, 42);
  test.end();
});

tape("selection.select will propagate parents if defined on the originating groups", function(test) {
  var document = jsdom.jsdom("<parent><child>1</child></parent><parent><child>2</child></parent>"),
      root = document.body,
      s = d3.select(root).selectAll("parent").select("child");
  test.equal(s._root[0]._parent, root);
  test.end();
});

tape("selection.select can select elements (when the originating selection is nested)", function(test) {
  var document = jsdom.jsdom("<parent id='one'><child><span>1</span></child></parent><parent id='two'><child><span>2</span></child></parent>"),
      s = d3.selectAll(document.querySelectorAll("parent")).selectAll("child").select("span");
  test.equal(s._depth, 2);
  test.equal(s._root.length, 2);
  test.equal(s._root[0].length, 1);
  test.equal(s._root[1].length, 1);
  test.ok(Array.isArray(s._root));
  test.ok(Array.isArray(s._root[0]));
  test.ok(Array.isArray(s._root[1]));
  test.equal(s._root._parent, null);
  test.equal(s._root[0]._parent, document.querySelector("#one"));
  test.equal(s._root[1]._parent, document.querySelector("#two"));
  test.equal(s._root[0][0], document.querySelector("#one span"));
  test.equal(s._root[1][0], document.querySelector("#two span"));
  test.end();
});

tape("selection.select can select elements (when the originating selection contains null)", function(test) {
  var document = jsdom.jsdom("<parent id='one'></parent><parent id='two'><child><span>2</span></child></parent>"),
      s = d3.selectAll(document.querySelectorAll("parent")).select("child").select("span");
  test.equal(s._depth, 1);
  test.ok(Array.isArray(s._root));
  test.equal(s._root.length, 2);
  test.equal(s._root._parent, null);
  test.ok(!(0 in s._root));
  test.equal(s._root[1], document.querySelector("#two span"));
  test.end();
});

tape("selection.select can select elements (when the originating selection is nested and contains null)", function(test) {
  var document = jsdom.jsdom("<parent id='one'><child></child></parent><parent id='two'><child><span><b>2</b></span></child></parent>"),
      s = d3.selectAll(document.querySelectorAll("parent")).selectAll("child").select("span").select("b");
  test.equal(s._depth, 2);
  test.equal(s._root.length, 2);
  test.equal(s._root[0].length, 1);
  test.equal(s._root[1].length, 1);
  test.ok(Array.isArray(s._root));
  test.ok(Array.isArray(s._root[0]));
  test.ok(Array.isArray(s._root[1]));
  test.ok(!(0 in s._root[0]));
  test.equal(s._root[1][0], document.querySelector("#two b"));
  test.equal(s._root._parent, null);
  test.equal(s._root[0]._parent, document.querySelector("#one"));
  test.equal(s._root[1]._parent, document.querySelector("#two"));
  test.end();
});

tape("selection.select passes the selector function data and index", function(test) {
  var document = jsdom.jsdom("<parent id='one'><child><span><b>1</b></span></child></parent><parent id='two'><child><span><b>2</b></span></child></parent>"),
      results = [],
      s = d3.selectAll(document.querySelectorAll("parent")).datum(function(d, i) { return "parent-" + i; }).selectAll("child").datum(function(d, i, p, j) { return "child-" + i + "-" + j; }).select("span").select(function() { results.push({this: this, arguments: [].slice.call(arguments)}); });
  test.equal(document.querySelector("#one").__data__, "parent-0");
  test.equal(document.querySelector("#two").__data__, "parent-1");
  test.equal(results.length, 2);
  test.equal(results[0].this, document.querySelector("#one span"));
  test.equal(results[1].this, document.querySelector("#two span"));
  test.equal(results[0].arguments.length, 4);
  test.equal(results[0].arguments[0], "child-0-0");
  test.equal(results[0].arguments[1], 0);
  test.equal(results[0].arguments[2], "parent-0");
  test.equal(results[0].arguments[3], 0);
  test.equal(results[1].arguments[0], "child-0-1");
  test.equal(results[1].arguments[1], 0);
  test.equal(results[1].arguments[2], "parent-1");
  test.equal(results[1].arguments[3], 1);
  test.end();
});
