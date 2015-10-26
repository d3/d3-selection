var tape = require("tape"),
    jsdom = require("jsdom"),
    selection = require("../");

tape("selection.namespace returns the expected values for built-in namespaces", function(test) {
  test.deepEqual(selection.namespace("svg:g"), {space: "http://www.w3.org/2000/svg", local: "g"});
  test.deepEqual(selection.namespace("xhtml:b"), {space: "http://www.w3.org/1999/xhtml", local: "b"});
  test.deepEqual(selection.namespace("xlink:href"), {space: "http://www.w3.org/1999/xlink", local: "href"});
  test.deepEqual(selection.namespace("xml:lang"), {space: "http://www.w3.org/XML/1998/namespace", local: "lang"});
  test.end();
});

tape("selection.namespace(\"xmlns:…\") treats the whole name as the local name", function(test) {
  test.deepEqual(selection.namespace("xmlns:xlink"), {space: "http://www.w3.org/2000/xmlns/", local: "xmlns:xlink"});
  test.end();
});
