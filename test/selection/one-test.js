import assert from "assert";
import {select, one} from "../../src/index.js";
import it from "../jsdom.js";

it("selection.one(name) manages a single element", "<div id='container'></div>", () => {
  const container = document.querySelector("#container");
  const s = select(container);
  const div = one(s, "div");
  assert.strictEqual(div._groups[0][0].tagName, "DIV");
});

it("selection.one(name, class) elements by class", "<div id='container'></div>", () => {
  const container = document.querySelector("#container");
  const s = select(container);
  const a = one(s, "div", "a");
  const b = one(s, "div", "b");
  assert.strictEqual(a._groups[0][0].tagName, "DIV");
  assert.strictEqual(a._groups[0][0].className, "a");
  assert.strictEqual(b._groups[0][0].tagName, "DIV");
  assert.strictEqual(b._groups[0][0].className, "b");
});

