import {event} from "./selection/on";

export default function() {
  var current = event, source;
  if (current) {
    while (source = current.sourceEvent) current = source;
   }
  return current;
}
