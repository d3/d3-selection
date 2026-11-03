import assert from "node:assert";
import {matcher} from "d3-selection";
import {it} from "vitest";

it("matcher(selector).call(element) returns true if the element matches the selector", () => {
  document.documentElement.innerHTML = "<body class='foo'>";
  assert.strictEqual(matcher("body").call(document.body), true);
  assert.strictEqual(matcher(".foo").call(document.body), true);
  assert.strictEqual(matcher("body.foo").call(document.body), true);
  assert.strictEqual(matcher("h1").call(document.body), false);
  assert.strictEqual(matcher("body.bar").call(document.body), false);
});
