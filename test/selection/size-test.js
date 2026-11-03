import assert from "node:assert";
import {selectAll} from "d3-selection";
import {it} from "vitest";

it("selection.size() returns the number of selected elements", () => {
  document.documentElement.innerHTML = "<h1 id='one'></h1><h1 id='two'></h1>";
  const one = document.querySelector("#one");
  const two = document.querySelector("#two");
  assert.deepStrictEqual(selectAll([]).size(), 0);
  assert.deepStrictEqual(selectAll([one]).size(), 1);
  assert.deepStrictEqual(selectAll([one, two]).size(), 2);
});

it("selection.size() skips missing elements", () => {
  document.documentElement.innerHTML = "<h1 id='one'></h1><h1 id='two'></h1>";
  const one = document.querySelector("#one");
  const two = document.querySelector("#two");
  assert.deepStrictEqual(selectAll([, one,, two]).size(), 2);
});
