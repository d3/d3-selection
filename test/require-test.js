var tape = require("tape"),
    path = require("path"),
    requirejs = require("requirejs");

tape("can load as AMD module", function(test) {
  requirejs([path.join(__dirname, "../d3-selection")], function(d3) {
    test.equal(typeof d3.select, "function", "d3.select is a function");
    test.end();
  });
});

tape("can load as minified AMD module", function(test) {
  requirejs([path.join(__dirname, "../d3-selection.min")], function(d3) {
    test.equal(typeof d3.select, "function", "d3.select is a function");
    test.end();
  });
});
