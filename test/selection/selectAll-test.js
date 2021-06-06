import assert from "assert";
import * as d3 from "../../src/index.js";
import it from "../jsdom.js";
it("selection.selectAll(…) returns a selection", () => {
  const document = jsdom("<h1>hello</h1>");
  assert(d3.select(document).selectAll("h1") instanceof d3.selection);
});

it("selection.selectAll(string) selects all descendants that match the selector string for each selected element", () => {
  const document = jsdom("<h1 id='one'><span></span><span></span></h1><h1 id='two'><span></span><span></span></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two");
  assert.deepStrictEqual(d3.selectAll([one, two]).selectAll("span"), {_groups: [one.querySelectorAll("span"), two.querySelectorAll("span")], _parents: [one, two]});
});

it("selection.selectAll(function) selects the return values of the given function for each selected element", () => {
  const document = jsdom("<span id='one'></span>"),
      one = document.querySelector("#one");
  assert.deepStrictEqual(d3.select(document).selectAll(function() { return [one]; }), {_groups: [[one]], _parents: [document]});
});

it("selection.selectAll(function) passes the selector function data, index and group", () => {
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
    .selectAll(function(d, i, nodes) { results.push([this, d, i, nodes]); });

  assert.deepStrictEqual(results, [
    [three, "child-0-0", 0, [three, four]],
    [four, "child-0-1", 1, [three, four]],
    [five, "child-1-0", 0, [five, ]]
  ]);
});

it("selection.selectAll(…) will not propagate data", () => {
  const document = jsdom("<parent><child>hello</child></parent>"),
      parent = document.querySelector("parent"),
      child = document.querySelector("child");
  parent.__data__ = 42;
  d3.select(parent).selectAll("child");
  assert(!("__data__" in child));
});

it("selection.selectAll(…) groups selected elements by their parent in the originating selection", () => {
  const document = jsdom("<parent id='one'><child id='three'></child></parent><parent id='two'><child id='four'></child></parent>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      three = document.querySelector("#three"),
      four = document.querySelector("#four");
  assert.deepStrictEqual(d3.select(document).selectAll("parent").selectAll("child"), {_groups: [[three], [four]], _parents: [one, two]});
  assert.deepStrictEqual(d3.select(document).selectAll("child"), {_groups: [[three, four]], _parents: [document]});
});

it("selection.selectAll(…) can select elements when the originating selection is nested", () => {
  const document = jsdom("<parent id='one'><child id='three'><span id='five'></span></child></parent><parent id='two'><child id='four'><span id='six'></span></child></parent>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      three = document.querySelector("#three"),
      four = document.querySelector("#four"),
      five = document.querySelector("#five"),
      six = document.querySelector("#six");
  assert.deepStrictEqual(d3.selectAll([one, two]).selectAll("child").selectAll("span"), {_groups: [[five], [six]], _parents: [three, four]});
});

it("selection.selectAll(…) skips missing originating elements", () => {
  const document = jsdom("<h1><span>hello</span></h1>"),
      h1 = document.querySelector("h1"),
      span = document.querySelector("span");
  assert.deepStrictEqual(d3.selectAll([, h1]).selectAll("span"), {_groups: [[span]], _parents: [h1]});
  assert.deepStrictEqual(d3.selectAll([null, h1]).selectAll("span"), {_groups: [[span]], _parents: [h1]});
  assert.deepStrictEqual(d3.selectAll([undefined, h1]).selectAll("span"), {_groups: [[span]], _parents: [h1]});
});

it("selection.selectAll(…) skips missing originating elements when the originating selection is nested", () => {
  const document = jsdom("<parent id='one'><child></child><child id='three'><span id='five'></span></child></parent><parent id='two'><child></child><child id='four'><span id='six'></span></child></parent>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      three = document.querySelector("#three"),
      four = document.querySelector("#four"),
      five = document.querySelector("#five"),
      six = document.querySelector("#six");
  assert.deepStrictEqual(d3.selectAll([one, two]).selectAll("child").select(function(d, i) { return i & 1 ? this : null; }).selectAll("span"), {_groups: [[five], [six]], _parents: [three, four]});
});
