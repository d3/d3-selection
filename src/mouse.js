import sourceEvent from "./sourceEvent";
import point from "./point";

export default function(node, event) {
  if (arguments.length < 2) event = sourceEvent();
  if (event.changedTouches) event = event.changedTouches[0];
  return point(node, event);
};
