import assert from "assert";
import * as d3 from "../../src/index.js";
import jsdom from "../jsdom.js";
it("select.selectChild(…) selects the first (matching) child", () => {
  const document = jsdom("<h1><span>hello</span>, <span>world<span>!</span></span></h1>");
  const sel = d3.select(document).select("h1");
  assert(sel.selectChild(() => true) instanceof d3.selection);
  assert.deepEqual(sel.selectChild(() => true), sel.select("*"));
  assert(sel.selectChild() instanceof d3.selection);
  assert(sel.selectChild("*") instanceof d3.selection);
  assert.deepEqual(sel.selectChild("*"), sel.select("*"));
  assert.deepEqual(sel.selectChild(), sel.select("*"));
  assert.deepEqual(sel.selectChild("div"), sel.select("div"));
  assert.strictEqual(sel.selectChild("span").text(), "hello");
});

it("selectAll.selectChild(…) selects the first (matching) child", () => {
  const document = jsdom(`
    <div><span>hello</span>, <span>world<span>!</span></span></div>
    <div><span>hello2</span>, <span>world2<span>!2</span></span></div>
  `);
  const sel = d3.select(document).selectAll("div");
  assert(sel.selectChild(() => true) instanceof d3.selection);
  assert.deepEqual(sel.selectChild(() => true), sel.select("*"));
  assert(sel.selectChild() instanceof d3.selection);
  assert(sel.selectChild("*") instanceof d3.selection);
  assert.deepEqual(sel.selectChild("*"), sel.select("*"));
  assert.deepEqual(sel.selectChild(), sel.select("*"));
  assert.deepEqual(sel.selectChild("div"), sel.select("div"));
  assert.strictEqual(sel.selectChild("span").text(), "hello");
});


it("select.selectChildren(…) selects the matching children", () => {
  const document = jsdom("<h1><span>hello</span>, <span>world<span>!</span></span></h1>");
  const sel = d3.select(document).select("h1");
  assert(sel.selectChildren("*") instanceof d3.selection);
  assert.strictEqual(sel.selectChildren("*").text(), "hello");
  assert.strictEqual(sel.selectChildren().size(), 2);
  assert.strictEqual(sel.selectChildren("*").size(), 2);
  assert.deepEqual(sel.selectChildren(), sel.selectChildren("*"));
  assert.strictEqual(sel.selectChildren("span").size(), 2);
  assert.strictEqual(sel.selectChildren("div").size(), 0);
});

it("selectAll.selectChildren(…) selects the matching children", () => {
  const document = jsdom(`
    <div><span>hello</span>, <span>world<span>!</span></span></div>
    <div><span>hello2</span>, <span>world2<span>!2</span></span></div>
  `);
  const sel = d3.select(document).selectAll("div");
  assert(sel.selectChildren("*") instanceof d3.selection);
  assert.strictEqual(sel.selectChildren("*").text(), "hello");
  assert.strictEqual(sel.selectChildren().size(), 4);
  assert.strictEqual(sel.selectChildren("*").size(), 4);
  assert.deepEqual(sel.selectChildren(), sel.selectChildren("*"));
  assert.strictEqual(sel.selectChildren("span").size(), 4);
  assert.strictEqual(sel.selectChildren("div").size(), 0);
});

