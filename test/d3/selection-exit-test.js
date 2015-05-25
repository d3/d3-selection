var tape = require("tape"),
    jsdom = require("jsdom"),
    selection = require("../../lib/d3/selection");

tape("selection.exit initially returns an empty selection", function(test) {
  var document = jsdom.jsdom("<h1>hello</h1>"),
      s = selection.select(document.documentElement),
      e = s.exit();
  test.ok(e instanceof selection);
  test.equal(e._depth, 1);
  test.ok(Array.isArray(e._root));
  test.equal(e._root.length, 1);
  test.ok(!(0 in e._root));
  test.equal(e._root._parent, null);
  test.equal(e._enter, null);
  test.equal(e._exit, null);
  test.equal(s._root._exit, e._root);
  test.end();
});
