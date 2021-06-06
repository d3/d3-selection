import assert from "assert";
import {selectAll} from "../../src/index.js";
import jsdom from "../jsdom.js";

it("selection.size() returns the number of selected elements", jsdom("<h1 id='one'></h1><h1 id='two'></h1>", () => {
  const one = document.querySelector("#one");
  const two = document.querySelector("#two");
  assert.deepStrictEqual(selectAll([]).size(), 0);
  assert.deepStrictEqual(selectAll([one]).size(), 1);
  assert.deepStrictEqual(selectAll([one, two]).size(), 2);
}));

it("selection.size() skips missing elements", jsdom("<h1 id='one'></h1><h1 id='two'></h1>", () => {
  const one = document.querySelector("#one");
  const two = document.querySelector("#two");
  assert.deepStrictEqual(selectAll([, one,, two]).size(), 2);
}));
