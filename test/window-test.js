import assert from "assert";
import * as d3 from "../src/index.js";
import jsdom from "./jsdom.js";

it("d3.window(node) returns node.ownerDocument.defaultView", () => {
  const document = jsdom();
  assert.strictEqual(d3.window(document.body), document.defaultView);
});

it("d3.window(document) returns document.defaultView", () => {
  const document = jsdom();
  assert.strictEqual(d3.window(document), document.defaultView);
});

it("d3.window(window) returns window", () => {
  const window = jsdom().defaultView;
  assert.strictEqual(d3.window(window), window);
});
