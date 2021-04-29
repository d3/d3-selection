import assert from "assert";
import * as d3 from "../src/index.js";
import jsdom from "./jsdom.js";

it("d3.select(…) returns an instanceof d3.selection", () => {
  const document = jsdom("<h1>hello</h1>");
  assert(d3.select(document) instanceof d3.selection);
});

it("d3.select(string) selects the first element that matches the selector string", () => {
  jsdom("<h1 id='one'>foo</h1><h1 id='two'>bar</h1>");
  try {
    assert.deepEqual(d3.select("h1"), new Selection([[document.querySelector("h1")]], [document.documentElement]));
  } finally {
    delete global.document;
  }
});

it("d3.select(element) selects the given element", () => {
  const document = jsdom("<h1>hello</h1>");
  assert.deepEqual(d3.select(document.body), {_groups: [[document.body]], _parents: [null]});
  assert.deepEqual(d3.select(document.documentElement), {_groups: [[document.documentElement]], _parents: [null]});
});

it("d3.select(window) selects the given window", () => {
  const document = jsdom("<h1>hello</h1>");
  assert.deepEqual(d3.select(document.defaultView), {_groups: [[document.defaultView]], _parents: [null]});
});

it("d3.select(document) selects the given document", () => {
  const document = jsdom("<h1>hello</h1>");
  assert.deepEqual(d3.select(document), {_groups: [[document]], _parents: [null]});
});

it("d3.select(null) selects null", () => {
  const document = jsdom("<h1>hello</h1><null></null><undefined></undefined>");
  assert.deepEqual(d3.select(null), {_groups: [[null]], _parents: [null]});
  assert.deepEqual(d3.select(undefined), {_groups: [[undefined]], _parents: [null]});
  assert.deepEqual(d3.select(), {_groups: [[undefined]], _parents: [null]});
});

it("d3.select(object) selects an arbitrary object", () => {
  const object = {};
  assert.deepEqual(d3.select(object), {_groups: [[object]], _parents: [null]});
});
