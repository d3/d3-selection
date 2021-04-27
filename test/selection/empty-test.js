import assert from "assert";
import * as d3 from "../../src/index.js";
import jsdom from "../jsdom.js";
it("selection.empty() return false if the selection is not empty", () => {
  const document = jsdom("<h1 id='one'></h1><h1 id='two'></h1>");
  assert.strictEqual(d3.select(document).empty(), false);
});

it("selection.empty() return true if the selection is empty", () => {
  const document = jsdom("<h1 id='one'></h1><h1 id='two'></h1>");
  assert.strictEqual(d3.select(null).empty(), true);
  assert.strictEqual(d3.selectAll([]).empty(), true);
  assert.strictEqual(d3.selectAll([,]).empty(), true);
});
