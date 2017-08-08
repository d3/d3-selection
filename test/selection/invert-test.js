var tape = require("tape"),
    jsdom = require("../jsdom"),
    d3 = require("../../");

tape("selection.invert(selection) returns a new selection with the sent selection removed", function(test) {
  var document = jsdom("<h1 id='one'>one</h1><h1 id='two'>two</h1><h1 id='three'>three</h1>"),
      body = document.body,
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      three = document.querySelector("#three"),
      selection0 = d3.select(body).selectAll("h1"),
      selection1 = selection0.select(function(d, i) { return i === 1 ? this : null; });
  test.deepEqual(selection0.invert(selection1), {_groups: [[one, three]], _parents: [body]});
  test.deepEqual(selection1, {_groups: [[, two]], _parents: [body]});
  test.end();
});

tape("selection.invert(selection) works with a filtered selection", function(test) {
  var document = jsdom("<h1 id='one'>one</h1><h1 id='two'>two</h1><h1 id='three'>three</h1>"),
      body = document.body,
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      three = document.querySelector("#three"),
      selection0 = d3.select(body).selectAll("h1"),
      selection1 = selection0.filter("#two");
  test.deepEqual(selection0.invert(selection1), {_groups: [[one, three]], _parents: [body]});
  test.deepEqual(selection1, {_groups: [[two]], _parents: [body]});
  test.end();
});
