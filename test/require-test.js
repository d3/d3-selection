var tape = require("tape"),
    path = require("path"),
    d3 = require("../build/d3"),
    requirejs = require("requirejs");

tape("can load as a CommonJS module", function(test) {
  test.equal(typeof d3.select, "function");
  test.ok(!("d3" in global));
  test.end();
});

tape("can load as AMD module", function(test) {
  requirejs([path.join(__dirname, "../build/d3")], function(d3) {
    test.equal(typeof d3.select, "function");
    test.end();
    delete global.d3;
  });
});
