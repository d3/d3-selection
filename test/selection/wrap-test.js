import assert from "assert";
import {create, selectAll} from "../../src/index.js";
import {assertSelection} from "../asserts.js";
import it from "../jsdom.js";

it("selection.wrap(name) wraps each of the selected elements in a new element of the specified name", "<div id='one'></div><div id='two'></div>", () => {
  const one = document.querySelector("#one");
  const two = document.querySelector("#two");
  const selection = selectAll([one, two]).data([1, 2]).wrap("pre");
  const [three, four] = document.querySelectorAll("pre");
  assertSelection(selection, {groups: [[three, four]], parents: [null]});
});

it("selection.wrap(name) wraps with the appropriate namespace", () => {
  const htmllink = create("span").wrap("a");
  assert.strictEqual(htmllink.node().namespaceURI, "http://www.w3.org/1999/xhtml");
  const svglink = create("svg:text").wrap("a");
  assert.strictEqual(svglink.node().namespaceURI, "http://www.w3.org/2000/svg");
});

it("selection.wrap(name) wraps unattached elements", () => {
  const p = create("span").text("Hello").wrap("p");
  assert.strictEqual(p.node().nodeName, "P");
});

it("selection.wrap(function) passes the creator function data, index and group", "<div id='one'></div><div id='two'></div>", () => {
  const one = document.querySelector("#one");
  const two = document.querySelector("#two");
  const results = [];

  selectAll([one, two])
      .datum(function(d, i) { return "node-" + i; })
    .wrap(function(d, i, nodes) {
      results.push([this, d, i, nodes]);
      return document.createElement("p");
    });

  assert.deepStrictEqual(results, [
    [one, "node-0", 0, [one, two]],
    [two, "node-1", 1, [one, two]]
  ]);
});
