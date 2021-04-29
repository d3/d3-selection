import assert from "assert";
import * as d3 from "../../src/index.js";
import jsdom from "../jsdom.js";
it("selection.filter(…) returns a selection", () => {
  const document = jsdom("<h1>hello</h1>");
  assert(d3.select(document.body).filter("body") instanceof d3.selection);
});

it("selection.filter(string) retains the selected elements that matches the selector string", () => {
  const document = jsdom("<h1><span id='one'></span><span id='two'></span></h1><h1><span id='three'></span><span id='four'></span></h1>"),
      one = document.querySelector("#one"),
      three = document.querySelector("#three");
  assert.deepEqual(d3.select(document).selectAll("span").filter("#one,#three"), {_groups: [[one, three]], _parents: [document]});
});

it("selection.filter(function) retains elements for which the given function returns true", () => {
  const document = jsdom("<h1><span id='one'></span><span id='two'></span></h1><h1><span id='three'></span><span id='four'></span></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      three = document.querySelector("#three"),
      four = document.querySelector("#four");
  assert.deepEqual(d3.selectAll([one, two, three, four]).filter(function(d, i) { return i & 1; }), {_groups: [[two, four]], _parents: [null]});
});

it("selection.filter(function) passes the selector function data, index and group", () => {
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
      .filter(function(d, i, nodes) { results.push([this, d, i, nodes]); });

  assert.deepEqual(results, [
    [three, "child-0-0", 0, [three, four]],
    [four, "child-0-1", 1, [three, four]],
    [five, "child-1-0", 0, [five, ]]
  ]);
});

it("selection.filter(…) propagates parents from the originating selection", () => {
  const document = jsdom("<parent><child>1</child></parent><parent><child>2</child></parent>"),
      parents = d3.select(document).selectAll("parent"),
      parents2 = parents.filter(function() { return true; });
  assert.deepEqual(parents, {_groups: [document.querySelectorAll("parent")], _parents: [document]});
  assert.deepEqual(parents2, {_groups: [document.querySelectorAll("parent")], _parents: [document]});
  assert(parents._parents === parents2._parents); // Not copied!
});

it("selection.filter(…) can filter elements when the originating selection is nested", () => {
  const document = jsdom("<parent id='one'><child><span id='three'></span></child></parent><parent id='two'><child><span id='four'></span></child></parent>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      three = document.querySelector("#three"),
      four = document.querySelector("#four");
  assert.deepEqual(d3.selectAll([one, two]).selectAll("span").filter("*"), {_groups: [[three], [four]], _parents: [one, two]});
});

it("selection.filter(…) skips missing originating elements and does not retain the original indexes", () => {
  const document = jsdom("<h1>hello</h1>"),
      h1 = document.querySelector("h1");
  assert.deepEqual(d3.selectAll([, h1]).filter("*"), {_groups: [[h1]], _parents: [null]});
  assert.deepEqual(d3.selectAll([null, h1]).filter("*"), {_groups: [[h1]], _parents: [null]});
  assert.deepEqual(d3.selectAll([undefined, h1]).filter("*"), {_groups: [[h1]], _parents: [null]});
});

it("selection.filter(…) skips missing originating elements when the originating selection is nested", () => {
  const document = jsdom("<parent id='one'><child></child><child id='three'></child></parent><parent id='two'><child></child><child id='four'></child></parent>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      three = document.querySelector("#three"),
      four = document.querySelector("#four");
  assert.deepEqual(d3.selectAll([one, two]).selectAll("child").select(function(d, i) { return i & 1 ? this : null; }).filter("*"), {_groups: [[three], [four]], _parents: [one, two]});
});
