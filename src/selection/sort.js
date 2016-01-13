import arrayify from "../arrayify";

export default function(compare) {
  if (!compare) compare = ascending;

  function compare(a, b) {
    return a && b ? compare(a.__data__, b.__data__) : !a - !b;
  }

  function visit(nodes, depth) {
    if (--depth) {
      var i = -1,
          n = nodes.length,
          node;
      while (++i < n) {
        if (node = nodes[i]) {
          visit(node, depth);
        }
      }
    }

    else {
      nodes.sort(compare);
    }
  }

  visit(arrayify(this), this._depth);
  return this.order();
};

function ascending(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}
