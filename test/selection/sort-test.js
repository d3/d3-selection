import assert from "assert";
import * as d3 from "../../src/index.js";
import it from "../jsdom.js";
it("selection.sort(…) returns a new selection, sorting each group’s data, and then ordering the elements to match", () => {
  const document = jsdom("<h1 id='one' data-value='1'></h1><h1 id='two' data-value='0'></h1><h1 id='three' data-value='2'></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      three = document.querySelector("#three"),
      selection0 = d3.selectAll([two, three, one]).datum(function() { return +this.getAttribute("data-value"); }),
      selection1 = selection0.sort(function(a, b) { return a - b; });
  assert.deepStrictEqual(selection0, {_groups: [[two, three, one]], _parents: [null]});
  assert.deepStrictEqual(selection1, {_groups: [[two, one, three]], _parents: [null]});
  assert.strictEqual(two.nextSibling, one);
  assert.strictEqual(one.nextSibling, three);
  assert.strictEqual(three.nextSibling, null);
});

it("selection.sort(…) sorts each group separately", () => {
  const document = jsdom("<div id='one'><h1 id='three' data-value='1'></h1><h1 id='four' data-value='0'></h1></div><div id='two'><h1 id='five' data-value='3'></h1><h1 id='six' data-value='-1'></h1></div>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      three = document.querySelector("#three"),
      four = document.querySelector("#four"),
      five = document.querySelector("#five"),
      six = document.querySelector("#six"),
      selection = d3.selectAll([one, two]).selectAll("h1").datum(function() { return +this.getAttribute("data-value"); });
  assert.deepStrictEqual(selection.sort(function(a, b) { return a - b; }), {_groups: [[four, three], [six, five]], _parents: [one, two]});
  assert.strictEqual(four.nextSibling, three);
  assert.strictEqual(three.nextSibling, null);
  assert.strictEqual(six.nextSibling, five);
  assert.strictEqual(five.nextSibling, null);
});

it("selection.sort() uses natural ascending order", () => {
  const document = jsdom("<h1 id='one'></h1><h1 id='two'></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      selection = d3.selectAll([two, one]).datum(function(d, i) { i; });
  assert.deepStrictEqual(selection.sort(), {_groups: [[two, one]], _parents: [null]});
  assert.strictEqual(one.nextSibling, null);
  assert.strictEqual(two.nextSibling, one);
});

it("selection.sort() puts missing elements at the end of each group", () => {
  const document = jsdom("<h1 id='one'></h1><h1 id='two'></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      selection = d3.selectAll([two, one]).datum(function(d, i) { return i; });
  assert.deepStrictEqual(d3.selectAll([, one,, two]).sort(), {_groups: [[two, one,,]], _parents: [null]});
  assert.strictEqual(two.nextSibling, one);
  assert.strictEqual(one.nextSibling, null);
});

it("selection.sort(function) puts missing elements at the end of each group", () => {
  const document = jsdom("<h1 id='one'></h1><h1 id='two'></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      selection = d3.selectAll([two, one]).datum(function(d, i) { return i; });
  assert.deepStrictEqual(d3.selectAll([, one,, two]).sort(function(a, b) { return b - a; }), {_groups: [[one, two,,]], _parents: [null]});
  assert.strictEqual(one.nextSibling, two);
  assert.strictEqual(two.nextSibling, null);
});

it("selection.sort(function) uses the specified data comparator function", () => {
  const document = jsdom("<h1 id='one'></h1><h1 id='two'></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      selection = d3.selectAll([two, one]).datum(function(d, i) { return i; });
  assert.deepStrictEqual(selection.sort(function(a, b) { return b - a; }), {_groups: [[one, two]], _parents: [null]});
  assert.strictEqual(one.nextSibling, two);
  assert.strictEqual(two.nextSibling, null);
});

it("selection.sort(function) returns a new selection, and does not modify the groups array in-place", () => {
  const document = jsdom("<h1 id='one'></h1><h1 id='two'></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      selection0 = d3.selectAll([one, two]).datum(function(d, i) { return i; }),
      selection1 = selection0.sort(function(a, b) { return b - a; }),
      selection2 = selection1.sort();
  assert.deepStrictEqual(selection0, {_groups: [[one, two]], _parents: [null]});
  assert.deepStrictEqual(selection1, {_groups: [[two, one]], _parents: [null]});
  assert.deepStrictEqual(selection2, {_groups: [[one, two]], _parents: [null]});
});
