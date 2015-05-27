var tape = require("tape"),
    path = require("path"),
    d3 = require("../"),
    requirejs = require("requirejs");

tape("can load as a CommonJS module", function(test) {
  test.equal(typeof d3.select, "function");
  test.equal(global.d3, d3);
  test.end();
});

tape("can load as AMD module", function(test) {
  delete global.d3;
  requirejs([path.join(__dirname, "../d3-selection")], function(d3) {
    test.equal(typeof d3.select, "function");
    test.end();
    global.d3 = d3;
  });
});

tape("can load as minified AMD module", function(test) {
  delete global.d3;
  requirejs([path.join(__dirname, "../d3-selection.min")], function(d3) {
    test.equal(typeof d3.select, "function");
    test.end();
    global.d3 = d3;
  });
});
