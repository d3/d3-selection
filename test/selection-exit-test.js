var tape = require("tape"),
    jsdom = require("jsdom"),
    d3 = require("../");

tape("selection.exit initially returns an empty selection", function(test) {
  var document = jsdom.jsdom("<h1>hello</h1>"),
      s = d3.select(document.body),
      e = s.exit();
  test.ok(e instanceof d3.selection);
  test.equal(e._depth, 1);
  test.ok(Array.isArray(e._root));
  test.equal(e._root.length, 1);
  test.ok(!(0 in e._root));
  test.equal(e._root._parent, undefined);
  test.equal(e._enter, null);
  test.equal(e._exit, null);
  test.end();
});
