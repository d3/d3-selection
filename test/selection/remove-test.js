import assert from "node:assert";
import {select, selectAll} from "d3-selection";
import {it} from "vitest";

it("selection.remove() removes selected elements from their parent", () => {
  document.documentElement.innerHTML = "<h1 id='one'></h1><h1 id='two'></h1>";
  const one = document.querySelector("#one");
  const two = document.querySelector("#two");
  const s = selectAll([two, one]);
  assert.strictEqual(s.remove(), s);
  assert.strictEqual(one.parentNode, null);
  assert.strictEqual(two.parentNode, null);
});

it("selection.remove() skips elements that have already been detached", () => {
  document.documentElement.innerHTML = "<h1 id='one'></h1><h1 id='two'></h1>";
  const one = document.querySelector("#one");
  const two = document.querySelector("#two");
  const s = selectAll([two, one]);
  one.parentNode.removeChild(one);
  assert.strictEqual(s.remove(), s);
  assert.strictEqual(one.parentNode, null);
  assert.strictEqual(two.parentNode, null);
});

it("selection.remove() skips missing elements", () => {
  document.documentElement.innerHTML = "<h1 id='one'></h1><h1 id='two'></h1>";
  const one = document.querySelector("#one");
  const two = document.querySelector("#two");
  const s = selectAll([, one]);
  assert.strictEqual(s.remove(), s);
  assert.strictEqual(one.parentNode, null);
  assert.strictEqual(two.parentNode, document.body);
});

it("selectChildren().remove() removes all children", () => {
  document.documentElement.innerHTML = "<div><span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span></div>";
  const p = document.querySelector("div");
  const selection = select(p).selectChildren();
  assert.strictEqual(selection.size(), 10);
  assert.strictEqual(selection.remove(), selection);
  assert.strictEqual(select(p).selectChildren().size(), 0);
});
