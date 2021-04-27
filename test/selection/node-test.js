import assert from "assert";
import * as d3 from "../../src/index.js";
import jsdom from "../jsdom.js";
it("selection.node() returns the first element in a selection", () => {
  const document = jsdom("<h1 id='one'></h1><h1 id='two'></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two");
  assert.strictEqual(d3.selectAll([one, two]).node(), one);
});

it("selection.node() skips missing elements", () => {
  const document = jsdom("<h1 id='one'></h1><h1 id='two'></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two");
  assert.strictEqual(d3.selectAll([, one,, two]).node(), one);
});

it("selection.node() skips empty groups", () => {
  const document = jsdom("<h1 id='one'></h1><h1 id='two'></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two");
  assert.strictEqual(d3.selectAll([one, two]).selectAll(function(d, i) { return i ? [this] : []; }).node(), two);
});

it("selection.node() returns null for an empty selection", () => {
  assert.strictEqual(d3.select(null).node(), null);
  assert.strictEqual(d3.selectAll([]).node(), null);
  assert.strictEqual(d3.selectAll([,,]).node(), null);
});
