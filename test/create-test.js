var tape = require("tape"),
    jsdom = require("./jsdom"),
    d3 = require("../");

tape("d3.create(name) returns a new HTML element with the given name", function(test) {
  global.document = jsdom("");
  try {
    var h1 = d3.create("h1");
    test.equal(h1._groups[0][0].namespaceURI, "http://www.w3.org/1999/xhtml");
    test.equal(h1._groups[0][0].tagName, "H1");
    test.deepEqual(h1._parents, [null]);
    test.end();
  } finally {
    delete global.document;
  }
});

tape("d3.create(name) returns a new SVG element with the given name", function(test) {
  global.document = jsdom("");
  try {
    var svg = d3.create("svg");
    test.equal(svg._groups[0][0].namespaceURI, "http://www.w3.org/2000/svg");
    test.equal(svg._groups[0][0].tagName, "svg");
    test.deepEqual(svg._parents, [null]);
    test.end();
  } finally {
    delete global.document;
  }
});
