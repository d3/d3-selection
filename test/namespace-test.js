import assert from "assert";
import * as d3 from "../src/index.js";

it("d3.namespace(name) returns name if there is no namespace prefix", () => {
  assert.strictEqual(d3.namespace("foo"), "foo");
  assert.strictEqual(d3.namespace("foo:bar"), "bar");
});

it("d3.namespace(name) coerces name to a string", () => {
  assert.strictEqual(d3.namespace({toString: function() { return "foo"; }}), "foo");
  assert.deepEqual(d3.namespace({toString: function() { return "svg"; }}), {space: "http://www.w3.org/2000/svg", local: "svg"});
});

it("d3.namespace(name) returns the expected values for built-in namespaces", () => {
  assert.deepEqual(d3.namespace("svg"), {space: "http://www.w3.org/2000/svg", local: "svg"});
  assert.deepEqual(d3.namespace("xhtml"), {space: "http://www.w3.org/1999/xhtml", local: "xhtml"});
  assert.deepEqual(d3.namespace("xlink"), {space: "http://www.w3.org/1999/xlink", local: "xlink"});
  assert.deepEqual(d3.namespace("xml"), {space: "http://www.w3.org/XML/1998/namespace", local: "xml"});
  assert.deepEqual(d3.namespace("svg:g"), {space: "http://www.w3.org/2000/svg", local: "g"});
  assert.deepEqual(d3.namespace("xhtml:b"), {space: "http://www.w3.org/1999/xhtml", local: "b"});
  assert.deepEqual(d3.namespace("xlink:href"), {space: "http://www.w3.org/1999/xlink", local: "href"});
  assert.deepEqual(d3.namespace("xml:lang"), {space: "http://www.w3.org/XML/1998/namespace", local: "lang"});
});

it("d3.namespace(\"xmlns:…\") treats the whole name as the local name", () => {
  assert.deepEqual(d3.namespace("xmlns:xlink"), {space: "http://www.w3.org/2000/xmlns/", local: "xmlns:xlink"});
});

it("d3.namespace(name) observes modifications to d3.namespaces", () => {
  d3.namespaces.d3js = "https://d3js.org/2016/namespace";
  assert.deepEqual(d3.namespace("d3js:pie"), {space: "https://d3js.org/2016/namespace", local: "pie"});
  delete d3.namespaces.d3js;
  assert.strictEqual(d3.namespace("d3js:pie"), "pie");
});
