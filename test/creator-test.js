import assert from "assert";
import * as d3 from "../src/index.js";
import jsdom from "./jsdom.js";

it("d3.creator(name).call(element) returns a new element with the given name", () => {
  const document = jsdom("<body class='foo'>");
  assert.deepEqual(type(d3.creator("h1").call(document.body)), {namespace: "http://www.w3.org/1999/xhtml", name: "H1"});
  assert.deepEqual(type(d3.creator("xhtml:h1").call(document.body)), {namespace: "http://www.w3.org/1999/xhtml", name: "H1"});
  assert.deepEqual(type(d3.creator("svg").call(document.body)), {namespace: "http://www.w3.org/2000/svg", name: "svg"});
  assert.deepEqual(type(d3.creator("g").call(document.body)), {namespace: "http://www.w3.org/1999/xhtml", name: "G"});
});

it("d3.creator(name).call(element) can inherit the namespace from the given element", () => {
  const document = jsdom("<body class='foo'><svg></svg>"),
      svg = document.querySelector("svg");
  assert.deepEqual(type(d3.creator("g").call(document.body)), {namespace: "http://www.w3.org/1999/xhtml", name: "G"});
  assert.deepEqual(type(d3.creator("g").call(svg)), {namespace: "http://www.w3.org/2000/svg", name: "g"});
});

function type(element) {
  return {namespace: element.namespaceURI, name: element.tagName};
}
