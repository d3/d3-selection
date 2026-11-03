import assert from "node:assert";
import {selectAll, selection} from "d3-selection";
import {assertSelection} from "./asserts.js";
import {it} from "vitest";

it("selectAll(…) returns an instanceof selection", () => {
  document.documentElement.innerHTML = "<h1>hello</h1>";
  assert(selectAll([document]) instanceof selection);
});

it("selectAll(…) accepts an iterable", () => {
  document.documentElement.innerHTML = "<h1>hello</h1>";
  assert.deepStrictEqual(selectAll(new Set([document])).nodes(), [document]);
});

it("selectAll(string) selects all elements that match the selector string, in order", () => {
  document.documentElement.innerHTML = "<h1 id='one'>foo</h1><h1 id='two'>bar</h1>";
  assertSelection(selectAll("h1"), {groups: [document.querySelectorAll("h1")], parents: [document.documentElement]});
});

it("selectAll(nodeList) selects a NodeList of elements", () => {
  document.documentElement.innerHTML = "<h1>hello</h1><h2>world</h2>";
  assertSelection(selectAll(document.querySelectorAll("h1,h2")), {groups: [document.querySelectorAll("h1,h2")]});
});

it("selectAll(array) selects an array of elements", () => {
  document.documentElement.innerHTML = "<h1>hello</h1><h2>world</h2>";
  const h1 = document.querySelector("h1");
  const h2 = document.querySelector("h2");
  assertSelection(selectAll([h1, h2]), {groups: [[h1, h2]]});
});

it("selectAll(array) can select an empty array", () => {
  assertSelection(selectAll([]), {groups: [[]]});
});

it("selectAll(null) selects an empty array", () => {
  assertSelection(selectAll(), {groups: [[]]});
  assertSelection(selectAll(null), {groups: [[]]});
  assertSelection(selectAll(undefined), {groups: [[]]});
});

it("selectAll(null) selects a new empty array each time", () => {
  const one = selectAll()._groups[0];
  const two = selectAll()._groups[0];
  assert.strictEqual(one === two, false);
  one.push("one");
  assert.deepStrictEqual(selectAll()._groups[0], []);
});

it("selectAll(array) can select an array that contains null", () => {
  document.documentElement.innerHTML = "<h1>hello</h1><h2>world</h2>";
  const h1 = document.querySelector("h1");
  assertSelection(selectAll([null, h1, null]), {groups: [[null, h1, null]]});
});

it("selectAll(array) can select an array that contains arbitrary objects", () => {
  const object = {};
  assertSelection(selectAll([object]), {groups: [[object]]});
});
