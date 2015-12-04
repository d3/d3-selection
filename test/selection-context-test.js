var tape = require("tape"),
    jsdom = require("jsdom"),
    d3 = require("../build/d3");

tape("selection.context can capture the context of selection.each", function(test) {
  var document = jsdom.jsdom("<table><tr><td>Hello</td></tr></table>"),
      context,
      results = [],
      table = document.querySelector("table"),
      tr = document.querySelector("tr"),
      td = document.querySelector("td"),
      s = d3.select(document.body).selectAll("table").selectAll("tr").selectAll("td").datum("foo");

  s.each(function(d, i) {
    context = s.context(arguments);
    test.equal(d, "foo", "Doesn’t modify passed arguments.");
  });

  // Set data after creating the context to verify data is lazily accessed.
  d3.select(document.body)
      .datum("body")
    .selectAll("table")
      .datum("table")
    .selectAll("tr")
      .datum("tr")
    .selectAll("td")
      .datum("td");

  context(function() { results.push({this: this, arguments: arguments}); });
  test.equal(results.length, 1);
  test.equal(results[0].this, td);
  test.equal(results[0].arguments.length, 8);
  test.equal(results[0].arguments[0], "td");
  test.equal(results[0].arguments[1], 0);
  test.equal(results[0].arguments[2], "tr");
  test.equal(results[0].arguments[3], 0);
  test.equal(results[0].arguments[4], "table");
  test.equal(results[0].arguments[5], 0);
  test.equal(results[0].arguments[6], "body");
  test.equal(results[0].arguments[7], 0);
  test.end();
});

tape("selection.context can capture the context of selection.data", function(test) {
  var document = jsdom.jsdom("<table><tr><td>Hello</td></tr></table>"),
      context,
      results = [],
      table = document.querySelector("table"),
      tr = document.querySelector("tr"),
      td = document.querySelector("td"),
      s = d3.select(document.body).selectAll("table").selectAll("tr").selectAll("td");

  s.data(function() {
    context = s.context(arguments);
    return [42];
  });

  // Set data after creating the context to verify data is lazily accessed.
  d3.select(document.body)
      .datum("body")
    .selectAll("table")
      .datum("table")
    .selectAll("tr")
      .datum("tr");

  context(function() { results.push({this: this, arguments: arguments}); });
  test.equal(results.length, 1);
  test.equal(results[0].this, tr);
  test.equal(results[0].arguments.length, 6);
  test.equal(results[0].arguments[0], "tr");
  test.equal(results[0].arguments[1], 0);
  test.equal(results[0].arguments[2], "table");
  test.equal(results[0].arguments[3], 0);
  test.equal(results[0].arguments[4], "body");
  test.equal(results[0].arguments[5], 0);
  test.end();
});
