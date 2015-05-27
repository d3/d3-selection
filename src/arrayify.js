// The leaf groups of the selection hierarchy are initially NodeList,
// and then lazily converted to arrays when mutation is required.
export default function(selection) {
  return selection._root = arrayifyNode(selection._root, selection._depth);
};

function arrayifyNode(nodes, depth) {
  var i = -1,
      n = nodes.length,
      node;

  if (--depth) {
    while (++i < n) {
      if (node = nodes[i]) {
        nodes[i] = arrayifyNode(node, depth);
      }
    }
  }

  else if (!Array.isArray(nodes)) {
    var array = new Array(n);
    while (++i < n) array[i] = nodes[i];
    array._parent = nodes._parent;
    nodes = array;
  }

  return nodes;
}
