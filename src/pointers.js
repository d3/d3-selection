import pointer from "./pointer.js";

export default function(events, node) {
  return Array.from(events, event => pointer(event, node));
}
