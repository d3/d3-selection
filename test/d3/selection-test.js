var tape = require("tape"),
    jsdom = require("jsdom"),
    selection = require("../../lib/d3/selection");

tape("can select an element", function(test) {
  var document = jsdom.jsdom("<h1>hello</h1>"),
      s = selection.select(document.documentElement);
  test.ok(s instanceof selection, "returns an instanceof selection");
  test.equal(s.size(), 1, "the selection contains a single element");
  test.equal(s.node(), document.documentElement, "that element is the expected element");
  test.end();
});

tape("can subselect a child element", function(test) {
  var document = jsdom.jsdom("<h1>hello</h1>"),
      s = selection.select(document.documentElement).select("h1");
  test.ok(s instanceof selection, "returns an instanceof selection");
  test.equal(s.size(), 1, "the selection contains a single element");
  test.equal(s.node(), document.querySelector("h1"), "that element is the expected element");
  test.end();
});

tape("the enter selection is initially empty", function(test) {
  var document = jsdom.jsdom("<h1>hello</h1>"),
      s = selection.select(document.documentElement).selectAll("h1"),
      e = s.enter();
  test.ok(e instanceof selection, "returns an instanceof selection");
  test.equal(e.size(), 0, "the enter selection is empty");
  test.equal(e, s.enter(), "the enter selection is sticky");
  test.end();
});

tape("the exit selection is initially empty", function(test) {
  var document = jsdom.jsdom("<h1>hello</h1>"),
      s = selection.select(document.documentElement).selectAll("h1"),
      e = s.exit();
  test.ok(e instanceof selection, "returns an instanceof selection");
  test.equal(e.size(), 0, "the exit selection is empty");
  test.equal(e, s.exit(), "the exit selection is sticky");
  test.end();
});
