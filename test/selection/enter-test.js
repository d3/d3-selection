var tape = require("tape"),
    jsdom = require("jsdom"),
    d3 = require("../../");

tape("selection.enter() returns an empty selection before a data-join", function(test) {
  var body = jsdom.jsdom("<h1>hello</h1>").body,
      selection = d3.select(body);
  test.deepEqual(selection.enter(), {_nodes: [[]], _parents: [null], _update: selection});
  test.end();
});

tape("selection.enter() shares the update selection’s parents", function(test) {
  var body = jsdom.jsdom("<h1>hello</h1>").body,
      selection = d3.select(body);
  test.equal(selection.enter()._parents, selection._parents);
  test.end();
});

tape("selection.enter() returns a new selection each time", function(test) {
  var body = jsdom.jsdom("<h1>hello</h1>").body,
      selection = d3.select(body);
  test.ok(selection.enter() !== selection.enter());
  test.ok(selection.enter()._nodes[0] !== selection.enter()._nodes[0]);
  test.end();
});

tape("selection.enter() contains unbound data after a data-join", function(test) {
  var body = jsdom.jsdom("<div id='one'></div><div id='two'></div>").body,
      one = body.querySelector("#one"),
      two = body.querySelector("#two"),
      selection = d3.select(body).selectAll("div").data(["foo", "bar", "baz"]);
  test.deepEqual(selection.enter(), {
    _nodes: [[,, {
      __data__: "baz",
      _next: null,
      _parent: body,
      namespaceURI: "http://www.w3.org/1999/xhtml",
      ownerDocument: body.ownerDocument
    }]],
    _parents: [body],
    _update: selection
  });
  test.end();
});

tape("selection.enter() clears the enter selection associated with the given selection", function(test) {
  var body = jsdom.jsdom("<h1>hello</h1>").body,
      selection = d3.select(body).data(["foo"]);
  test.ok(selection._enter != null);
  selection.enter();
  test.ok(selection._enter == null);
  test.end();
});

tape("selection.enter() uses the order of the data", function(test) {
  var body = jsdom.jsdom("<div id='one'></div><div id='two'></div><div id='three'></div>").body,
      one = body.querySelector("#one"),
      two = body.querySelector("#two"),
      three = body.querySelector("#three"),
      selection = d3.select(body).selectAll("div").data(["one", "four", "three", "five"], function(d) { return d || this.id; });
  test.deepEqual(selection.enter(), {
    _nodes: [[, {
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
    _parents: [body],
    _update: selection
  });
  test.end();
});

tape("enter.select(…) copies entering nodes into the update selection", function(test) {
  var document = jsdom.jsdom(),
      body = document.body,
      data = ["foo", "bar", "baz"],
      selection = d3.select(body).selectAll("p").data(data);
  test.deepEqual(selection._nodes, [[,,]]);
  var enter = selection.enter(),
      append = enter.select(function() { return this.appendChild(document.createElement("P")); }),
      p = body.querySelectorAll("p");
  test.equal(p.length, data.length);
  test.ok(Array.prototype.every.call(p, function(element) { return element.tagName === "P"; }));
  test.deepEqual(enter._nodes, [data.map(function(d) { return {__data__: d, _next: null, _parent: body, namespaceURI: "http://www.w3.org/1999/xhtml", ownerDocument: body.ownerDocument}; })]);
  test.deepEqual(append._nodes, [p]);
  test.deepEqual(selection._nodes, [p]);
  test.end();
});

tape("enter.append(…) inherits the namespaceURI from the parent", function(test) {
  var body = d3.select(jsdom.jsdom().body),
      svg = body.append("svg"),
      g = svg.selectAll("g").data(["foo"]).enter().append("g");
  test.equal(body.node().namespaceURI, "http://www.w3.org/1999/xhtml");
  test.equal(svg.node().namespaceURI, "http://www.w3.org/2000/svg");
  test.equal(g.node().namespaceURI, "http://www.w3.org/2000/svg");
  test.end();
});

tape("enter.append(…) does not override an explicit namespace", function(test) {
  var body = d3.select(jsdom.jsdom().body),
      svg = body.append("svg"),
      g = svg.selectAll("g").data(["foo"]).enter().append("xhtml:g");
  test.equal(body.node().namespaceURI, "http://www.w3.org/1999/xhtml");
  test.equal(svg.node().namespaceURI, "http://www.w3.org/2000/svg");
  test.equal(g.node().namespaceURI, "http://www.w3.org/1999/xhtml");
  test.end();
});

tape("enter.append(…) inserts entering nodes before the next node in the update selection", function(test) {
  var document = jsdom.jsdom(),
      p = d3.select(document.body).selectAll("p"),
      identity = function(d) { return d; };
  p.data([1, 3], identity).enter().append("p").text(identity);
  p.data([0, 1, 2, 3, 4], identity).enter().append("p").text(identity);
  test.equal(document.body.innerHTML, "<p>0</p><p>1</p><p>2</p><p>3</p><p>4</p>");
  test.end();
});

tape("enter.append(…, before) inserts entering nodes before the sibling matching the specified selector", function(test) {
  var document = jsdom.jsdom("<hr>"),
      p = d3.select(document.body).selectAll("p"),
      identity = function(d) { return d; };
  p.data([1, 3], identity).enter().append("p", "hr").text(identity);
  p.data([0, 1, 2, 3, 4], identity).enter().append("p", "hr").text(identity);
  test.equal(document.body.innerHTML, "<p>1</p><p>3</p><p>0</p><p>2</p><p>4</p><hr>");
  test.end();
});

tape("enter.append(…, null) inserts entering nodes after the last child", function(test) {
  var document = jsdom.jsdom(),
      p = d3.select(document.body).selectAll("p"),
      identity = function(d) { return d; };
  p.data([1, 3], identity).enter().append("p", null).text(identity);
  p.data([0, 1, 2, 3, 4], identity).enter().append("p", null).text(identity);
  test.equal(document.body.innerHTML, "<p>1</p><p>3</p><p>0</p><p>2</p><p>4</p>");
  test.end();
});
