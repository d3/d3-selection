var tape = require("tape"),
    jsdom = require("jsdom"),
    d3 = require("../../");

tape("selection.text returns text of the first element if no arguments are given", function(test) {
  var document = jsdom.jsdom("<h1>first</h1><h1>second</h1>"),
      h = d3.select(document.body).selectAll("h1");
  test.equal(h.text(), "first");
  test.end();
});

tape("selection.text can take constant string argument", function(test) {
  var document = jsdom.jsdom("<h1>not set</h1>"),
      h = d3.select(document.body).select("h1");
  test.equal(h.text(), "not set");
  h.text("constant set");
  var hNodeAfter = document.querySelector("h1");
  test.equal(hNodeAfter.textContent, "constant set");
  test.end();
});

tape("selection.text can take a function argument and sets text according to return of function", function(test) {
  var document = jsdom.jsdom("<h1>not set</h1><h1>not set</h1>"),
      h = d3.select(document.body).selectAll("h1").data([1, 3]);
  h.text(function(d) { return d; });
  var hNodesAfter = document.querySelectorAll("h1");
  test.equal(hNodesAfter[0].textContent, "1");
  test.equal(hNodesAfter[1].textContent, "3");
  test.end();
});
