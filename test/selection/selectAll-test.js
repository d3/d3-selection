var tape = require("tape"),
    jsdom = require("jsdom"),
    d3 = require("../../");

tape("selection.selectAll can select elements (in the simplest case)", function(test) {
  var document = jsdom.jsdom("<h1>one</h1><h2>two</h2>"),
      h1 = document.querySelector("h1"),
      h2 = document.querySelector("h2"),
      s = d3.select(document.body).selectAll("h1,h2");
  test.ok(s instanceof d3.selection);
  test.ok(Array.isArray(s._));
  test.ok(s._[0] instanceof document.defaultView.NodeList);
  test.equal(s._.length, 1)
  test.equal(s._[0].length, 2);
  test.equal(s._[0][0], h1);
  test.equal(s._[0][1], h2);
  test.equal(s._[0]._parent, document.body);
  test.equal(s._enter, undefined);
  test.equal(s._exit, undefined);
  test.end();
});

tape("selection.selectAll can select elements (with multiple originating elements)", function(test) {
  var document = jsdom.jsdom("<table><tr id='tr-0'><td id='td-0-0'></td><td id='td-0-1'></td></tr><tr id='tr-1'><td id='td-1-0'></td><td id='td-1-1'></td></tr></table>"),
      tr0 = document.querySelector("#tr-0"),
      tr1 = document.querySelector("#tr-1"),
      s = d3.selectAll([tr0, tr1]).selectAll("td");
  test.ok(s instanceof d3.selection);
  test.ok(Array.isArray(s._));
  test.ok(s._[0] instanceof document.defaultView.NodeList);
  test.ok(s._[1] instanceof document.defaultView.NodeList);
  test.equal(s._.length, 2);
  test.equal(s._[0].length, 2);
  test.equal(s._[1].length, 2);
  test.equal(s._[0][0], document.querySelector("#td-0-0"));
  test.equal(s._[0][1], document.querySelector("#td-0-1"));
  test.equal(s._[1][0], document.querySelector("#td-1-0"));
  test.equal(s._[1][1], document.querySelector("#td-1-1"));
  test.equal(s._[0]._parent, tr0);
  test.equal(s._[1]._parent, tr1);
  test.equal(s._enter, undefined);
  test.equal(s._exit, undefined);
  test.end();
});

tape("selection.selectAll can select elements (with multiple originating elements)", function(test) {
  var document = jsdom.jsdom("<table><tr><td id='td-0-0'></td><td id='td-0-1'></td></tr></table>"),
      tr = document.querySelector("tr"),
      s = d3.selectAll([tr, null]).selectAll("td");
  test.ok(s instanceof d3.selection);
  test.ok(Array.isArray(s._));
  test.ok(s._[0] instanceof document.defaultView.NodeList);
  test.equal(s._.length, 1);
  test.equal(s._[0].length, 2);
  test.equal(s._[0][0], document.querySelector("#td-0-0"));
  test.equal(s._[0][1], document.querySelector("#td-0-1"));
  test.equal(s._[0]._parent, tr);
  test.equal(s._enter, undefined);
  test.equal(s._exit, undefined);
  test.end();
});

tape("selection.selectAll will not propagate data", function(test) {
  var document = jsdom.jsdom("<parent><child>hello</child></parent>"),
      parent = document.querySelector("parent"),
      child = document.querySelector("child");
  parent.__data__ = 42;
  d3.select(parent).selectAll("child");
  test.equal(child.__data__, undefined);
  test.end();
});

tape("selection.selectAll can select elements (when the originating selection is nested)", function(test) {
  var document = jsdom.jsdom("<parent id='one'><child><span>1</span></child></parent><parent id='two'><child><span>2</span></child></parent>"),
      s = d3.selectAll(document.querySelectorAll("parent")).selectAll("child").selectAll("span");
  test.ok(Array.isArray(s._));
  test.ok(s._[0] instanceof document.defaultView.NodeList);
  test.ok(s._[1] instanceof document.defaultView.NodeList);
  test.equal(s._.length, 2);
  test.equal(s._[0].length, 1);
  test.equal(s._[1].length, 1);
  test.equal(s._[0]._parent, document.querySelector("#one child"));
  test.equal(s._[1]._parent, document.querySelector("#two child"));
  test.equal(s._[0][0], document.querySelector("#one span"));
  test.equal(s._[1][0], document.querySelector("#two span"));
  test.end();
});

tape("selection.selectAll can select elements (when the originating selection contains null)", function(test) {
  var document = jsdom.jsdom("<parent id='one'></parent><parent id='two'><child><span>2</span></child></parent>"),
      s = d3.selectAll(document.querySelectorAll("parent")).select("child").selectAll("span");
  test.ok(Array.isArray(s._));
  test.ok(s._[0] instanceof document.defaultView.NodeList);
  test.equal(s._.length, 1);
  test.equal(s._[0].length, 1);
  test.equal(s._[0]._parent, document.querySelector("#two child"));
  test.equal(s._[0][0], document.querySelector("#two span"));
  test.end();
});

tape("selection.selectAll can select elements (when the originating selection is nested and contains null)", function(test) {
  var document = jsdom.jsdom("<parent id='one'><child></child></parent><parent id='two'><child><span><b>2</b></span></child></parent>"),
      s = d3.selectAll(document.querySelectorAll("parent")).selectAll("child").select("span").selectAll("b");
  test.ok(Array.isArray(s._));
  test.ok(s._[0] instanceof document.defaultView.NodeList);
  test.equal(s._.length, 1);
  test.equal(s._[0].length, 1);
  test.equal(s._[0][0], document.querySelector("#two b"));
  test.equal(s._[0]._parent, document.querySelector("#two span"));
  test.end();
});

tape("selection.selectAll passes the selector function data and index", function(test) {
  var document = jsdom.jsdom("<parent id='one'><child><span><b>1</b></span></child></parent><parent id='two'><child><span><b>2</b></span></child></parent>"),
      results = [],
      p = d3.selectAll(document.querySelectorAll("parent")).datum(function(d, i) { return "parent-" + i; }).selectAll("child").datum(function(d, i) { return "child-" + i; }).select("span"),
      s = p.selectAll(function() { results.push({this: this, arguments: [].slice.call(arguments)}); return []; });
  test.equal(document.querySelector("#one").__data__, "parent-0");
  test.equal(document.querySelector("#two").__data__, "parent-1");
  test.equal(results.length, 2);
  test.equal(results[0].this, document.querySelector("#one span"));
  test.equal(results[1].this, document.querySelector("#two span"));
  test.equal(results[0].arguments.length, 3);
  test.equal(results[0].arguments[0], "child-0");
  test.equal(results[0].arguments[1], 0);
  test.equal(results[0].arguments[2], p._[0]);
  test.equal(results[1].arguments[0], "child-0");
  test.equal(results[1].arguments[1], 0);
  test.equal(results[1].arguments[2], p._[1]);
  test.end();
});
