export default function() {
  var size = 0;
  for (var node of this) ++size; // eslint-disable-line no-unused-vars
  return size;
}
