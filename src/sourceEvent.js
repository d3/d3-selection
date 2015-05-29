import {event} from "./selection-event";

export default function() {
  var current = event, source;
  while (source = current.sourceEvent) current = source;
  return current;
};
