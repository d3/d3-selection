import assert from "assert";
import * as d3 from "../src/index.js";
import jsdom from "./jsdom.js";

it("d3.selectorAll(selector).call(element) returns all elements that match the selector", () => {
  const document = jsdom("<body class='foo'><div class='foo'>"),
      body = document.body,
      div = document.querySelector("div");
  assert.deepEqual(d3.selectorAll("body").call(document.documentElement), [body]);
  assert.deepEqual(d3.selectorAll(".foo").call(document.documentElement), [body, div]);
  assert.deepEqual(d3.selectorAll("div.foo").call(document.documentElement), [div]);
  assert.deepEqual(d3.selectorAll("div").call(document.documentElement), [div]);
  assert.deepEqual(d3.selectorAll("div,body").call(document.documentElement), [body,div]);
  assert.deepEqual(d3.selectorAll("h1").call(document.documentElement), []);
  assert.deepEqual(d3.selectorAll("body.bar").call(document.documentElement), []);
});

it("d3.selectorAll(null).call(element) always returns the empty array", () => {
  const document = jsdom("<body class='foo'><undefined></undefined><null></null>");
  assert.deepEqual(d3.selectorAll().call(document.documentElement), []);
  assert.deepEqual(d3.selectorAll(null).call(document.documentElement), []);
  assert.deepEqual(d3.selectorAll(undefined).call(document.documentElement), []);
});

it("d3.selectorAll(null).call(element) returns a new empty array each time", () => {
  const one = d3.selectorAll()(),
      two = d3.selectorAll()();
  assert.strictEqual(one === two, false);
  one.push("one");
  assert.deepEqual(d3.selectorAll()(), []);
});
