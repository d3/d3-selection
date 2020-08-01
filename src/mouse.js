import sourceEvent from "./sourceEvent.js";
import pointer from "./pointer.js";

export default function(event, node) {
  return pointer(sourceEvent(event), node);
}
