export default function(callback) {
  var depth = this._depth,
      stack = new Array(depth);

  function visit(nodes, depth) {
    var i = -1,
        n = nodes.length,
        node;

    if (--depth) {
      var stack0 = depth * 2,
          stack1 = stack0 + 1;
      while (++i < n) {
        if (node = nodes[i]) {
          stack[stack0] = node._parent.__data__, stack[stack1] = i;
          visit(node, depth);
        }
      }
    }

    else {
      while (++i < n) {
        if (node = nodes[i]) {
          stack[0] = node.__data__, stack[1] = i;
          callback.apply(node, stack);
        }
      }
    }
  }

  visit(this._root, depth);
  return this;
};
