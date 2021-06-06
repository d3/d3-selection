import assert from "assert";
import * as d3 from "../../src/index.js";
import jsdom from "../jsdom.js";
it("selection.append(…) returns a selection", () => {
  const document = jsdom();
  assert(d3.select(document.body).append("h1") instanceof d3.selection);
});

it("selection.append(name) appends a new element of the specified name as the last child of each selected element", () => {
  const document = jsdom("<div id='one'><span class='before'></span></div><div id='two'><span class='before'></span></div>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      selection = d3.selectAll([one, two]).append("span"),
      three = one.querySelector("span:last-child"),
      four = two.querySelector("span:last-child");
  assert.deepStrictEqual(selection, {_groups: [[three, four]], _parents: [null]});
});

it("selection.append(name) observes the specified namespace, if any", () => {
  const document = jsdom("<div id='one'></div><div id='two'></div>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      selection = d3.selectAll([one, two]).append("svg:g"),
      three = one.querySelector("g"),
      four = two.querySelector("g");
  assert.strictEqual(three.namespaceURI, "http://www.w3.org/2000/svg");
  assert.strictEqual(four.namespaceURI, "http://www.w3.org/2000/svg");
  assert.deepStrictEqual(selection, {_groups: [[three, four]], _parents: [null]});
});

it("selection.append(name) uses createElement, not createElementNS, if the implied namespace is the same as the document", () => {
  const pass = 0,
      document = jsdom("<div id='one'></div><div id='two'></div>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      createElement = document.createElement;

  document.createElement = function() {
    ++pass;
    return createElement.apply(this, arguments);
  };

  const selection = d3.selectAll([one, two]).append("P"),
      three = one.querySelector("p"),
      four = two.querySelector("p");
  assert.strictEqual(pass, 2);
  assert.deepStrictEqual(selection, {_groups: [[three, four]], _parents: [null]});
});

it("selection.append(name) observes the implicit namespace, if any", () => {
  const document = jsdom("<div id='one'></div><div id='two'></div>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      selection = d3.selectAll([one, two]).append("svg"),
      three = one.querySelector("svg"),
      four = two.querySelector("svg");
  assert.strictEqual(three.namespaceURI, "http://www.w3.org/2000/svg");
  assert.strictEqual(four.namespaceURI, "http://www.w3.org/2000/svg");
  assert.deepStrictEqual(selection, {_groups: [[three, four]], _parents: [null]});
});

it("selection.append(name) observes the inherited namespace, if any", () => {
  const document = jsdom("<div id='one'></div><div id='two'></div>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      selection = d3.selectAll([one, two]).append("svg").append("g"),
      three = one.querySelector("g"),
      four = two.querySelector("g");
  assert.strictEqual(three.namespaceURI, "http://www.w3.org/2000/svg");
  assert.strictEqual(four.namespaceURI, "http://www.w3.org/2000/svg");
  assert.deepStrictEqual(selection, {_groups: [[three, four]], _parents: [null]});
});

it("selection.append(name) observes a custom namespace, if any", () => {
  try {
    d3.namespaces.d3js = "https://d3js.org/2016/namespace";
    const document = jsdom("<div id='one'></div><div id='two'></div>"),
        one = document.querySelector("#one"),
        two = document.querySelector("#two"),
        selection = d3.selectAll([one, two]).append("d3js"),
        three = one.querySelector("d3js"),
        four = two.querySelector("d3js");
    assert.strictEqual(three.namespaceURI, "https://d3js.org/2016/namespace");
    assert.strictEqual(four.namespaceURI, "https://d3js.org/2016/namespace");
    assert.deepStrictEqual(selection, {_groups: [[three, four]], _parents: [null]});
} finally {
    delete d3.namespaces.d3js;
  }
});

it("selection.append(function) appends the returned element as the last child of each selected element", () => {
  const document = jsdom("<div id='one'><span class='before'></span></div><div id='two'><span class='before'></span></div>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      selection = d3.selectAll([one, two]).append(function() { return document.createElement("SPAN"); }),
      three = one.querySelector("span:last-child"),
      four = two.querySelector("span:last-child");
  assert.deepStrictEqual(selection, {_groups: [[three, four]], _parents: [null]});
});

it("selection.append(function) passes the creator function data, index and group", () => {
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
      .append(function(d, i, nodes) { results.push([this, d, i, nodes]); return document.createElement("SPAN"); });

  assert.deepStrictEqual(results, [
    [three, "child-0-0", 0, [three, four]],
    [four, "child-0-1", 1, [three, four]],
    [five, "child-1-0", 0, [five, ]]
  ]);
});

it("selection.append(…) propagates data if defined on the originating element", () => {
  const document = jsdom("<parent><child>hello</child></parent>"),
      parent = document.querySelector("parent");
  parent.__data__ = 0; // still counts as data even though falsey
  assert.strictEqual(d3.select(parent).append("child").datum(), 0);
});

it("selection.append(…) will not propagate data if not defined on the originating element", () => {
  const document = jsdom("<parent><child>hello</child></parent>"),
      parent = document.querySelector("parent"),
      child = document.querySelector("child");
  child.__data__ = 42;
  d3.select(parent).append(function() { return child; });
  assert.strictEqual(child.__data__, 42);
});

it("selection.append(…) propagates parents from the originating selection", () => {
  const document = jsdom("<parent></parent><parent></parent>"),
      parents = d3.select(document).selectAll("parent"),
      childs = parents.append("child");
  assert.deepStrictEqual(parents, {_groups: [document.querySelectorAll("parent")], _parents: [document]});
  assert.deepStrictEqual(childs, {_groups: [document.querySelectorAll("child")], _parents: [document]});
  assert(parents._parents === childs._parents); // Not copied!
});

it("selection.append(…) can select elements when the originating selection is nested", () => {
  const document = jsdom("<parent id='one'><child></child></parent><parent id='two'><child></child></parent>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      selection = d3.selectAll([one, two]).selectAll("child").append("span"),
      three = one.querySelector("span"),
      four = two.querySelector("span");
  assert.deepStrictEqual(selection, {_groups: [[three], [four]], _parents: [one, two]});
});

it("selection.append(…) skips missing originating elements", () => {
  const document = jsdom("<h1></h1>"),
      h1 = document.querySelector("h1"),
      selection = d3.selectAll([, h1]).append("span"),
      span = h1.querySelector("span");
  assert.deepStrictEqual(selection, {_groups: [[, span]], _parents: [null]});
});
