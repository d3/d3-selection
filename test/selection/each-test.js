import assert from "assert";
import * as d3 from "../../src/index.js";
import jsdom from "../jsdom.js";
it("selection.each(function) calls the specified function for each selected element in order", () => {
  const result = [],
      document = jsdom("<h1 id='one'></h1><h1 id='two'></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      selection = d3.selectAll([one, two]).datum(function(d, i) { return "node-" + i; });
  assert.strictEqual(selection.each(function(d, i, nodes) { result.push(this, d, i, nodes); }), selection);
  assert.deepEqual(result, [one, "node-0", 0, [one, two], two, "node-1", 1, [one, two]]);
});

it("selection.each(function) skips missing elements", () => {
  const result = [],
      document = jsdom("<h1 id='one'></h1><h1 id='two'></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      selection = d3.selectAll([, one,, two]).datum(function(d, i) { return "node-" + i; });
  assert.strictEqual(selection.each(function(d, i, nodes) { result.push(this, d, i, nodes); }), selection);
  assert.deepEqual(result, [one, "node-1", 1, [, one,, two], two, "node-3", 3, [, one,, two]]);
});
