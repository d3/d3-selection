var tape = require("tape"),
    jsdom = require("../jsdom"),
    d3 = require("../../");

tape("selection.apply(function) calls the specified function, passing the return value", function(test) {
  var document = jsdom('<div id="test"></div>'),
      selection = d3.select(document).select('#test');
  test.deepEqual(selection.apply(function(selection) { 
    return selection.append('div').attr('id', 'apply-test'); 
  }), selection.select('#apply-test'));
  test.end();
});

tape("selection.apply(function, arguments…) calls the specified function, passing the additional arguments", function(test) {
  var id = 'custom-id',
      document = jsdom('<div id="test"></div>'),
      selection = d3.select(document).select('#test');
  test.deepEqual(selection.apply(function(selection, id) { 
    return selection.append('div').attr('id', id); 
  }, id), selection.select('#' + id));
  test.end();
});
