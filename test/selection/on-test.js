import assert from "assert";
import * as d3 from "../../src/index.js";
import it from "../jsdom.js";

it("selection.on(type, listener) registers a listeners for the specified event type on each selected element", () => {
  const clicks = 0,
      document = jsdom("<h1 id='one'></h1><h1 id='two'></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      selection = d3.selectAll([one, two]);
  assert.strictEqual(selection.on("click", function() { ++clicks; }), selection);
  selection.dispatch("click");
  assert.strictEqual(clicks, 2);
  selection.dispatch("tick");
  assert.strictEqual(clicks, 2);
});

it("selection.on(type, listener) observes the specified name, if any", () => {
  let foo = 0,
      bar = 0;
  const document = jsdom("<h1 id='one'></h1><h1 id='two'></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      selection = d3.selectAll([one, two]).on("click.foo", function() { ++foo; }).on("click.bar", function() { ++bar; });
  selection.dispatch("click");
  assert.strictEqual(foo, 2);
  assert.strictEqual(bar, 2);
});

it("selection.on(type, listener, capture) observes the specified capture flag, if any", () => {
  let result;
  const selection = d3.select({addEventListener: function(type, listener, capture) { result = capture; }});
  assert.strictEqual(selection.on("click.foo", function() {}, true), selection);
  assert.deepStrictEqual(result, true);
});

it("selection.on(type) returns the listener for the specified event type, if any", () => {
  const clicked = function() {},
      document = jsdom("<h1 id='one'></h1><h1 id='two'></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      selection = d3.selectAll([one, two]).on("click", clicked);
  assert.strictEqual(selection.on("click"), clicked);
});

it("selection.on(type) observes the specified name, if any", () => {
  const clicked = function() {},
      document = jsdom("<h1 id='one'></h1><h1 id='two'></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      selection = d3.selectAll([one, two]).on("click.foo", clicked);
  assert.strictEqual(selection.on("click"), undefined);
  assert.strictEqual(selection.on("click.foo"), clicked);
  assert.strictEqual(selection.on("click.bar"), undefined);
  assert.strictEqual(selection.on("tick.foo"), undefined);
  assert.strictEqual(selection.on(".foo"), undefined);
});

it("selection.on(type, null) removes the listener with the specified name, if any", () => {
  let clicks = 0;
  const document = jsdom("<h1 id='one'></h1><h1 id='two'></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      selection = d3.selectAll([one, two]).on("click", function() { ++clicks; });
  assert.strictEqual(selection.on("click", null), selection);
  assert.strictEqual(selection.on("click"), undefined);
  selection.dispatch("click");
  assert.strictEqual(clicks, 0);
});

it("selection.on(type, null) observes the specified name, if any", () => {
  let foo = 0,
      bar = 0;
  const fooed = function() { ++foo; },
      barred = function() { ++bar; },
      document = jsdom("<h1 id='one'></h1><h1 id='two'></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      selection = d3.selectAll([one, two]).on("click.foo", fooed).on("click.bar", barred);
  assert.strictEqual(selection.on("click.foo", null), selection);
  assert.strictEqual(selection.on("click.foo"), undefined);
  assert.strictEqual(selection.on("click.bar"), barred);
  selection.dispatch("click");
  assert.strictEqual(foo, 0);
  assert.strictEqual(bar, 2);
});

it("selection.on(type, null, capture) ignores the specified capture flag, if any", () => {
  let clicks = 0;
  const clicked = function() { ++clicks; },
      document = jsdom(),
      selection = d3.select(document).on("click.foo", clicked, true);
  selection.dispatch("click");
  assert.strictEqual(clicks, 1);
  selection.on(".foo", null, false).dispatch("click");
  assert.strictEqual(clicks, 1);
  assert.strictEqual(selection.on("click.foo"), undefined);
});

it("selection.on(name, null) removes all listeners with the specified name", () => {
  let clicks = 0,
      loads = 0;
  const clicked = function() { ++clicks; },
      loaded = function() { ++loads; },
      document = jsdom("<h1 id='one'></h1><h1 id='two'></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      selection = d3.selectAll([one, two]).on("click.foo", clicked).on("load.foo", loaded);
  assert.strictEqual(selection.on("click.foo"), clicked);
  assert.strictEqual(selection.on("load.foo"), loaded);
  selection.dispatch("click");
  selection.dispatch("load");
  assert.strictEqual(clicks, 2);
  assert.strictEqual(loads, 2);
  assert.strictEqual(selection.on(".foo", null), selection);
  assert.strictEqual(selection.on("click.foo"), undefined);
  assert.strictEqual(selection.on("load.foo"), undefined);
  selection.dispatch("click");
  selection.dispatch("load");
  assert.strictEqual(clicks, 2);
  assert.strictEqual(loads, 2);
});

it("selection.on(name, null) can remove a listener with capture", () => {
  let clicks = 0;
  const clicked = function() { ++clicks; },
      document = jsdom(),
      selection = d3.select(document).on("click.foo", clicked, true);
  selection.dispatch("click");
  assert.strictEqual(clicks, 1);
  selection.on(".foo", null).dispatch("click");
  assert.strictEqual(clicks, 1);
  assert.strictEqual(selection.on("click.foo"), undefined);
});

it("selection.on(name, listener) has no effect", () => {
  let clicks = 0;
  const clicked = function() { ++clicks; },
      document = jsdom("<h1 id='one'></h1><h1 id='two'></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      selection = d3.selectAll([one, two]).on("click.foo", clicked);
  assert.strictEqual(selection.on(".foo", function() { throw new Error; }), selection);
  assert.strictEqual(selection.on("click.foo"), clicked);
  selection.dispatch("click");
  assert.strictEqual(clicks, 2);
});

it("selection.on(type) skips missing elements", () => {
  const clicked = function() {},
      document = jsdom("<h1 id='one'></h1><h1 id='two'></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      selection = d3.selectAll([one, two]).on("click.foo", clicked);
  assert.strictEqual(d3.selectAll([, two]).on("click.foo"), clicked);
});

it("selection.on(type, listener) skips missing elements", () => {
  let clicks = 0;
  const clicked = function() { ++clicks; },
      document = jsdom("<h1 id='one'></h1><h1 id='two'></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      selection = d3.selectAll([, two]).on("click.foo", clicked);
  selection.dispatch("click");
  assert.strictEqual(clicks, 1);
});

it("selection.on(type, listener) passes the event and listener data", () => {
  const document = jsdom("<parent id='one'><child id='three'></child><child id='four'></child></parent><parent id='two'><child id='five'></child></parent>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      three = document.querySelector("#three"),
      four = document.querySelector("#four"),
      five = document.querySelector("#five"),
      results = [];

  const selection = d3.selectAll([one, two])
      .datum(function(d, i) { return "parent-" + i; })
    .selectAll("child")
      .data(function(d, i) { return [0, 1].map(function(j) { return "child-" + i + "-" + j; }); })
      .on("foo", function(e, d) { results.push([this, e.type, d]); });

  assert.deepStrictEqual(results, []);
  selection.dispatch("foo");
  assert.deepStrictEqual(results, [
    [three, "foo", "child-0-0"],
    [four, "foo", "child-0-1"],
    [five, "foo", "child-1-0"]
  ]);
});

it("selection.on(type, listener) passes the current listener data", () => {
  const document = jsdom("<parent id='one'><child id='three'></child><child id='four'></child></parent><parent id='two'><child id='five'></child></parent>"),
      results = [],
      selection = d3.select(document).on("foo", function(e, d) { results.push(d); });
  selection.dispatch("foo");
  document.__data__ = 42;
  selection.dispatch("foo");
  assert.deepStrictEqual(results, [undefined, 42]);
});
