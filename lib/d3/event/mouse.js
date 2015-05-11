var point = require("./point"),
    source = require("./source");

module.exports = function(node, event) {
  if (arguments.length < 2) event = source();
  if (event.changedTouches) event = event.changedTouches[0];
  return point(node, event);
};
