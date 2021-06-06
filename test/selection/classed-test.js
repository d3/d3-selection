import assert from "assert";
import * as d3 from "../../src/index.js";
import jsdom from "../jsdom.js";
it("selection.classed(classes) returns true if and only if the first element has the specified classes", () => {
  const document = jsdom("<h1 class='c1 c2'>hello</h1><h1 class='c3'></h1>");
  assert.strictEqual(d3.select(document).select("h1").classed(""), true);
  assert.strictEqual(d3.select(document).select("h1").classed("c1"), true);
  assert.strictEqual(d3.select(document).select("h1").classed("c2"), true);
  assert.strictEqual(d3.select(document).select("h1").classed("c3"), false);
  assert.strictEqual(d3.select(document).select("h1").classed("c1 c2"), true);
  assert.strictEqual(d3.select(document).select("h1").classed("c2 c1"), true);
  assert.strictEqual(d3.select(document).select("h1").classed("c1 c3"), false);
  assert.strictEqual(d3.selectAll([null, document]).select("h1").classed("c1"), true);
  assert.strictEqual(d3.selectAll([null, document]).select("h1").classed("c2"), true);
  assert.strictEqual(d3.selectAll([null, document]).select("h1").classed("c3"), false);
});

it("selection.classed(classes) coerces the specified classes to a string", () => {
  const document = jsdom("<h1 class='c1 c2'>hello</h1><h1 class='c3'></h1>");
  assert.strictEqual(d3.select(document).select("h1").classed({toString: function() { return "c1 c2"; }}), true);
});

it("selection.classed(classes) gets the class attribute if classList is not supported", () => {
  const node = new Node("c1 c2");
  assert.strictEqual(d3.select(node).classed(""), true);
  assert.strictEqual(d3.select(node).classed("c1"), true);
  assert.strictEqual(d3.select(node).classed("c2"), true);
  assert.strictEqual(d3.select(node).classed("c3"), false);
  assert.strictEqual(d3.select(node).classed("c1 c2"), true);
  assert.strictEqual(d3.select(node).classed("c2 c1"), true);
  assert.strictEqual(d3.select(node).classed("c1 c3"), false);
});

it("selection.classed(classes, value) sets whether the selected elements have the specified classes", () => {
  const document = jsdom(""),
      selection = d3.select(document.body);
  assert.strictEqual(selection.classed("c1"), false);
  assert.strictEqual(selection.attr("class"), null);
  assert.strictEqual(selection.classed("c1", true), selection);
  assert.strictEqual(selection.classed("c1"), true);
  assert.strictEqual(selection.attr("class"), "c1");
  assert.strictEqual(selection.classed("c1 c2", true), selection);
  assert.strictEqual(selection.classed("c1"), true);
  assert.strictEqual(selection.classed("c2"), true);
  assert.strictEqual(selection.classed("c1 c2"), true);
  assert.strictEqual(selection.attr("class"), "c1 c2");
  assert.strictEqual(selection.classed("c1", false), selection);
  assert.strictEqual(selection.classed("c1"), false);
  assert.strictEqual(selection.classed("c2"), true);
  assert.strictEqual(selection.classed("c1 c2"), false);
  assert.strictEqual(selection.attr("class"), "c2");
  assert.strictEqual(selection.classed("c1 c2", false), selection);
  assert.strictEqual(selection.classed("c1"), false);
  assert.strictEqual(selection.classed("c2"), false);
  assert.strictEqual(selection.attr("class"), "");
});

it("selection.classed(classes, function) sets whether the selected elements have the specified classes", () => {
  const document = jsdom(""),
      selection = d3.select(document.body);
  assert.strictEqual(selection.classed("c1 c2", function() { return true; }), selection);
  assert.strictEqual(selection.attr("class"), "c1 c2");
  assert.strictEqual(selection.classed("c1 c2", function() { return false; }), selection);
  assert.strictEqual(selection.attr("class"), "");
});

it("selection.classed(classes, function) passes the value function data, index and group", () => {
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
      .classed("c1 c2", function(d, i, nodes) { results.push([this, d, i, nodes]); });

  assert.deepStrictEqual(results, [
    [three, "child-0-0", 0, [three, four]],
    [four, "child-0-1", 1, [three, four]],
    [five, "child-1-0", 0, [five, ]]
  ]);
});

it("selection.classed(classes, value) sets the class attribute if classList is not supported", () => {
  const node = new Node(null),
      selection = d3.select(node);
  assert.strictEqual(selection.classed("c1"), false);
  assert.strictEqual(selection.attr("class"), null);
  assert.strictEqual(selection.classed("c1", true), selection);
  assert.strictEqual(selection.classed("c1"), true);
  assert.strictEqual(selection.attr("class"), "c1");
  assert.strictEqual(selection.classed("c1 c2", true), selection);
  assert.strictEqual(selection.classed("c1"), true);
  assert.strictEqual(selection.classed("c2"), true);
  assert.strictEqual(selection.classed("c1 c2"), true);
  assert.strictEqual(selection.attr("class"), "c1 c2");
  assert.strictEqual(selection.classed("c1", false), selection);
  assert.strictEqual(selection.classed("c1"), false);
  assert.strictEqual(selection.classed("c2"), true);
  assert.strictEqual(selection.classed("c1 c2"), false);
  assert.strictEqual(selection.attr("class"), "c2");
  assert.strictEqual(selection.classed("c1 c2", false), selection);
  assert.strictEqual(selection.classed("c1"), false);
  assert.strictEqual(selection.classed("c2"), false);
  assert.strictEqual(selection.attr("class"), "");
});

it("selection.classed(classes, value) coerces the specified classes to a string", () => {
  const document = jsdom("<h1>hello</h1>"),
      selection = d3.select(document).select("h1");
  assert.strictEqual(selection.classed("c1 c2"), false);
  assert.strictEqual(selection.classed({toString: function() { return "c1 c2"; }}, true), selection);
  assert.strictEqual(selection.classed("c1 c2"), true);
});

function Node(classes) {
  this._classes = classes;
}

Node.prototype = {
  getAttribute: function(name) { return name === "class" ? this._classes : null; },
  setAttribute: function(name, value) { if (name === "class") this._classes = value; }
};
