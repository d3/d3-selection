import assert from "assert";
import * as d3 from "../../src/index.js";
import it from "../jsdom.js";

it("selection.call(function) calls the specified function, passing the selection", () => {
  let result;
  const document = jsdom(),
      selection = d3.select(document);
  assert.strictEqual(selection.call(function(selection) { result = selection; }), selection);
  assert.strictEqual(result, selection);
});

it("selection.call(function, arguments…) calls the specified function, passing the additional arguments", () => {
  const result = [],
      foo = {},
      bar = {},
      document = jsdom(),
      selection = d3.select(document);
  assert.strictEqual(selection.call(function(selection, a, b) { result.push(selection, a, b); }, foo, bar), selection);
  assert.deepStrictEqual(result, [selection, foo, bar]);
});
