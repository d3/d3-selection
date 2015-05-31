import arrayify from "./arrayify";
import {Selection} from "./selection";

export default function(selection) {
  return new Selection(emptyNode(arrayify(selection), selection._depth), selection._depth);
};

function emptyNode(nodes, depth) {
  var i = -1,
      n = nodes.length,
      node,
      empty = new Array(n);

  if (--depth) {
    while (++i < n) {
      if (node = nodes[i]) {
        empty[i] = emptyNode(node, depth);
      }
    }
  }

  empty._parent = nodes._parent;
  return empty;
}
