var tape = require("tape"),
    jsdom = require("../jsdom"),
    d3 = require("../../");

tape("select.selectChild(…) selects the first (matching) child", function(test) {
  var document = jsdom("<h1><span>hello</span>, <span>world<span>!</span></span></h1>");
  var sel = d3.select(document).select("h1");
  test.ok(sel.selectChild(() => true) instanceof d3.selection);
  test.deepEqual(sel.selectChild(() => true), sel.select("*"));
  test.ok(sel.selectChild() instanceof d3.selection);
  test.ok(sel.selectChild("*") instanceof d3.selection);
  test.deepEqual(sel.selectChild("*"), sel.select("*"));
  test.deepEqual(sel.selectChild(), sel.select("*"));
  test.deepEqual(sel.selectChild("div"), sel.select("div"));
  test.equal(sel.selectChild("span").text(), "hello");
  test.end();
});

tape("selectAll.selectChild(…) selects the first (matching) child", function(test) {
  var document = jsdom(`
    <div><span>hello</span>, <span>world<span>!</span></span></div>
    <div><span>hello2</span>, <span>world2<span>!2</span></span></div>
  `);
  var sel = d3.select(document).selectAll("div");
  test.ok(sel.selectChild(() => true) instanceof d3.selection);
  test.deepEqual(sel.selectChild(() => true), sel.select("*"));
  test.ok(sel.selectChild() instanceof d3.selection);
  test.ok(sel.selectChild("*") instanceof d3.selection);
  test.deepEqual(sel.selectChild("*"), sel.select("*"));
  test.deepEqual(sel.selectChild(), sel.select("*"));
  test.deepEqual(sel.selectChild("div"), sel.select("div"));
  test.equal(sel.selectChild("span").text(), "hello");
  test.end();
});


tape("select.selectChildren(…) selects the matching children", function(test) {
  var document = jsdom("<h1><span>hello</span>, <span>world<span>!</span></span></h1>");
  var sel = d3.select(document).select("h1");
  test.ok(sel.selectChildren("*") instanceof d3.selection);
  test.equal(sel.selectChildren("*").text(), "hello");
  test.equal(sel.selectChildren().size(), 2);
  test.equal(sel.selectChildren("*").size(), 2);
  test.deepEqual(sel.selectChildren(), sel.selectChildren("*"));
  test.equal(sel.selectChildren("span").size(), 2);
  test.equal(sel.selectChildren("div").size(), 0);
  test.end();
});

tape("selectAll.selectChildren(…) selects the matching children", function(test) {
  var document = jsdom(`
    <div><span>hello</span>, <span>world<span>!</span></span></div>
    <div><span>hello2</span>, <span>world2<span>!2</span></span></div>
  `);
  var sel = d3.select(document).selectAll("div");
  test.ok(sel.selectChildren("*") instanceof d3.selection);
  test.equal(sel.selectChildren("*").text(), "hello");
  test.equal(sel.selectChildren().size(), 4);
  test.equal(sel.selectChildren("*").size(), 4);
  test.deepEqual(sel.selectChildren(), sel.selectChildren("*"));
  test.equal(sel.selectChildren("span").size(), 4);
  test.equal(sel.selectChildren("div").size(), 0);
  test.end();
});

