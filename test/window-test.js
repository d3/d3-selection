import assert from "assert";
import {window} from "../src/index.js";
import jsdom from "./jsdom.js";

it("window(node) returns node.ownerDocument.defaultView", jsdom("", () => {
  assert.strictEqual(window(document.body), document.defaultView);
}));

it("window(document) returns document.defaultView", jsdom("", () => {
  assert.strictEqual(window(document), document.defaultView);
}));

it("window(window) returns window", jsdom("", () => {
  assert.strictEqual(window(global.window), global.window);
}));
