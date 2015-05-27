export default function() {
  var event = global.d3.event, source;
  while (source = event.sourceEvent) event = source;
  return event;
};
