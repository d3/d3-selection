import assert from "assert";
import * as d3 from "../../src/index.js";
import jsdom from "../jsdom.js";
it("selection.datum() returns the datum on the first selected element", () => {
  const node = {__data__: "hello"};
  assert.strictEqual(d3.select(node).datum(), "hello");
  assert.strictEqual(d3.selectAll([null, node]).datum(), "hello");
});

it("selection.datum(value) sets datum on the selected elements", () => {
  const one = {__data__: ""},
      two = {__data__: ""},
      selection = d3.selectAll([one, two]);
  assert.strictEqual(selection.datum("bar"), selection);
  assert.strictEqual(one.__data__, "bar");
  assert.strictEqual(two.__data__, "bar");
});

it("selection.datum(null) clears the datum on the selected elements", () => {
  const one = {__data__: "bar"},
      two = {__data__: "bar"},
      selection = d3.selectAll([one, two]);
  assert.strictEqual(selection.datum(null), selection);
  assert.strictEqual("__data__" in one, false);
  assert.strictEqual("__data__" in two, false);
});

it("selection.datum(function) sets the value of the datum on the selected elements", () => {
  const one = {__data__: "bar"},
      two = {__data__: "bar"},
      selection = d3.selectAll([one, two]);
  assert.strictEqual(selection.datum(function(d, i) { return i ? "baz" : null; }), selection);
  assert.strictEqual("__data__" in one, false);
  assert.strictEqual(two.__data__, "baz");
});

it("selection.datum(function) passes the value function data, index and group", () => {
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
      .datum(function(d, i, nodes) { results.push([this, d, i, nodes]); });

  assert.deepStrictEqual(results, [
    [three, "child-0-0", 0, [three, four]],
    [four, "child-0-1", 1, [three, four]],
    [five, "child-1-0", 0, [five, ]]
  ]);
});
