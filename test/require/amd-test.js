var tape = require("tape"),
    path = require("path"),
    amdRequire = require("requirejs");

tape("can load uncompressed as AMD module", function(test) {
  var absPath = path.join(__dirname, "../../d3-selection");
  amdRequire([absPath], function(d3Selection) {
    test.ok(d3Selection.select);
    test.end();
  });
});

tape("can load compressed as AMD module", function(test) {
  var absPath = path.join(__dirname, "../../d3-selection.min");
  amdRequire([absPath], function(d3Selection) {
    test.ok(d3Selection.select);
    test.end();
  });
});
