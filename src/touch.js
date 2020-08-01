import sourceEvent from "./sourceEvent.js";
import pointer from "./pointer.js";

export default function(event, node, identifier) {
  const touches = sourceEvent(event).touches;
  for (var i = 0, n = touches.length, touch; i < n; ++i) {
    if ((touch = touches[i]).identifier === identifier) {
      return pointer(touch, node);
    }
  }
  return null;
}
