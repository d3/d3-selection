export default function pointer(event, node = event.currentTarget) {
  if (event instanceof TouchEvent) event = event.touches[0] || event.changedTouches[0];
  if (node) {
    var svg = node.ownerSVGElement || node;
    if (svg.createSVGPoint) {
      var point = svg.createSVGPoint();
      point.x = event.clientX, point.y = event.clientY;
      point = point.matrixTransform(node.getScreenCTM().inverse());
      return [point.x, point.y];
    }
    if (node.getBoundingClientRect) {
      var rect = node.getBoundingClientRect();
      return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
    }
  }
  return [event.pageX, event.pageY];
}

export function pointers(event, node = event.currentTarget) {
  return Array.from(event.touches || [event]).map(e => pointer(e, node));
}
