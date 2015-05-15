var Selection = require("./selection"); // TODO remove dependency

// https://bugs.webkit.org/show_bug.cgi?id=44083
var bug44083 = global.navigator && /WebKit/.test(global.navigator.userAgent) ? -1 : 0;

function point(node, event) {
  var svg = node.ownerSVGElement || node;
  if (svg.createSVGPoint) {
    var point = svg.createSVGPoint();
    if (bug44083 < 0) {
      var window = global.window; // Must exist if bug44083.
      if (window.scrollX || window.scrollY) {
        svg = Selection.select("body").append("svg").style({position: "absolute", top: 0, left: 0, margin: 0, padding: 0, border: "none"}, "important");
        var ctm = svg.node().getScreenCTM();
        bug44083 = !(ctm.f || ctm.e);
        svg.remove();
      }
    }
    if (bug44083) point.x = event.pageX, point.y = event.pageY;
    else point.x = event.clientX, point.y = event.clientY;
    point = point.matrixTransform(node.getScreenCTM().inverse());
    return [point.x, point.y];
  }
  var rect = node.getBoundingClientRect();
  return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
}

function source() {
  var event = global.d3.event, source;
  while (source = event.sourceEvent) event = source;
  return event;
}

exports.mouse = function(node, event) {
  if (arguments.length < 2) event = source();
  if (event.changedTouches) event = event.changedTouches[0];
  return point(node, event);
};

exports.touch = function(node, touches, identifier) {
  if (arguments.length < 3) identifier = touches, touches = source().changedTouches;
  for (var i = 0, n = touches ? touches.length : 0, touch; i < n; ++i) {
    if ((touch = touches[i]).identifier === identifier) {
      return point(node, touch);
    }
  }
  return null;
};

exports.touches = function(node, touches) {
  if (arguments.length < 2) touches = source().touches;
  for (var i = 0, n = touches ? touches.length : 0, points = new Array(n); i < n; ++i) {
    points[i] = point(node, touches[i]);
  }
  return points;
};
