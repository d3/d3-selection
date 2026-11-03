import assert from "node:assert";
import {select, selectAll} from "d3-selection";
import {assertSelection, enterNode} from "../asserts.js";
import {it} from "vitest";

it("selection.data(values) binds the specified values to the selected elements by index", () => {
  document.documentElement.innerHTML = "<div id='one'></div><div id='two'></div><div id='three'></div>";
  const one = document.body.querySelector("#one");
  const two = document.body.querySelector("#two");
  const three = document.body.querySelector("#three");
  const selection = select(document.body).selectAll("div").data(["foo", "bar", "baz"]);
  assert.strictEqual(one.__data__, "foo");
  assert.strictEqual(two.__data__, "bar");
  assert.strictEqual(three.__data__, "baz");
  assertSelection(selection, {
    groups: [[one, two, three]],
    parents: [document.body],
    enter: [[,,, ]],
    exit: [[,,, ]]
  });
});

it("selection.data(values) accepts an iterable", () => {
  document.documentElement.innerHTML = "<div id='one'></div><div id='two'></div><div id='three'></div>";
  const selection = select(document.body).selectAll("div").data(new Set(["foo", "bar", "baz"]));
  assert.deepStrictEqual(selection.data(), ["foo", "bar", "baz"]);
});

it("selection.data(null) is not allowed", () => {
  document.documentElement.innerHTML = "<div id='one'></div><div id='two'></div><div id='three'></div>";
  assert.throws(() => { select(document.body).selectAll("div").data(null); }, /null/);
});

it("selection.data() returns the bound data", () => {
  document.documentElement.innerHTML = "<div id='one'></div><div id='two'></div><div id='three'></div>";
  const selection = select(document.body).selectAll("div").data(["foo", "bar", "baz"]);
  assert.deepStrictEqual(selection.data(), ["foo", "bar", "baz"]);
});

it("selection.data(values) puts unbound data in the enter selection", () => {
  document.documentElement.innerHTML = "<div id='one'></div><div id='two'></div>";
  const one = document.body.querySelector("#one");
  const two = document.body.querySelector("#two");
  const selection = select(document.body).selectAll("div").data(["foo", "bar", "baz"]);
  assert.strictEqual(one.__data__, "foo");
  assert.strictEqual(two.__data__, "bar");
  assertSelection(selection, {
    groups: [[one, two,, ]],
    parents: [document.body],
    enter: [[,, enterNode(document.body, "baz")]],
    exit: [[,, ]]
  });
});

it("selection.data(values) puts unbound elements in the exit selection", () => {
  document.documentElement.innerHTML = "<div id='one'></div><div id='two'></div><div id='three'></div>";
  const one = document.body.querySelector("#one");
  const two = document.body.querySelector("#two");
  const three = document.body.querySelector("#three");
  const selection = select(document.body).selectAll("div").data(["foo", "bar"]);
  assert.strictEqual(one.__data__, "foo");
  assert.strictEqual(two.__data__, "bar");
  assertSelection(selection, {
    groups: [[one, two, ]],
    parents: [document.body],
    enter: [[,, ]],
    exit: [[,, three]]
  });
});

it("selection.data(values) binds the specified values to each group independently", () => {
  document.documentElement.innerHTML = "<div id='zero'><span id='one'></span><span id='two'></span></div><div id='three'><span id='four'></span><span id='five'></span></div>";
  const zero = document.body.querySelector("#zero");
  const one = document.body.querySelector("#one");
  const two = document.body.querySelector("#two");
  const three = document.body.querySelector("#three");
  const four = document.body.querySelector("#four");
  const five = document.body.querySelector("#five");
  const selection = select(document.body).selectAll("div").selectAll("span").data(["foo", "bar"]);
  assert.strictEqual(one.__data__, "foo");
  assert.strictEqual(two.__data__, "bar");
  assert.strictEqual(four.__data__, "foo");
  assert.strictEqual(five.__data__, "bar");
  assertSelection(selection, {
    groups: [[one, two], [four, five]],
    parents: [zero, three],
    enter: [[,, ], [,, ]],
    exit: [[,, ], [,, ]]
  });
});

it("selection.data(function) binds the specified return values to the selected elements by index", () => {
  document.documentElement.innerHTML = "<div id='one'></div><div id='two'></div><div id='three'></div>";
  const one = document.body.querySelector("#one");
  const two = document.body.querySelector("#two");
  const three = document.body.querySelector("#three");
  const selection = select(document.body).selectAll("div").data(function() { return ["foo", "bar", "baz"]; });
  assert.strictEqual(one.__data__, "foo");
  assert.strictEqual(two.__data__, "bar");
  assert.strictEqual(three.__data__, "baz");
  assertSelection(selection, {
    groups: [[one, two, three]],
    parents: [document.body],
    enter: [[,,, ]],
    exit: [[,,, ]]
  });
});

it("selection.data(function) passes the values function datum, index and parents", () => {
  document.documentElement.innerHTML = "<parent id='one'><child></child><child></child></parent><parent id='two'><child></child></parent>";
  const one = document.querySelector("#one");
  const two = document.querySelector("#two");
  const results = [];

  selectAll([one, two])
      .datum(function(d, i) { return "parent-" + i; })
    .selectAll("child")
      .data(function(d, i, nodes) { results.push([this, d, i, nodes]); return ["foo", "bar"]; });

  assert.deepStrictEqual(results, [
    [one, "parent-0", 0, [one, two]],
    [two, "parent-1", 1, [one, two]]
  ]);
});

it("selection.data(values, function) joins data to element using the computed keys", () => {
  document.documentElement.innerHTML = "<node id='one'></node><node id='two'></node><node id='three'></node>";
  const one = document.body.querySelector("#one");
  const two = document.body.querySelector("#two");
  const three = document.body.querySelector("#three");
  const selection = select(document.body).selectAll("node").data(["one", "four", "three"], function(d) { return d || this.id; });
  assertSelection(selection, {
    groups: [[one,, three]],
    parents: [document.body],
    enter: [[, enterNode(document.body, "four", "#three"),, ]],
    exit: [[, two,, ]]
  });
});

it("selection.data(values, function) puts elements with duplicate keys into update or exit", () => {
  document.documentElement.innerHTML = "<node id='one' name='foo'></node><node id='two' name='foo'></node><node id='three' name='bar'></node>";
  const one = document.body.querySelector("#one");
  const two = document.body.querySelector("#two");
  const three = document.body.querySelector("#three");
  const selection = select(document.body).selectAll("node").data(["foo"], function(d) { return d || this.getAttribute("name"); });
  assertSelection(selection, {
    groups: [[one]],
    parents: [document.body],
    enter: [[,]],
    exit: [[, two, three]]
  });
});

it("selection.data(values, function) puts elements with duplicate keys into exit", () => {
  document.documentElement.innerHTML = "<node id='one' name='foo'></node><node id='two' name='foo'></node><node id='three' name='bar'></node>";
  const one = document.body.querySelector("#one");
  const two = document.body.querySelector("#two");
  const three = document.body.querySelector("#three");
  const selection = select(document.body).selectAll("node").data(["bar"], function(d) { return d || this.getAttribute("name"); });
  assertSelection(selection, {
    groups: [[three]],
    parents: [document.body],
    enter: [[,]],
    exit: [[one, two,, ]]
  });
});

it("selection.data(values, function) puts data with duplicate keys into update and enter", () => {
  document.documentElement.innerHTML = "<node id='one'></node><node id='two'></node><node id='three'></node>";
  const one = document.body.querySelector("#one");
  const two = document.body.querySelector("#two");
  const three = document.body.querySelector("#three");
  const selection = select(document.body).selectAll("node").data(["one", "one", "two"], function(d) { return d || this.id; });
  assertSelection(selection, {
    groups: [[one,, two]],
    parents: [document.body],
    enter: [[, enterNode(document.body, "one", two),, ]],
    exit: [[,, three]]
  });
});

it("selection.data(values, function) puts data with duplicate keys into enter", () => {
  document.documentElement.innerHTML = "<node id='one'></node><node id='two'></node><node id='three'></node>";
  const one = document.body.querySelector("#one");
  const two = document.body.querySelector("#two");
  const three = document.body.querySelector("#three");
  const selection = select(document.body).selectAll("node").data(["foo", "foo", "two"], function(d) { return d || this.id; });
  assertSelection(selection, {
    groups: [[,, two]],
    parents: [document.body],
    enter: [[enterNode(document.body, "foo", two), enterNode(document.body, "foo", two),, ]],
    exit: [[one,, three]]
  });
});

it("selection.data(values, function) passes the key function datum, index and nodes or data", () => {
  document.documentElement.innerHTML = "<node id='one'></node><node id='two'></node>";
  const one = document.body.querySelector("#one");
  const two = document.body.querySelector("#two");
  const results = [];

  select(one)
      .datum("foo");

  select(document.body).selectAll("node")
      .data(["foo", "bar"], function(d, i, nodes) { results.push([this, d, i, [...nodes]]); return d || this.id; });

  assert.deepStrictEqual(results, [
    [one, "foo", 0, [one, two]],
    [two, undefined, 1, [one, two]],
    [document.body, "foo", 0, ["foo", "bar"]],
    [document.body, "bar", 1, ["foo", "bar"]]
  ]);
});

it("selection.data(values, function) applies the order of the data", () => {
  document.documentElement.innerHTML = "<div id='one'></div><div id='two'></div><div id='three'></div>";
  const one = document.body.querySelector("#one");
  const two = document.body.querySelector("#two");
  const three = document.body.querySelector("#three");
  const selection = select(document.body).selectAll("div").data(["four", "three", "one", "five", "two"], function(d) { return d || this.id; });
  assertSelection(selection, {
    groups: [[, three, one,, two]],
    parents: [document.body],
    enter: [[enterNode(document.body, "four", three),,, enterNode(document.body, "five", two),, ]],
    exit: [[,,,]]
  });
});

it("selection.data(values) returns a new selection, and does not modify the original selection", () => {
  document.documentElement.innerHTML = "<h1 id='one'></h1><h1 id='two'></h1>";
  const root = document.documentElement;
  const one = document.querySelector("#one");
  const two = document.querySelector("#two");
  const selection0 = select(root).selectAll("h1");
  const selection1 = selection0.data([1, 2, 3]);
  const selection2 = selection1.data([1]);
  assertSelection(selection0, {
    groups: [[one, two]],
    parents: [root]
  });
  assertSelection(selection1, {
    groups: [[one, two,, ]],
    parents: [root],
    enter: [[,, enterNode(root, 3), ]],
    exit: [[,, ]]
  });
  assertSelection(selection2, {
    groups: [[one]],
    parents: [root],
    enter: [[, ]],
    exit: [[, two,, ]]
  });
});

it("selection.data(values, key) does not modify the groups array in-place", () => {
  document.documentElement.innerHTML = "<h1 id='one'></h1><h1 id='two'></h1>";
  const root = document.documentElement;
  const one = document.querySelector("#one");
  const two = document.querySelector("#two");
  const key = function(d, i) { return i; };
  const selection0 = select(root).selectAll("h1");
  const selection1 = selection0.data([1, 2, 3], key);
  const selection2 = selection1.data([1], key);
  assertSelection(selection0, {
    groups: [[one, two]],
    parents: [root]
  });
  assertSelection(selection1, {
    groups: [[one, two,, ]],
    parents: [root],
    enter: [[,, enterNode(root, 3), ]],
    exit: [[,, ]]
  });
  assertSelection(selection2, {
    groups: [[one]],
    parents: [root],
    enter: [[, ]],
    exit: [[, two,, ]]
  });
});
