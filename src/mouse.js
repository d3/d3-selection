import sourceEvent from "./sourceEvent.js";
import point from "./point.js";

export default function(node) {
  var event = sourceEvent();
  if (event.changedTouches) event = event.changedTouches[0];
  return point(node, event);
}
