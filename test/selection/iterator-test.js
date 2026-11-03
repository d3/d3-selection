import assert from "node:assert";
import {selectAll} from "../../src/index.js";
import {it} from "vitest";

it("selection are iterable over the selected nodes", () => {
  document.documentElement.innerHTML = "<h1 id='one'></h1><h1 id='two'></h1>";
  const one = document.querySelector("#one");
  const two = document.querySelector("#two");
  assert.deepStrictEqual([...selectAll([one, two])], [one, two]);
});

it("selection iteration merges nodes from all groups into a single array", () => {
  document.documentElement.innerHTML = "<h1 id='one'></h1><h1 id='two'></h1>";
  const one = document.querySelector("#one");
  const two = document.querySelector("#two");
  assert.deepStrictEqual([...selectAll([one, two]).selectAll(function() { return [this]; })], [one, two]);
});

it("selection iteration skips missing elements", () => {
  document.documentElement.innerHTML = "<h1 id='one'></h1><h1 id='two'></h1>";
  const one = document.querySelector("#one");
  const two = document.querySelector("#two");
  assert.deepStrictEqual([...selectAll([, one,, two])], [one, two]);
});
