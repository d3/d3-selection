var tape = require("tape"),
    jsdom = require("jsdom"),
    d3 = require("../");

tape("selection.classed returns true iff the first element has the specified class", function(test) {
  var document = jsdom.jsdom("<h1 class=\"c1 c2\">hello</h1>"),
      s = d3.select(document.body),
      h = s.select("h1");
  test.equal(h.classed("c1"), true);
  test.equal(h.classed("c2"), true);
  test.equal(h.classed("c3"), false);
  test.end();
});
