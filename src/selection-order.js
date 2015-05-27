export default function() {
  orderNode(this._root, this._depth);
  return this;
};

function orderNode(nodes, depth) {
  var i = nodes.length,
      node,
      next;

  if (--depth) {
    while (--i >= 0) {
      if (node = nodes[i]) {
        orderNode(node, depth);
      }
    }
  }

  else {
    next = nodes[--i];
    while (--i >= 0) {
      if (node = nodes[i]) {
        if (next && next !== node.nextSibling) next.parentNode.insertBefore(node, next);
        next = node;
      }
    }
  }
}
