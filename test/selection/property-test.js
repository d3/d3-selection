import assert from "assert";
import * as d3 from "../../src/index.js";
import jsdom from "../jsdom.js";
it("selection.property(name) returns the property with the specified name on the first selected element", () => {
  const node = {foo: 42};
  assert.strictEqual(d3.select(node).property("foo"), 42);
  assert.strictEqual(d3.selectAll([null, node]).property("foo"), 42);
});

it("selection.property(name, value) sets property with the specified name on the selected elements", () => {
  const one = {},
      two = {},
      selection = d3.selectAll([one, two]);
  assert.strictEqual(selection.property("foo", "bar"), selection);
  assert.strictEqual(one.foo, "bar");
  assert.strictEqual(two.foo, "bar");
});

it("selection.property(name, null) removes the property with the specified name on the selected elements", () => {
  const one = {foo: "bar"},
      two = {foo: "bar"},
      selection = d3.selectAll([one, two]);
  assert.strictEqual(selection.property("foo", null), selection);
  assert.strictEqual("foo" in one, false);
  assert.strictEqual("foo" in two, false);
});

it("selection.property(name, function) sets the value of the property with the specified name on the selected elements", () => {
  const one = {foo: "bar"},
      two = {foo: "bar"},
      selection = d3.selectAll([one, two]);
  assert.strictEqual(selection.property("foo", function(d, i) { return i ? "baz" : null; }), selection);
  assert.strictEqual("foo" in one, false);
  assert.strictEqual(two.foo, "baz");
});

it("selection.property(name, function) passes the value function data, index and group", () => {
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
      .property("color", function(d, i, nodes) { results.push([this, d, i, nodes]); });

  assert.deepEqual(results, [
    [three, "child-0-0", 0, [three, four]],
    [four, "child-0-1", 1, [three, four]],
    [five, "child-1-0", 0, [five, ]]
  ]);
});
