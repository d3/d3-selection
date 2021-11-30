import assert from "assert";
import {selectAll} from "../../src/index.js";
import {assertSelection} from "../asserts.js";
import it from "../jsdom.js";

it("selection.insertAfter(name) inserts a new element of the specified name after each selected element", "<div><div id='one'>one</div><div id='two'>two</div>", () => {
  const one = document.querySelector("#one");
  const two = document.querySelector("#two");
  const selection = selectAll([one, two]).data([1, 2]).insertAfter("span").text(function(d) { return `(after ${d})`; });
  const three = document.querySelector("span:nth-child(2)");
  const four = document.querySelector("span:last-child");
  assertSelection(selection, {groups: [[three, four]], parents: [null]});
  assert.equal(document.querySelector("div").textContent, "one(after 1)two(after 2)");
});

it("selection.insertAfter(function) inserts the returned element after each selected element", "<div><div id='one'>one</div><div id='two'>two</div>", () => {
  const one = document.querySelector("#one");
  const two = document.querySelector("#two");
  const selection = selectAll([one, two]).data([1, 2]).insertAfter(function(d) { const a = document.createElement("SPAN"); a.textContent = `(after ${d})`; return a; });
  const three = document.querySelector("span:nth-child(2)");
  const four = document.querySelector("span:last-child");
  assertSelection(selection, {groups: [[three, four]], parents: [null]});
  assert.equal(document.querySelector("div").textContent, "one(after 1)two(after 2)");
});
