var tape = require("tape"),
    jsdom = require("../jsdom"),
    d3 = require("../../");

tape("selection.dataAppenddata, 'h1' returns a selection", function(test) {
  var document = jsdom();
  test.ok(d3.select(document.body).dataAppend([1, 2], "h1") instanceof d3.selection);
  test.end();
});

tape("selection.dataAppend(array, 'h1') creates an element for element in the array ", function(test) {
  var document = jsdom();
  var selection = d3.select(document.body).dataAppend([1, 2], "h1")

  test.deepEqual(selection.size(), 2);
  test.end();
});
