import assert from "node:assert";
import {window} from "d3-selection";
import {it} from "vitest";

it("window(node) returns node.ownerDocument.defaultView", () => {
  assert.strictEqual(window(document.body), document.defaultView);
});

it("window(document) returns document.defaultView", () => {
  assert.strictEqual(window(document), document.defaultView);
});

it("window(window) returns window", () => {
  assert.strictEqual(window(global.window), global.window);
});
