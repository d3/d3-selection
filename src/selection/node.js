export default function() {
  return firstNode(this._root, this._depth);
};

function firstNode(nodes, depth) {
  var i = -1,
      n = nodes.length,
      node;

  if (--depth) {
    while (++i < n) {
      if (node = nodes[i]) {
        if (node = firstNode(node, depth)) {
          return node;
        }
      }
    }
  }

  else {
    while (++i < n) {
      if (node = nodes[i]) {
        return node;
      }
    }
  }
}
