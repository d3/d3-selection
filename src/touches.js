import sourceEvent from "./sourceEvent.js";
import pointers from "./pointers.js";

export default function(event, node) {
  return pointers(sourceEvent(event).touches, node);
}
