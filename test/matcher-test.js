import assert from "assert";
import * as d3 from "../src/index.js";
import jsdom from "./jsdom.js";

it("d3.matcher(selector).call(element) returns true if the element matches the selector", () => {
  const document = jsdom("<body class='foo'>");
  assert.strictEqual(d3.matcher("body").call(document.body), true);
  assert.strictEqual(d3.matcher(".foo").call(document.body), true);
  assert.strictEqual(d3.matcher("body.foo").call(document.body), true);
  assert.strictEqual(d3.matcher("h1").call(document.body), false);
  assert.strictEqual(d3.matcher("body.bar").call(document.body), false);
});
