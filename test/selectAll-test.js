import assert from "assert";
import * as d3 from "../src/index.js";
import jsdom from "./jsdom.js";

it("d3.selectAll(…) returns an instanceof d3.selection", () => {
  const document = jsdom("<h1>hello</h1>");
  assert(d3.selectAll([document]) instanceof d3.selection);
});

it("d3.selectAll(…) accepts an iterable", () => {
  const document = global.document = jsdom("<h1>hello</h1>");
  try {
    assert.deepEqual(d3.selectAll(new Set([document])).nodes(), [document]);
} finally {
    delete global.document;
  }
});

it("d3.selectAll(string) selects all elements that match the selector string, in order", () => {
  const document = global.document = jsdom("<h1 id='one'>foo</h1><h1 id='two'>bar</h1>");
  try {
    assert.deepEqual(d3.selectAll("h1"), {_groups: [document.querySelectorAll("h1")], _parents: [document.documentElement]});
} finally {
    delete global.document;
  }
});

it("d3.selectAll(nodeList) selects a NodeList of elements", () => {
  const document = jsdom("<h1>hello</h1><h2>world</h2>");
  assert.deepEqual(d3.selectAll(document.querySelectorAll("h1,h2")), {_groups: [document.querySelectorAll("h1,h2")], _parents: [null]});
});

it("d3.selectAll(array) selects an array of elements", () => {
  const document = jsdom("<h1>hello</h1><h2>world</h2>"),
      h1 = document.querySelector("h1"),
      h2 = document.querySelector("h2");
  assert.deepEqual(d3.selectAll([h1, h2]), {_groups: [[h1, h2]], _parents: [null]});
});

it("d3.selectAll(array) can select an empty array", () => {
  assert.deepEqual(d3.selectAll([]), {_groups: [[]], _parents: [null]});
});

it("d3.selectAll(null) selects an empty array", () => {
  assert.deepEqual(d3.selectAll(), {_groups: [[]], _parents: [null]});
  assert.deepEqual(d3.selectAll(null), {_groups: [[]], _parents: [null]});
  assert.deepEqual(d3.selectAll(undefined), {_groups: [[]], _parents: [null]});
});

it("d3.selectAll(null) selects a new empty array each time", () => {
  const one = d3.selectAll()._groups[0],
      two = d3.selectAll()._groups[0];
  assert.strictEqual(one === two, false);
  one.push("one");
  assert.deepEqual(d3.selectAll()._groups[0], []);
});

it("d3.selectAll(array) can select an array that contains null", () => {
  const document = jsdom("<h1>hello</h1><h2>world</h2>"),
      h1 = document.querySelector("h1");
  assert.deepEqual(d3.selectAll([null, h1, null]), {_groups: [[null, h1, null]], _parents: [null]});
});

it("d3.selectAll(array) can select an array that contains arbitrary objects", () => {
  const object = {};
  assert.deepEqual(d3.selectAll([object]), {_groups: [[object]], _parents: [null]});
});
