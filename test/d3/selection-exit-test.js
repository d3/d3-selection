var tape = require("tape"),
    jsdom = require("jsdom"),
    selection = require("../../lib/d3/selection");

tape("selection.exit initially returns an empty selection", function(test) {
  var document = jsdom.jsdom("<h1>hello</h1>"),
      s = selection.select(document.documentElement),
      e = s.exit();
  test.ok(e instanceof selection, "is a selection");
  test.equal(e._depth, 1, "_depth is one");
  test.ok(Array.isArray(e._root), "_root is an array");
  test.equal(e._root.length, 1, "_root has length one");
  test.equal(e._root[0], undefined, "_root[0] is undefined");
  test.equal(e._root._parent, null, "_root._parent is null");
  test.equal(e._enter, null, "_enter is null");
  test.equal(e._exit, null, "_exit is null");
  test.equal(s._root._exit, e._root, "_root is update._root._exit");
  test.end();
});
