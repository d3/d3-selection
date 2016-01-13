var tape = require("tape"),
    jsdom = require("jsdom"),
    d3 = require("../");

tape("d3.namespace(name) returns name if there is no namespace prefix", function(test) {
  test.equal(d3.namespace("foo"), "foo");
  test.end();
});

tape("d3.namespace(name) coerces name to a string", function(test) {
  test.equal(d3.namespace({toString: function() { return "foo"; }}), "foo");
  test.deepEqual(d3.namespace({toString: function() { return "svg"; }}), {space: "http://www.w3.org/2000/svg", local: "svg"});
  test.end();
});

tape("d3.namespace(name) returns the expected values for built-in namespaces", function(test) {
  test.deepEqual(d3.namespace("svg"), {space: "http://www.w3.org/2000/svg", local: "svg"});
  test.deepEqual(d3.namespace("xhtml"), {space: "http://www.w3.org/1999/xhtml", local: "xhtml"});
  test.deepEqual(d3.namespace("xlink"), {space: "http://www.w3.org/1999/xlink", local: "xlink"});
  test.deepEqual(d3.namespace("xml"), {space: "http://www.w3.org/XML/1998/namespace", local: "xml"});
  test.deepEqual(d3.namespace("svg:g"), {space: "http://www.w3.org/2000/svg", local: "g"});
  test.deepEqual(d3.namespace("xhtml:b"), {space: "http://www.w3.org/1999/xhtml", local: "b"});
  test.deepEqual(d3.namespace("xlink:href"), {space: "http://www.w3.org/1999/xlink", local: "href"});
  test.deepEqual(d3.namespace("xml:lang"), {space: "http://www.w3.org/XML/1998/namespace", local: "lang"});
  test.end();
});

tape("d3.namespace(\"xmlns:…\") treats the whole name as the local name", function(test) {
  test.deepEqual(d3.namespace("xmlns:xlink"), {space: "http://www.w3.org/2000/xmlns/", local: "xmlns:xlink"});
  test.end();
});
