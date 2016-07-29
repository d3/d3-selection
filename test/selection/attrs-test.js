var tape = require("tape"),
    jsdom = require("jsdom"),
    d3 = require("../../");

tape("selection.attrs() can set the values of attributes on the selected elements", function(test) {
  var document = jsdom.jsdom("<h1 id='one'>hello</h1><h1 id='two'></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      selection = d3.selectAll([one, two]);
  var attrs = {
    width: 8,
    height: (d, i) => `height-${i}`
  };
  test.equal(selection.attrs(attrs), selection);
  test.equal(one.getAttribute("width"), "8");
  test.equal(two.getAttribute("width"), "8");
  test.equal(one.getAttribute("height"), "height-0");
  test.equal(two.getAttribute("height"), "height-1");
  test.end();
});

tape("selection.attrs() can remove the attributes on the selected elements", function(test) {
  var document = jsdom.jsdom("<h1 id='one' width='8' height='8'>hello</h1><h1 id='two' width='8' height='8'></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      selection = d3.selectAll([one, two]);
  var attrs = {
    width: null,
    height: null
  };
  test.equal(selection.attrs(attrs), selection);
  test.equal(one.hasAttribute("width"), false);
  test.equal(two.hasAttribute("width"), false);
  test.equal(one.hasAttribute("height"), false);
  test.equal(two.hasAttribute("height"), false);
  test.end();
});
