var tape = require("tape"),
    jsdom = require("jsdom"),
    d3 = require("../../");

tape("selection.select(…) returns a selection", function(test) {
  var document = jsdom.jsdom("<h1>hello</h1>");
  test.ok(d3.select(document.body).select("h1") instanceof d3.selection);
  test.end();
});

tape("selection.select(string) selects the first descendant that matches the selector string for each selected element", function(test) {
  var document = jsdom.jsdom("<h1><span id='one'></span><span id='two'></span></h1><h1><span id='three'></span><span id='four'></span></h1>"),
      one = document.querySelector("#one"),
      three = document.querySelector("#three");
  test.deepEqual(d3.select(document.body).selectAll("h1").select("span"), {_nodes: [[one, three]], _parents: [document.body]});
  test.end();
});

tape("selection.select(function) selects the return value of the given function for each selected element", function(test) {
  var document = jsdom.jsdom("<span id='one'></span>"),
      one = document.querySelector("#one");
  test.deepEqual(d3.select(document.body).select(function() { return one; }), {_nodes: [[one]], _parents: [null]});
  test.end();
});

tape("selection.select(function) passes the selector function data, index and group", function(test) {
  var document = jsdom.jsdom("<parent id='one'><child id='three'></child><child id='four'></child></parent><parent id='two'><child id='five'></child></parent>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      three = document.querySelector("#three"),
      four = document.querySelector("#four"),
      five = document.querySelector("#five"),
      results = [];

  d3.selectAll([one, two])
      .datum(function(d, i) { return "parent-" + i; })
    .selectAll("child")
      .data(function(d, i) { return [0, 1].map(function(j) { return "child-" + i + "-" + j; }); })
      .select(function(d, i, nodes) { results.push([d, i, nodes]); });

  test.deepEqual(results, [
    ["child-0-0", 0, [three, four]],
    ["child-0-1", 1, [three, four]],
    ["child-1-0", 0, [five, ]]
  ]);
  test.end();
});

tape("selection.select(…) propagates data if defined on the originating element", function(test) {
  var document = jsdom.jsdom("<parent><child>hello</child></parent>"),
      parent = document.querySelector("parent"),
      child = document.querySelector("child");
  parent.__data__ = 0; // still counts as data even though falsey
  child.__data__ = 42;
  d3.select(parent).select("child");
  test.equal(child.__data__, 0);
  test.end();
});

tape("selection.select(…) will not propagate data if not defined on the originating element", function(test) {
  var document = jsdom.jsdom("<parent><child>hello</child></parent>"),
      parent = document.querySelector("parent"),
      child = document.querySelector("child");
  child.__data__ = 42;
  d3.select(parent).select("child");
  test.equal(child.__data__, 42);
  test.end();
});

tape("selection.select(…) propagates parents from the originating selection", function(test) {
  var document = jsdom.jsdom("<parent><child>1</child></parent><parent><child>2</child></parent>"),
      body = document.body,
      parents = d3.select(body).selectAll("parent"),
      childs = parents.select("child");
  test.deepEqual(parents, {_nodes: [document.querySelectorAll("parent")], _parents: [body]});
  test.deepEqual(childs, {_nodes: [document.querySelectorAll("child")], _parents: [body]});
  test.ok(parents._parents === childs._parents); // Not copied!
  test.end();
});

tape("selection.select(…) can select elements when the originating selection is nested", function(test) {
  var document = jsdom.jsdom("<parent id='one'><child><span id='three'></span></child></parent><parent id='two'><child><span id='four'></span></child></parent>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      three = document.querySelector("#three"),
      four = document.querySelector("#four");
  test.deepEqual(d3.selectAll([one, two]).selectAll("child").select("span"), {_nodes: [[three], [four]], _parents: [one, two]});
  test.end();
});

tape("selection.select(…) skips missing originating elements", function(test) {
  var document = jsdom.jsdom("<h1><span>hello</span></h1>"),
      h1 = document.querySelector("h1"),
      span = document.querySelector("span");
  test.deepEqual(d3.selectAll([, h1]).select("span"), {_nodes: [[, span]], _parents: [null]});
  test.deepEqual(d3.selectAll([null, h1]).select("span"), {_nodes: [[, span]], _parents: [null]});
  test.deepEqual(d3.selectAll([undefined, h1]).select("span"), {_nodes: [[, span]], _parents: [null]});
  test.end();
});

tape("selection.select(…) skips missing originating elements when the originating selection is nested", function(test) {
  var document = jsdom.jsdom("<parent id='one'><child></child><child><span id='three'></span></child></parent><parent id='two'><child></child><child><span id='four'></span></child></parent>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      three = document.querySelector("#three"),
      four = document.querySelector("#four");
  test.deepEqual(d3.selectAll([one, two]).selectAll("child").select(function(d, i) { return i & 1 ? this : null; }).select("span"), {_nodes: [[, three], [, four]], _parents: [one, two]});
  test.end();
});
