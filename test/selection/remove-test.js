import assert from "assert";
import * as d3 from "../../src/index.js";
import jsdom from "../jsdom.js";
it("selection.remove() removes selected elements from their parent", () => {
  const document = jsdom("<h1 id='one'></h1><h1 id='two'></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      selection = d3.selectAll([two, one]);
  assert.strictEqual(selection.remove(), selection);
  assert.strictEqual(one.parentNode, null);
  assert.strictEqual(two.parentNode, null);
});

it("selection.remove() skips elements that have already been detached", () => {
  const document = jsdom("<h1 id='one'></h1><h1 id='two'></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      selection = d3.selectAll([two, one]);
  one.parentNode.removeChild(one);
  assert.strictEqual(selection.remove(), selection);
  assert.strictEqual(one.parentNode, null);
  assert.strictEqual(two.parentNode, null);
});

it("selection.remove() skips missing elements", () => {
  const document = jsdom("<h1 id='one'></h1><h1 id='two'></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      selection = d3.selectAll([, one]);
  assert.strictEqual(selection.remove(), selection);
  assert.strictEqual(one.parentNode, null);
  assert.strictEqual(two.parentNode, document.body);
});
