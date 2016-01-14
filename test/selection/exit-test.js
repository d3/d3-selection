var tape = require("tape"),
    jsdom = require("jsdom"),
    d3 = require("../../");

tape("selection.exit initially returns an empty selection", function(test) {
  var document = jsdom.jsdom("<h1>hello</h1>"),
      s = d3.select(document.body),
      e = s.exit();
  test.ok(e instanceof d3.selection);
  test.ok(Array.isArray(e._));
  test.equal(e._.length, 1);
  test.ok(Array.isArray(e._[0]));
  test.equal(e._[0].length, 1);
  test.ok(!(0 in e._[0]));
  test.equal(e._[0]._parent, undefined);
  test.equal(e._enter, undefined);
  test.equal(e._exit, undefined);
  test.end();
});
