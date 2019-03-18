var tape = require("tape"),
    jsdom = require("../jsdom"),
    d3 = require("../../");

tape("selection are iterable over the selected nodes", function(test) {
  var document = jsdom("<h1 id='one'></h1><h1 id='two'></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two");
  test.deepEqual([...d3.selectAll([one, two])], [one, two]);
  test.end();
});

tape("selection iteration merges nodes from all groups into a single array", function(test) {
  var document = jsdom("<h1 id='one'></h1><h1 id='two'></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two");
  test.deepEqual([...d3.selectAll([one, two]).selectAll(function() { return [this]; })], [one, two]);
  test.end();
});

tape("selection iteration skips missing elements", function(test) {
  var document = jsdom("<h1 id='one'></h1><h1 id='two'></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two");
  test.deepEqual([...d3.selectAll([, one,, two])], [one, two]);
  test.end();
});
