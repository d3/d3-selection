import assert from "assert";
import * as d3 from "../../src/index.js";
import jsdom from "../jsdom.js";
it("selection.size() returns the number of selected elements", () => {
  const document = jsdom("<h1 id='one'></h1><h1 id='two'></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two");
  assert.deepStrictEqual(d3.selectAll([]).size(), 0);
  assert.deepStrictEqual(d3.selectAll([one]).size(), 1);
  assert.deepStrictEqual(d3.selectAll([one, two]).size(), 2);
});

it("selection.size() skips missing elements", () => {
  const document = jsdom("<h1 id='one'></h1><h1 id='two'></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two");
  assert.deepStrictEqual(d3.selectAll([, one,, two]).size(), 2);
});
