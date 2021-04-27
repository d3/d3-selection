import assert from "assert";
import * as d3 from "../../src/index.js";
import jsdom from "../jsdom.js";
it("selection.order() moves selected elements so that they are before their next sibling", () => {
  const document = jsdom("<h1 id='one'></h1><h1 id='two'></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      selection = d3.selectAll([two, one]);
  assert.strictEqual(selection.order(), selection);
  assert.strictEqual(one.nextSibling, null);
  assert.strictEqual(two.nextSibling, one);
});

it("selection.order() only orders within each group", () => {
  const document = jsdom("<h1><span id='one'></span></h1><h1><span id='two'></span></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      selection = d3.select(document).selectAll("h1").selectAll("span");
  assert.strictEqual(selection.order(), selection);
  assert.strictEqual(one.nextSibling, null);
  assert.strictEqual(two.nextSibling, null);
});
