import assert from "assert";
import * as d3 from "../../src/index.js";
import jsdom from "../jsdom.js";
it("selection.dispatch(type) dispatches a custom event of the specified type to each selected element in order", () => {
  let event;
  const result = [],
      document = jsdom("<h1 id='one'></h1><h1 id='two'></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      selection = d3.selectAll([one, two]).datum(function(d, i) { return "node-" + i; }).on("bang", function(e, d) { event = e; result.push(this, d); });
  assert.strictEqual(selection.dispatch("bang"), selection);
  assert.deepStrictEqual(result, [one, "node-0", two, "node-1"]);
  assert.strictEqual(event.type, "bang");
  assert.strictEqual(event.bubbles, false);
  assert.strictEqual(event.cancelable, false);
  assert.strictEqual(event.detail, null);
});

it("selection.dispatch(type, params) dispatches a custom event with the specified constant parameters", () => {
  let event;
  const result = [],
      document = jsdom("<h1 id='one'></h1><h1 id='two'></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      selection = d3.selectAll([one, two]).datum(function(d, i) { return "node-" + i; }).on("bang", function(e, d) { event = e; result.push(this, d); });
  assert.strictEqual(selection.dispatch("bang", {bubbles: true, cancelable: true, detail: "loud"}), selection);
  assert.deepStrictEqual(result, [one, "node-0", two, "node-1"]);
  assert.strictEqual(event.type, "bang");
  assert.strictEqual(event.bubbles, true);
  assert.strictEqual(event.cancelable, true);
  assert.strictEqual(event.detail, "loud");
});

it("selection.dispatch(type, function) dispatches a custom event with the specified parameter function", () => {
  const result = [],
      events = [],
      document = jsdom("<h1 id='one'></h1><h1 id='two'></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      selection = d3.selectAll([one, two]).datum(function(d, i) { return "node-" + i; }).on("bang", function(e, d) { events.push(e); result.push(this, d); });
  assert.strictEqual(selection.dispatch("bang", function(d, i) { return {bubbles: true, cancelable: true, detail: "loud-" + i}; }), selection);
  assert.deepStrictEqual(result, [one, "node-0", two, "node-1"]);
  assert.strictEqual(events[0].type, "bang");
  assert.strictEqual(events[0].bubbles, true);
  assert.strictEqual(events[0].cancelable, true);
  assert.strictEqual(events[0].detail, "loud-0");
  assert.strictEqual(events[1].type, "bang");
  assert.strictEqual(events[1].bubbles, true);
  assert.strictEqual(events[1].cancelable, true);
  assert.strictEqual(events[1].detail, "loud-1");
});

it("selection.dispatch(type) skips missing elements", () => {
  let event;
  const result = [],
      document = jsdom("<h1 id='one'></h1><h1 id='two'></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      selection = d3.selectAll([, one,, two]).datum(function(d, i) { return "node-" + i; }).on("bang", function(e, d) { event = e; result.push(this, d); });
  assert.strictEqual(selection.dispatch("bang"), selection);
  assert.deepStrictEqual(result, [one, "node-1", two, "node-3"]);
  assert.strictEqual(event.type, "bang");
  assert.strictEqual(event.detail, null);
});
