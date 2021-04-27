import assert from "assert";
import * as d3 from "../../src/index.js";
import jsdom from "../jsdom.js";
it("selection.join(name) enter-appends elements", () => {
  const document = jsdom();
  let p = d3.select(document.body).selectAll("p");
  p = p.data([1, 3]).join("p").text(d => d);
  assert.strictEqual(document.body.innerHTML, "<p>1</p><p>3</p>");
});

it("selection.join(name) exit-removes elements", () => {
  const document = jsdom("<p>1</p><p>2</p><p>3</p>");
  let p = d3.select(document.body).selectAll("p");
  p = p.data([1, 3]).join("p").text(d => d);
  assert.strictEqual(document.body.innerHTML, "<p>1</p><p>3</p>");
});

it("selection.join(enter, update, exit) calls the specified functions", () => {
  const document = jsdom("<p>1</p><p>2</p>");
  let p = d3.select(document.body).selectAll("p").datum(function() { return this.textContent; });
  p = p.data([1, 3], d => d).join(
    enter => enter.append("p").attr("class", "enter").text(d => d),
    update => update.attr("class", "update"),
    exit => exit.attr("class", "exit")
  );
  assert.strictEqual(document.body.innerHTML, "<p class=\"update\">1</p><p class=\"exit\">2</p><p class=\"enter\">3</p>");
});

it("selection.join(…) reorders nodes to match the data", () => {
  const document = jsdom();
  let p = d3.select(document.body).selectAll("p");
  p = p.data([1, 3], d => d).join(enter => enter.append("p").text(d => d));
  assert.strictEqual(document.body.innerHTML, "<p>1</p><p>3</p>");
  p = p.data([0, 3, 1, 2, 4], d => d).join(enter => enter.append("p").text(d => d));
  assert.strictEqual(document.body.innerHTML, "<p>0</p><p>3</p><p>1</p><p>2</p><p>4</p>");
});
