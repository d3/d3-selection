var point = require("./point"),
    source = require("./source");

module.exports = function(node, touches) {
  if (arguments.length < 2) touches = source().touches;
  for (var i = 0, n = touches ? touches.length : 0, points = new Array(n); i < n; ++i) {
    points[i] = point(node, touches[i]);
  }
  return points;
};
