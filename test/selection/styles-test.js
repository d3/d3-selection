var tape = require("tape"),
    jsdom = require("jsdom"),
    d3 = require("../../");

tape("selection.styles(object) can set the values of style properties on the selected elements", function(test) {
  var document = jsdom.jsdom("<h1 id='one'>hello</h1><h1 id='two'></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      selection = d3.selectAll([one, two]);
  var styles = {
    color: "red",
    "margin-top": (d,i) => `${i*10}px`
  };
  test.equal(selection.styles(styles), selection);
  test.equal(one.style.getPropertyValue("color"), "red");
  test.equal(two.style.getPropertyValue("color"), "red");
  test.equal(one.style.getPropertyValue("margin-top"), "0px");
  test.equal(two.style.getPropertyValue("margin-top"), "10px");
  test.end();
});

tape("selection.styles(object) can remove the attributes of style properties on the selected elements", function(test) {
  var document = jsdom.jsdom("<h1 id='one' style='color:red;margin-top:8px;'>hello</h1><h1 id='two' style='color:red;margin-top:8px;'></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      selection = d3.selectAll([one, two]);
  var styles = {
    color: null,
    "margin-top": null
  };
  test.equal(selection.styles(styles), selection);
  test.equal(one.style.getPropertyValue("color"), "");
  test.equal(two.style.getPropertyValue("color"), "");
  test.equal(one.style.getPropertyValue("margin-top"), "");
  test.equal(two.style.getPropertyValue("margin-top"), "");
  test.end();
});