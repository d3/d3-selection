export default function(update) {
  var group = new Array(update.length);
  group._parent = update._parent;
  return group;
};
