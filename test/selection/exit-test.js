var tape = require("tape"),
    jsdom = require("jsdom"),
    d3 = require("../../");

tape("selection.exit() returns an empty selection before a data-join", function(test) {
  var body = jsdom.jsdom("<h1>hello</h1>").body,
      selection = d3.select(body);
  test.deepEqual(selection.exit(), {_nodes: [[]], _parents: [null]});
  test.end();
});

tape("selection.exit() shares the update selection’s parents", function(test) {
  var body = jsdom.jsdom("<h1>hello</h1>").body,
      selection = d3.select(body);
  test.equal(selection.exit()._parents, selection._parents);
  test.end();
});

tape("selection.exit() returns a new selection each time", function(test) {
  var body = jsdom.jsdom("<h1>hello</h1>").body,
      selection = d3.select(body);
  test.ok(selection.exit() !== selection.exit());
  test.ok(selection.exit()._nodes[0] !== selection.exit()._nodes[0]);
  test.end();
});

tape("selection.exit() contains unbound elements after a data-join", function(test) {
  var body = jsdom.jsdom("<div id='one'></div><div id='two'></div>").body,
      one = body.querySelector("#one"),
      two = body.querySelector("#two"),
      selection = d3.select(body).selectAll("div").data(["foo"]);
  test.deepEqual(selection.exit(), {
    _nodes: [[, two]],
    _parents: [body]
  });
  test.end();
});

tape("selection.exit() uses the order of the originating selection", function(test) {
  var body = jsdom.jsdom("<div id='one'></div><div id='two'></div><div id='three'></div>").body,
      one = body.querySelector("#one"),
      two = body.querySelector("#two"),
      three = body.querySelector("#three"),
      selection = d3.select(body).selectAll("div").data(["three", "one"], function(d) { return d || this.id; });
  test.deepEqual(selection.exit(), {
    _nodes: [[, two, ]],
    _parents: [body]
  });
  test.end();
});

tape("selection.exit() clears the exit selection associated with the given selection", function(test) {
  var body = jsdom.jsdom("<h1>hello</h1>").body,
      selection = d3.select(body).data(["foo"]);
  test.ok(selection._exit != null);
  selection.exit();
  test.ok(selection._exit == null);
  test.end();
});
