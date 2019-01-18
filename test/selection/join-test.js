var tape = require("tape"),
    jsdom = require("../jsdom"),
    d3 = require("../../");

tape("selection.join(name) enter-appends elements", function(test) {
  var document = jsdom(),
      p = d3.select(document.body).selectAll("p");
  p = p.data([1, 3]).join("p").text(d => d);
  test.equal(document.body.innerHTML, "<p>1</p><p>3</p>");
  test.end();
});

tape("selection.join(name) exit-removes elements", function(test) {
  var document = jsdom("<p>1</p><p>2</p><p>3</p>"),
      p = d3.select(document.body).selectAll("p");
  p = p.data([1, 3]).join("p").text(d => d);
  test.equal(document.body.innerHTML, "<p>1</p><p>3</p>");
  test.end();
});

tape("selection.join(enter, update, exit) calls the specified functions", function(test) {
  var document = jsdom("<p>1</p><p>2</p>"),
      p = d3.select(document.body).selectAll("p").datum(function() { return this.textContent; });
  p = p.data([1, 3], d => d).join(
    enter => enter.append("p").attr("class", "enter").text(d => d),
    update => update.attr("class", "update"),
    exit => exit.attr("class", "exit")
  );
  test.equal(document.body.innerHTML, "<p class=\"update\">1</p><p class=\"exit\">2</p><p class=\"enter\">3</p>");
  test.end();
});

tape("selection.join(…) reorders nodes to match the data", function(test) {
  var document = jsdom(),
      p = d3.select(document.body).selectAll("p");
  p = p.data([1, 3], d => d).join(enter => enter.append("p").text(d => d));
  test.equal(document.body.innerHTML, "<p>1</p><p>3</p>");
  p = p.data([0, 3, 1, 2, 4], d => d).join(enter => enter.append("p").text(d => d));
  test.equal(document.body.innerHTML, "<p>0</p><p>3</p><p>1</p><p>2</p><p>4</p>");
  test.end();
});
