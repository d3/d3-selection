var point = require("./point"),
    source = require("./source");

module.exports = function(node, touches, identifier) {
  if (arguments.length < 3) identifier = touches, touches = source().changedTouches;
  for (var i = 0, n = touches ? touches.length : 0, touch; i < n; ++i) {
    if ((touch = touches[i]).identifier === identifier) {
      return point(node, touch);
    }
  }
  return null;
};
