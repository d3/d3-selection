import assert from "assert";
import * as d3 from "../src/index.js";
import jsdom from "./jsdom.js";

it("d3.selector(selector).call(element) returns the first element that matches the selector", () => {
  const document = jsdom("<body class='foo'>");
  assert.strictEqual(d3.selector("body").call(document.documentElement), document.body);
  assert.strictEqual(d3.selector(".foo").call(document.documentElement), document.body);
  assert.strictEqual(d3.selector("body.foo").call(document.documentElement), document.body);
  assert.strictEqual(d3.selector("h1").call(document.documentElement), null);
  assert.strictEqual(d3.selector("body.bar").call(document.documentElement), null);
});

it("d3.selector(null).call(element) always returns undefined", () => {
  const document = jsdom("<body class='foo'><undefined></undefined><null></null>");
  assert.strictEqual(d3.selector().call(document.documentElement), undefined);
  assert.strictEqual(d3.selector(null).call(document.documentElement), undefined);
  assert.strictEqual(d3.selector(undefined).call(document.documentElement), undefined);
});
