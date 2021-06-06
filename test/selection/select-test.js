import assert from "assert";
import * as d3 from "../../src/index.js";
import jsdom from "../jsdom.js";
it("selection.select(…) returns a selection", () => {
  const document = jsdom("<h1>hello</h1>");
  assert(d3.select(document).select("h1") instanceof d3.selection);
});

it("selection.select(string) selects the first descendant that matches the selector string for each selected element", () => {
  const document = jsdom("<h1><span id='one'></span><span id='two'></span></h1><h1><span id='three'></span><span id='four'></span></h1>"),
      one = document.querySelector("#one"),
      three = document.querySelector("#three");
  assert.deepStrictEqual(d3.select(document).selectAll("h1").select("span"), {_groups: [[one, three]], _parents: [document]});
});

it("selection.select(function) selects the return value of the given function for each selected element", () => {
  const document = jsdom("<span id='one'></span>"),
      one = document.querySelector("#one");
  assert.deepStrictEqual(d3.select(document).select(function() { return one; }), {_groups: [[one]], _parents: [null]});
});

it("selection.select(function) passes the selector function data, index and group", () => {
  const document = jsdom("<parent id='one'><child id='three'></child><child id='four'></child></parent><parent id='two'><child id='five'></child></parent>"),
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
      .select(function(d, i, nodes) { results.push([this, d, i, nodes]); });

  assert.deepStrictEqual(results, [
    [three, "child-0-0", 0, [three, four]],
    [four, "child-0-1", 1, [three, four]],
    [five, "child-1-0", 0, [five, ]]
  ]);
});

it("selection.select(…) propagates data if defined on the originating element", () => {
  const document = jsdom("<parent><child>hello</child></parent>"),
      parent = document.querySelector("parent"),
      child = document.querySelector("child");
  parent.__data__ = 0; // still counts as data even though falsey
  child.__data__ = 42;
  d3.select(parent).select("child");
  assert.strictEqual(child.__data__, 0);
});

it("selection.select(…) will not propagate data if not defined on the originating element", () => {
  const document = jsdom("<parent><child>hello</child></parent>"),
      parent = document.querySelector("parent"),
      child = document.querySelector("child");
  child.__data__ = 42;
  d3.select(parent).select("child");
  assert.strictEqual(child.__data__, 42);
});

it("selection.select(…) propagates parents from the originating selection", () => {
  const document = jsdom("<parent><child>1</child></parent><parent><child>2</child></parent>"),
      parents = d3.select(document).selectAll("parent"),
      childs = parents.select("child");
  assert.deepStrictEqual(parents, {_groups: [document.querySelectorAll("parent")], _parents: [document]});
  assert.deepStrictEqual(childs, {_groups: [document.querySelectorAll("child")], _parents: [document]});
  assert(parents._parents === childs._parents); // Not copied!
});

it("selection.select(…) can select elements when the originating selection is nested", () => {
  const document = jsdom("<parent id='one'><child><span id='three'></span></child></parent><parent id='two'><child><span id='four'></span></child></parent>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      three = document.querySelector("#three"),
      four = document.querySelector("#four");
  assert.deepStrictEqual(d3.selectAll([one, two]).selectAll("child").select("span"), {_groups: [[three], [four]], _parents: [one, two]});
});

it("selection.select(…) skips missing originating elements", () => {
  const document = jsdom("<h1><span>hello</span></h1>"),
      h1 = document.querySelector("h1"),
      span = document.querySelector("span");
  assert.deepStrictEqual(d3.selectAll([, h1]).select("span"), {_groups: [[, span]], _parents: [null]});
  assert.deepStrictEqual(d3.selectAll([null, h1]).select("span"), {_groups: [[, span]], _parents: [null]});
  assert.deepStrictEqual(d3.selectAll([undefined, h1]).select("span"), {_groups: [[, span]], _parents: [null]});
});

it("selection.select(…) skips missing originating elements when the originating selection is nested", () => {
  const document = jsdom("<parent id='one'><child></child><child><span id='three'></span></child></parent><parent id='two'><child></child><child><span id='four'></span></child></parent>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      three = document.querySelector("#three"),
      four = document.querySelector("#four");
  assert.deepStrictEqual(d3.selectAll([one, two]).selectAll("child").select(function(d, i) { return i & 1 ? this : null; }).select("span"), {_groups: [[, three], [, four]], _parents: [one, two]});
});

it("selection.selection() returns itself", () => {
  const document = jsdom("<h1>hello</h1>");
  const sel = d3.select(document).select("h1");
  assert(sel === sel.selection());
  assert(sel === sel.selection().selection());
});
