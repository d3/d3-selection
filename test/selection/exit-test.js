import assert from "assert";
import * as d3 from "../../src/index.js";
import jsdom from "../jsdom.js";
it("selection.exit() returns an empty selection before a data-join", () => {
  const body = jsdom("<h1>hello</h1>").body,
      selection = d3.select(body);
  assert.deepEqual(selection.exit(), {_groups: [[]], _parents: [null]});
});

it("selection.exit() shares the update selection’s parents", () => {
  const body = jsdom("<h1>hello</h1>").body,
      selection = d3.select(body);
  assert.strictEqual(selection.exit()._parents, selection._parents);
});

it("selection.exit() returns the same selection each time", () => {
  const body = jsdom("<h1>hello</h1>").body,
      selection = d3.select(body);
  assert.deepEqual(selection.exit(), selection.exit());
});

it("selection.exit() contains unbound elements after a data-join", () => {
  const body = jsdom("<div id='one'></div><div id='two'></div>").body,
      one = body.querySelector("#one"),
      two = body.querySelector("#two"),
      selection = d3.select(body).selectAll("div").data(["foo"]);
  assert.deepEqual(selection.exit(), {
    _groups: [[, two]],
    _parents: [body]
  });
});

it("selection.exit() uses the order of the originating selection", () => {
  const body = jsdom("<div id='one'></div><div id='two'></div><div id='three'></div>").body,
      one = body.querySelector("#one"),
      two = body.querySelector("#two"),
      three = body.querySelector("#three"),
      selection = d3.select(body).selectAll("div").data(["three", "one"], function(d) { return d || this.id; });
  assert.deepEqual(selection.exit(), {
    _groups: [[, two, ]],
    _parents: [body]
  });
});
