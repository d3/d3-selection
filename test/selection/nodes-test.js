import assert from "assert";
import * as d3 from "../../src/index.js";
import jsdom from "../jsdom.js";
it("selection.nodes() returns an array containing all selected nodes", () => {
  const document = jsdom("<h1 id='one'></h1><h1 id='two'></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two");
  assert.deepEqual(d3.selectAll([one, two]).nodes(), [one, two]);
});

it("selection.nodes() merges nodes from all groups into a single array", () => {
  const document = jsdom("<h1 id='one'></h1><h1 id='two'></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two");
  assert.deepEqual(d3.selectAll([one, two]).selectAll(function() { return [this]; }).nodes(), [one, two]);
});

it("selection.nodes() skips missing elements", () => {
  const document = jsdom("<h1 id='one'></h1><h1 id='two'></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two");
  assert.deepEqual(d3.selectAll([, one,, two]).nodes(), [one, two]);
});
