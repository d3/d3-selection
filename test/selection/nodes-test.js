import assert from "node:assert";
import * as d3 from "d3-selection";
import {it} from "vitest";

it("selection.nodes() returns an array containing all selected nodes", () => {
  document.documentElement.innerHTML = "<h1 id='one'></h1><h1 id='two'></h1>";
  const one = document.querySelector("#one");
  const two = document.querySelector("#two");
  assert.deepStrictEqual(d3.selectAll([one, two]).nodes(), [one, two]);
});

it("selection.nodes() merges nodes from all groups into a single array", () => {
  document.documentElement.innerHTML = "<h1 id='one'></h1><h1 id='two'></h1>";
  const one = document.querySelector("#one");
  const two = document.querySelector("#two");
  assert.deepStrictEqual(d3.selectAll([one, two]).selectAll(function() { return [this]; }).nodes(), [one, two]);
});

it("selection.nodes() skips missing elements", () => {
  document.documentElement.innerHTML = "<h1 id='one'></h1><h1 id='two'></h1>";
  const one = document.querySelector("#one");
  const two = document.querySelector("#two");
  assert.deepStrictEqual(d3.selectAll([, one,, two]).nodes(), [one, two]);
});
