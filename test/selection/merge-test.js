import assert from "assert";
import * as d3 from "../../src/index.js";
import jsdom from "../jsdom.js";
it("selection.merge(selection) returns a new selection, merging the two selections", () => {
  const document = jsdom("<h1 id='one'>one</h1><h1 id='two'>two</h1>"),
      body = document.body,
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      selection0 = d3.select(body).selectAll("h1"),
      selection1 = selection0.select(function(d, i) { return i & 1 ? this : null; }),
      selection2 = selection0.select(function(d, i) { return i & 1 ? null : this; });
  assert.deepStrictEqual(selection1.merge(selection2), {_groups: [[one, two]], _parents: [body]});
  assert.deepStrictEqual(selection1, {_groups: [[, two]], _parents: [body]});
  assert.deepStrictEqual(selection2, {_groups: [[one, ]], _parents: [body]});
});

it("selection.merge(selection) returns a selection with the same size and parents as this selection", () => {
  const document0 = jsdom("<h1 id='one'>one</h1><h1 id='two'>two</h1>"),
      document1 = jsdom("<h1 id='one'>one</h1><h1 id='two'>two</h1><h1 id='three'>three</h1>"),
      body0 = document0.body,
      body1 = document1.body,
      one0 = document0.querySelector("#one"),
      one1 = document1.querySelector("#one"),
      two0 = document0.querySelector("#two"),
      two1 = document1.querySelector("#two"),
      three1 = document1.querySelector("#three");
  assert.deepStrictEqual(d3.select(body0).selectAll("h1").merge(d3.select(body1).selectAll("h1")), {_groups: [[one0, two0]], _parents: [body0]});
  assert.deepStrictEqual(d3.select(body1).selectAll("h1").merge(d3.select(body0).selectAll("h1")), {_groups: [[one1, two1, three1]], _parents: [body1]});
});

it("selection.merge(selection) reuses groups from this selection if the other selection has fewer groups", () => {
  const document = jsdom("<parent><child></child><child></child></parent><parent><child></child><child></child></parent>"),
      body = document.body,
      selection0 = d3.select(body).selectAll("parent").selectAll("child"),
      selection1 = d3.select(body).selectAll("parent:first-child").selectAll("child"),
      selection01 = selection0.merge(selection1),
      selection10 = selection1.merge(selection0);
  assert.deepStrictEqual(selection01, selection0);
  assert.deepStrictEqual(selection10, selection1);
  assert.strictEqual(selection01._groups[1], selection0._groups[1]);
});

it("selection.merge(selection) reuses this selection’s parents", () => {
  const document = jsdom("<parent><child></child><child></child></parent><parent><child></child><child></child></parent>"),
      body = document.body,
      selection0 = d3.select(body).selectAll("parent").selectAll("child"),
      selection1 = d3.select(body).selectAll("parent:first-child").selectAll("child"),
      selection01 = selection0.merge(selection1),
      selection10 = selection1.merge(selection0);
  assert.strictEqual(selection01._parents, selection0._parents);
  assert.strictEqual(selection10._parents, selection1._parents);
});
