import assert from "assert";
import * as d3 from "../../src/index.js";
import jsdom from "../jsdom.js";
it("selection.enter() returns an empty selection before a data-join", () => {
  const body = jsdom("<h1>hello</h1>").body,
      selection = d3.select(body);
  assert.deepStrictEqual(selection.enter(), {_groups: [[]], _parents: [null]});
});

it("selection.enter() contains EnterNodes", () => {
  const body = jsdom().body,
      selection = d3.select(body).selectAll("div").data([1, 2, 3]);
  assert.strictEqual(selection.enter().node()._parent, body);
});

it("selection.enter() shares the update selection’s parents", () => {
  const body = jsdom("<h1>hello</h1>").body,
      selection = d3.select(body);
  assert.strictEqual(selection.enter()._parents, selection._parents);
});

it("selection.enter() returns the same selection each time", () => {
  const body = jsdom("<h1>hello</h1>").body,
      selection = d3.select(body);
  assert.deepStrictEqual(selection.enter(), selection.enter());
});

it("selection.enter() contains unbound data after a data-join", () => {
  const body = jsdom("<div id='one'></div><div id='two'></div>").body,
      one = body.querySelector("#one"),
      two = body.querySelector("#two"),
      selection = d3.select(body).selectAll("div").data(["foo", "bar", "baz"]);
  assert.deepStrictEqual(selection.enter(), {
    _groups: [[,, {
      __data__: "baz",
      _next: null,
      _parent: body,
      namespaceURI: "http://www.w3.org/1999/xhtml",
      ownerDocument: body.ownerDocument
    }]],
    _parents: [body]
  });
});

it("selection.enter() uses the order of the data", () => {
  const body = jsdom("<div id='one'></div><div id='two'></div><div id='three'></div>").body,
      one = body.querySelector("#one"),
      two = body.querySelector("#two"),
      three = body.querySelector("#three"),
      selection = d3.select(body).selectAll("div").data(["one", "four", "three", "five"], function(d) { return d || this.id; });
  assert.deepStrictEqual(selection.enter(), {
    _groups: [[, {
      __data__: "four",
      _next: three,
      _parent: body,
      namespaceURI: "http://www.w3.org/1999/xhtml",
      ownerDocument: body.ownerDocument
    },, {
      __data__: "five",
      _next: null,
      _parent: body,
      namespaceURI: "http://www.w3.org/1999/xhtml",
      ownerDocument: body.ownerDocument
    }]],
    _parents: [body]
  });
});

it("enter.append(…) inherits the namespaceURI from the parent", () => {
  const body = d3.select(jsdom().body),
      svg = body.append("svg"),
      g = svg.selectAll("g").data(["foo"]).enter().append("g");
  assert.strictEqual(body.node().namespaceURI, "http://www.w3.org/1999/xhtml");
  assert.strictEqual(svg.node().namespaceURI, "http://www.w3.org/2000/svg");
  assert.strictEqual(g.node().namespaceURI, "http://www.w3.org/2000/svg");
});

it("enter.append(…) does not override an explicit namespace", () => {
  const body = d3.select(jsdom().body),
      svg = body.append("svg"),
      g = svg.selectAll("g").data(["foo"]).enter().append("xhtml:g");
  assert.strictEqual(body.node().namespaceURI, "http://www.w3.org/1999/xhtml");
  assert.strictEqual(svg.node().namespaceURI, "http://www.w3.org/2000/svg");
  assert.strictEqual(g.node().namespaceURI, "http://www.w3.org/1999/xhtml");
});

it("enter.append(…) inserts entering nodes before the next node in the update selection", () => {
  const document = jsdom(),
      identity = function(d) { return d; };
  let p = d3.select(document.body).selectAll("p");
  p = p.data([1, 3], identity);
  p = p.enter().append("p").text(identity).merge(p);
  p = p.data([0, 1, 2, 3, 4], identity);
  p = p.enter().append("p").text(identity).merge(p);
  assert.strictEqual(document.body.innerHTML, "<p>0</p><p>1</p><p>2</p><p>3</p><p>4</p>");
});

it("enter.insert(…, before) inserts entering nodes before the sibling matching the specified selector", () => {
  const document = jsdom("<hr>"),
      identity = function(d) { return d; };
  let p = d3.select(document.body).selectAll("p");
  p = p.data([1, 3], identity);
  p = p.enter().insert("p", "hr").text(identity).merge(p);
  p = p.data([0, 1, 2, 3, 4], identity);
  p = p.enter().insert("p", "hr").text(identity).merge(p);
  assert.strictEqual(document.body.innerHTML, "<p>1</p><p>3</p><p>0</p><p>2</p><p>4</p><hr>");
});

it("enter.insert(…, null) inserts entering nodes after the last child", () => {
  const document = jsdom(),
      identity = function(d) { return d; };
  let p = d3.select(document.body).selectAll("p");
  p = p.data([1, 3], identity);
  p = p.enter().insert("p", null).text(identity).merge(p);
  p = p.data([0, 1, 2, 3, 4], identity);
  p = p.enter().insert("p", null).text(identity).merge(p);
  assert.strictEqual(document.body.innerHTML, "<p>1</p><p>3</p><p>0</p><p>2</p><p>4</p>");
});
