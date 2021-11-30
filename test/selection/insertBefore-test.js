import assert from "assert";
import {selectAll} from "../../src/index.js";
import {assertSelection} from "../asserts.js";
import it from "../jsdom.js";

it("selection.insertBefore(name) inserts a new element of the specified name before each selected element", "<div><div id='one'>one</div><div id='two'>two</div>", () => {
  const one = document.querySelector("#one");
  const two = document.querySelector("#two");
  const selection = selectAll([one, two]).data([1, 2]).insertBefore("span").text(function(d) { return `(before ${d})`; });
  const three = document.querySelector("span:first-child");
  const four = document.querySelector("span:nth-child(3)");
  assertSelection(selection, {groups: [[three, four]], parents: [null]});
  assert.equal(document.querySelector("div").textContent, "(before 1)one(before 2)two");
});

it("selection.insertBefore(function) inserts the returned element before each selected element", "<div><div id='one'>one</div><div id='two'>two</div>", () => {
  const one = document.querySelector("#one");
  const two = document.querySelector("#two");
  const selection = selectAll([one, two]).data([1, 2]).insertBefore(function(d) { const a = document.createElement("SPAN"); a.textContent = `(before ${d})`; return a; });
  const three = document.querySelector("span:first-child");
  const four = document.querySelector("span:nth-child(3)");
  assertSelection(selection, {groups: [[three, four]], parents: [null]});
  assert.equal(document.querySelector("div").textContent, "(before 1)one(before 2)two");
});
