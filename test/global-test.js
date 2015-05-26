var tape = require("tape"),
    jsdom = require("jsdom"),
    d3 = require("../");

tape("d3.selectAll can select by string", function(test) {
  var document = global.document = jsdom.jsdom(),
      s = d3.selectAll("body");
  test.ok(s instanceof d3.selection);
  test.equal(s._depth, 1);
  test.ok(s._root instanceof document.defaultView.NodeList);
  test.equal(s._root.length, 1);
  test.equal(s._root[0], document.body);
  test.equal(s._root._parent, document.documentElement);
  test.equal(s._enter, null);
  test.equal(s._exit, null);
  test.end();
  delete global.document;
});

tape("d3.select can select by string", function(test) {
  var document = global.document = jsdom.jsdom(),
      s = d3.select("body");
  test.ok(s instanceof d3.selection);
  test.equal(s._depth, 1);
  test.ok(Array.isArray(s._root));
  test.equal(s._root.length, 1);
  test.equal(s._root[0], document.body);
  test.equal(s._root._parent, document.documentElement);
  test.equal(s._enter, null);
  test.equal(s._exit, null);
  test.end();
  delete global.document;
});
