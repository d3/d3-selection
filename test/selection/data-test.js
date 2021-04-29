import assert from "assert";
import * as d3 from "../../src/index.js";
import jsdom from "../jsdom.js";
it("selection.data(values) binds the specified values to the selected elements by index", () => {
  const body = jsdom("<div id='one'></div><div id='two'></div><div id='three'></div>").body,
      one = body.querySelector("#one"),
      two = body.querySelector("#two"),
      three = body.querySelector("#three"),
      selection = d3.select(body).selectAll("div").data(["foo", "bar", "baz"]);
  assert.strictEqual(one.__data__, "foo");
  assert.strictEqual(two.__data__, "bar");
  assert.strictEqual(three.__data__, "baz");
  assert.deepEqual(selection, {
    _groups: [[one, two, three]],
    _parents: [body],
    _enter: [[,, ]],
    _exit: [[,, ]]
  });
});

it("selection.data(values) accepts an iterable", () => {
  const body = jsdom("<div id='one'></div><div id='two'></div><div id='three'></div>").body,
      selection = d3.select(body).selectAll("div").data(new Set(["foo", "bar", "baz"]));
  assert.deepEqual(selection.data(), ["foo", "bar", "baz"]);
});

it("selection.data(null) is not allowed", () => {
  const body = jsdom("<div id='one'></div><div id='two'></div><div id='three'></div>").body;
  try { d3.select(body).selectAll("div").data(null); assert.fail(); } catch (ignore) {}
});

it("selection.data() returns the bound data", () => {
  const body = jsdom("<div id='one'></div><div id='two'></div><div id='three'></div>").body,
      selection = d3.select(body).selectAll("div").data(["foo", "bar", "baz"]);
  assert.deepEqual(selection.data(), ["foo", "bar", "baz"]);
});

it("selection.data(values) puts unbound data in the enter selection", () => {
  const body = jsdom("<div id='one'></div><div id='two'></div>").body,
      one = body.querySelector("#one"),
      two = body.querySelector("#two"),
      selection = d3.select(body).selectAll("div").data(["foo", "bar", "baz"]);
  assert.strictEqual(one.__data__, "foo");
  assert.strictEqual(two.__data__, "bar");
  assert.deepEqual(selection, {
    _groups: [[one, two, ]],
    _parents: [body],
    _enter: [[,, {
      __data__: "baz",
      _next: null,
      _parent: body,
      namespaceURI: "http://www.w3.org/1999/xhtml",
      ownerDocument: body.ownerDocument
    }]],
    _exit: [[,, ]]
  });
});

it("selection.data(values) puts unbound elements in the exit selection", () => {
  const body = jsdom("<div id='one'></div><div id='two'></div><div id='three'></div>").body,
      one = body.querySelector("#one"),
      two = body.querySelector("#two"),
      three = body.querySelector("#three"),
      selection = d3.select(body).selectAll("div").data(["foo", "bar"]);
  assert.strictEqual(one.__data__, "foo");
  assert.strictEqual(two.__data__, "bar");
  assert.deepEqual(selection, {
    _groups: [[one, two, ]],
    _parents: [body],
    _enter: [[,,, ]],
    _exit: [[,, three]]
  });
});

it("selection.data(values) binds the specified values to each group independently", () => {
  const body = jsdom("<div id='zero'><span id='one'></span><span id='two'></span></div><div id='three'><span id='four'></span><span id='five'></span></div>").body,
      zero = body.querySelector("#zero"),
      one = body.querySelector("#one"),
      two = body.querySelector("#two"),
      three = body.querySelector("#three"),
      four = body.querySelector("#four"),
      five = body.querySelector("#five"),
      selection = d3.select(body).selectAll("div").selectAll("span").data(["foo", "bar"]);
  assert.strictEqual(one.__data__, "foo");
  assert.strictEqual(two.__data__, "bar");
  assert.strictEqual(four.__data__, "foo");
  assert.strictEqual(five.__data__, "bar");
  assert.deepEqual(selection, {
    _groups: [[one, two], [four, five]],
    _parents: [zero, three],
    _enter: [[, ], [, ]],
    _exit: [[, ], [, ]]
  });
});

it("selection.data(function) binds the specified return values to the selected elements by index", () => {
  const body = jsdom("<div id='one'></div><div id='two'></div><div id='three'></div>").body,
      one = body.querySelector("#one"),
      two = body.querySelector("#two"),
      three = body.querySelector("#three"),
      selection = d3.select(body).selectAll("div").data(function() { return ["foo", "bar", "baz"]; });
  assert.strictEqual(one.__data__, "foo");
  assert.strictEqual(two.__data__, "bar");
  assert.strictEqual(three.__data__, "baz");
  assert.deepEqual(selection, {
    _groups: [[one, two, three]],
    _parents: [body],
    _enter: [[,, ]],
    _exit: [[,, ]]
  });
});

it("selection.data(function) passes the values function datum, index and parents", () => {
  const document = jsdom("<parent id='one'><child></child><child></child></parent><parent id='two'><child></child></parent>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      results = [];

  d3.selectAll([one, two])
      .datum(function(d, i) { return "parent-" + i; })
    .selectAll("child")
      .data(function(d, i, nodes) { results.push([this, d, i, nodes]); return ["foo", "bar"]; });

  assert.deepEqual(results, [
    [one, "parent-0", 0, [one, two]],
    [two, "parent-1", 1, [one, two]]
  ]);
});

it("selection.data(values, function) joins data to element using the computed keys", () => {
  const body = jsdom("<node id='one'></node><node id='two'></node><node id='three'></node>").body,
      one = body.querySelector("#one"),
      two = body.querySelector("#two"),
      three = body.querySelector("#three"),
      selection = d3.select(body).selectAll("node").data(["one", "four", "three"], function(d) { return d || this.id; });
  assert.deepEqual(selection, {
    _groups: [[one,, three]],
    _parents: [body],
    _enter: [[, {
      __data__: "four",
      _next: three,
      _parent: body,
      namespaceURI: "http://www.w3.org/1999/xhtml",
      ownerDocument: body.ownerDocument
    }, ]],
    _exit: [[, two, ]]
  });
});

it("selection.data(values, function) puts elements with duplicate keys into update or exit", () => {
  const body = jsdom("<node id='one' name='foo'></node><node id='two' name='foo'></node><node id='three' name='bar'></node>").body,
      one = body.querySelector("#one"),
      two = body.querySelector("#two"),
      three = body.querySelector("#three"),
      selection = d3.select(body).selectAll("node").data(["foo"], function(d) { return d || this.getAttribute("name"); });
  assert.deepEqual(selection, {
    _groups: [[one]],
    _parents: [body],
    _enter: [[,]],
    _exit: [[, two, three]]
  });
});

it("selection.data(values, function) puts elements with duplicate keys into exit", () => {
  const body = jsdom("<node id='one' name='foo'></node><node id='two' name='foo'></node><node id='three' name='bar'></node>").body,
      one = body.querySelector("#one"),
      two = body.querySelector("#two"),
      three = body.querySelector("#three"),
      selection = d3.select(body).selectAll("node").data(["bar"], function(d) { return d || this.getAttribute("name"); });
  assert.deepEqual(selection, {
    _groups: [[three]],
    _parents: [body],
    _enter: [[,]],
    _exit: [[one, two,]]
  });
});

it("selection.data(values, function) puts data with duplicate keys into update and enter", () => {
  const body = jsdom("<node id='one'></node><node id='two'></node><node id='three'></node>").body,
      one = body.querySelector("#one"),
      two = body.querySelector("#two"),
      three = body.querySelector("#three"),
      selection = d3.select(body).selectAll("node").data(["one", "one", "two"], function(d) { return d || this.id; });
  assert.deepEqual(selection, {
    _groups: [[one,, two]],
    _parents: [body],
    _enter: [[, {
      __data__: "one",
      _next: two,
      _parent: body,
      namespaceURI: "http://www.w3.org/1999/xhtml",
      ownerDocument: body.ownerDocument
    },, ]],
    _exit: [[,, three]]
  });
});

it("selection.data(values, function) puts data with duplicate keys into enter", () => {
  const body = jsdom("<node id='one'></node><node id='two'></node><node id='three'></node>").body,
      one = body.querySelector("#one"),
      two = body.querySelector("#two"),
      three = body.querySelector("#three"),
      selection = d3.select(body).selectAll("node").data(["foo", "foo", "two"], function(d) { return d || this.id; });
  assert.deepEqual(selection, {
    _groups: [[,, two]],
    _parents: [body],
    _enter: [[{
      __data__: "foo",
      _next: two,
      _parent: body,
      namespaceURI: "http://www.w3.org/1999/xhtml",
      ownerDocument: body.ownerDocument
    }, {
      __data__: "foo",
      _next: two,
      _parent: body,
      namespaceURI: "http://www.w3.org/1999/xhtml",
      ownerDocument: body.ownerDocument
    }, ]],
    _exit: [[one,, three]]
  });
});

it("selection.data(values, function) passes the key function datum, index and nodes or data", () => {
  const body = jsdom("<node id='one'></node><node id='two'></node>").body,
      one = body.querySelector("#one"),
      two = body.querySelector("#two"),
      results = [];

  d3.select(one)
      .datum("foo");

  d3.select(body).selectAll("node")
      .data(["foo", "bar"], function(d, i, nodes) { results.push([this, d, i, nodes]); return d || this.id; });

  assert.deepEqual(results, [
    [one, "foo", 0, [one, two]],
    [two, undefined, 1, [one, two]],
    [body, "foo", 0, ["foo", "bar"]],
    [body, "bar", 1, ["foo", "bar"]]
  ]);
});

it("selection.data(values, function) applies the order of the data", () => {
  const body = jsdom("<div id='one'></div><div id='two'></div><div id='three'></div>").body,
      one = body.querySelector("#one"),
      two = body.querySelector("#two"),
      three = body.querySelector("#three"),
      selection = d3.select(body).selectAll("div").data(["four", "three", "one", "five", "two"], function(d) { return d || this.id; });
  assert.deepEqual(selection, {
    _groups: [[, three, one,, two]],
    _parents: [body],
    _enter: [[{
      __data__: "four",
      _next: three,
      _parent: body,
      namespaceURI: "http://www.w3.org/1999/xhtml",
      ownerDocument: body.ownerDocument
    },,, {
      __data__: "five",
      _next: two,
      _parent: body,
      namespaceURI: "http://www.w3.org/1999/xhtml",
      ownerDocument: body.ownerDocument
    }, ]],
    _exit: [[,,,]]
  });
});

it("selection.data(values) returns a new selection, and does not modify the original selection", () => {
  const document = jsdom("<h1 id='one'></h1><h1 id='two'></h1>"),
      root = document.documentElement,
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      selection0 = d3.select(root).selectAll("h1"),
      selection1 = selection0.data([1, 2, 3]),
      selection2 = selection1.data([1]);
  assert.deepEqual(selection0, {
    _groups: [[one, two]],
    _parents: [root]
  });
  assert.deepEqual(selection1, {
    _groups: [[one, two, ]],
    _parents: [root],
    _enter: [[,, {__data__: 3, _next: null, _parent: root, namespaceURI: "http://www.w3.org/1999/xhtml", ownerDocument: document}]],
    _exit: [[,]]
  });
  assert.deepEqual(selection2, {
    _groups: [[one]],
    _parents: [root],
    _enter: [[,]],
    _exit: [[, two]]
  });
});

it("selection.data(values, key) does not modify the groups array in-place", () => {
  const document = jsdom("<h1 id='one'></h1><h1 id='two'></h1>"),
      root = document.documentElement,
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      key = function(d, i) { return i; },
      selection0 = d3.select(root).selectAll("h1"),
      selection1 = selection0.data([1, 2, 3], key),
      selection2 = selection1.data([1], key);
  assert.deepEqual(selection0, {
    _groups: [[one, two]],
    _parents: [root]
  });
  assert.deepEqual(selection1, {
    _groups: [[one, two, ]],
    _parents: [root],
    _enter: [[,, {__data__: 3, _next: null, _parent: root, namespaceURI: "http://www.w3.org/1999/xhtml", ownerDocument: document}]],
    _exit: [[,]]
  });
  assert.deepEqual(selection2, {
    _groups: [[one]],
    _parents: [root],
    _enter: [[,]],
    _exit: [[, two]]
  });
});
