var tape = require("tape"),
    jsdom = require("jsdom"),
    d3 = require("../");

tape("selection.on registers a listener which receives events", function(test) {
  var document = jsdom.jsdom(),
      clicks = 0,
      s = d3.select(document.body).on("click", function() { ++clicks; });
  s.dispatch("click");
  test.equal(clicks, 1);
  test.end();
});

tape("selection.on passes the listener function data and index", function(test) {
  var document = jsdom.jsdom("<parent id='one'><child><span><b>1</b></span></child></parent><parent id='two'><child><span><b>2</b></span></child></parent>"),
      results = [],
      parent = d3.selectAll(document.querySelectorAll("parent")),
      child = parent.selectAll("child"),
      s = child.on("foo", function() { results.push({this: this, arguments: [].slice.call(arguments)}); });
  test.equal(results.length, 0);
  parent.datum(function(d, i) { return "parent-" + i; });
  child.datum(function(d, i, p, j) { return "child-" + i + "-" + j; });
  s.dispatch("foo");
  test.equal(document.querySelector("#one").__data__, "parent-0");
  test.equal(document.querySelector("#two").__data__, "parent-1");
  test.equal(results.length, 2);
  test.equal(results[0].this, document.querySelector("#one child"));
  test.equal(results[1].this, document.querySelector("#two child"));
  test.equal(results[0].arguments.length, 4);
  test.equal(results[0].arguments[0], "child-0-0");
  test.equal(results[0].arguments[1], 0);
  test.equal(results[0].arguments[2], "parent-0");
  test.equal(results[0].arguments[3], 0);
  test.equal(results[1].arguments[0], "child-0-1");
  test.equal(results[1].arguments[1], 0);
  test.equal(results[1].arguments[2], "parent-1");
  test.equal(results[1].arguments[3], 1);
  test.end();
});
