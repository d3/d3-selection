var tape = require("tape"),
    jsdom = require("jsdom"),
    d3 = require("../build/d3");

tape("d3.selectAll can select by string", function(test) {
  var document = global.document = jsdom.jsdom(),
      s = d3.selectAll("body");
  test.ok(s instanceof d3.selection);
  test.equal(s._depth, 1);
  test.ok(s._root instanceof document.defaultView.NodeList);
  test.equal(s._root.length, 1);
  test.equal(s._root[0], document.body);
  test.equal(s._root._parent, undefined);
  test.equal(s._enter, null);
  test.equal(s._exit, null);
  test.end();
  delete global.document;
});

tape("d3.selectAll can select an array of elements", function(test) {
  var document = jsdom.jsdom("<h1>hello</h1><h2>world</h2>"),
      h1 = document.querySelector("h1"),
      h2 = document.querySelector("h2"),
      s = d3.selectAll([h1, h2]);
  test.ok(s instanceof d3.selection);
  test.equal(s._depth, 1);
  test.ok(Array.isArray(s._root));
  test.equal(s._root.length, 2);
  test.equal(s._root[0], h1);
  test.equal(s._root[1], h2);
  test.equal(s._root._parent, undefined);
  test.equal(s._enter, null);
  test.equal(s._exit, null);
  test.end();
});

tape("d3.selectAll can select a NodeList of elements", function(test) {
  var document = jsdom.jsdom("<h1>hello</h1><h2>world</h2>"),
      h1 = document.querySelector("h1"),
      h2 = document.querySelector("h2"),
      s = d3.selectAll(document.querySelectorAll("h1,h2"));
  test.ok(s instanceof d3.selection);
  test.equal(s._depth, 1);
  test.ok(s._root instanceof document.defaultView.NodeList);
  test.equal(s._root.length, 2);
  test.equal(s._root[0], h1);
  test.equal(s._root[1], h2);
  test.equal(s._root._parent, undefined);
  test.equal(s._enter, null);
  test.equal(s._exit, null);
  test.end();
});

tape("d3.selectAll can select an empty array", function(test) {
  var document = jsdom.jsdom("<h1>hello</h1><h2>world</h2>"),
      s = d3.selectAll([]);
  test.ok(s instanceof d3.selection);
  test.equal(s._depth, 1);
  test.ok(Array.isArray(s._root));
  test.equal(s._root.length, 0);
  test.equal(s._root._parent, undefined);
  test.equal(s._enter, null);
  test.equal(s._exit, null);
  test.end();
});

tape("d3.selectAll can select an array that contains null", function(test) {
  var document = jsdom.jsdom("<h1>hello</h1><h2>world</h2>"),
      h1 = document.querySelector("h1"),
      s = d3.selectAll([null, h1, null]);
  test.ok(s instanceof d3.selection);
  test.equal(s._depth, 1);
  test.ok(Array.isArray(s._root));
  test.equal(s._root.length, 3);
  test.equal(s._root[0], null);
  test.equal(s._root[1], h1);
  test.equal(s._root[2], null);
  test.equal(s._root._parent, undefined);
  test.equal(s._enter, null);
  test.equal(s._exit, null);
  test.end();
});

tape("d3.selectAll can select an array that contains arbitrary objects", function(test) {
  var object = {},
      s = d3.selectAll([object]);
  test.ok(s instanceof d3.selection);
  test.equal(s._depth, 1);
  test.ok(Array.isArray(s._root));
  test.equal(s._root.length, 1);
  test.equal(s._root[0], object);
  test.equal(s._root._parent, undefined);
  test.equal(s._enter, null);
  test.equal(s._exit, null);
  test.end();
});
