import assert from "assert";
import * as d3 from "../../src/index.js";
import jsdom from "../jsdom.js";
it("selection are iterable over the selected nodes", () => {
  const document = jsdom("<h1 id='one'></h1><h1 id='two'></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two");
  assert.deepEqual([...d3.selectAll([one, two])], [one, two]);
});

it("selection iteration merges nodes from all groups into a single array", () => {
  const document = jsdom("<h1 id='one'></h1><h1 id='two'></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two");
  assert.deepEqual([...d3.selectAll([one, two]).selectAll(function() { return [this]; })], [one, two]);
});

it("selection iteration skips missing elements", () => {
  const document = jsdom("<h1 id='one'></h1><h1 id='two'></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two");
  assert.deepEqual([...d3.selectAll([, one,, two])], [one, two]);
});
