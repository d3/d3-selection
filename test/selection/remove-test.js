import assert from "assert";
import {selectAll} from "../../src/index.js";
import it from "../jsdom.js";

it("selection.remove() removes selected elements from their parent", "<h1 id='one'></h1><h1 id='two'></h1>", () => {
  const one = document.querySelector("#one");
  const two = document.querySelector("#two");
  const s = selectAll([two, one]);
  assert.strictEqual(s.remove(), s);
  assert.strictEqual(one.parentNode, null);
  assert.strictEqual(two.parentNode, null);
});

it("selection.remove() skips elements that have already been detached", "<h1 id='one'></h1><h1 id='two'></h1>", () => {
  const one = document.querySelector("#one");
  const two = document.querySelector("#two");
  const s = selectAll([two, one]);
  one.parentNode.removeChild(one);
  assert.strictEqual(s.remove(), s);
  assert.strictEqual(one.parentNode, null);
  assert.strictEqual(two.parentNode, null);
});

it("selection.remove() skips missing elements", "<h1 id='one'></h1><h1 id='two'></h1>", () => {
  const one = document.querySelector("#one");
  const two = document.querySelector("#two");
  const s = selectAll([, one]);
  assert.strictEqual(s.remove(), s);
  assert.strictEqual(one.parentNode, null);
  assert.strictEqual(two.parentNode, document.body);
});
