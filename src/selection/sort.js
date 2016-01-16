import arrayify from "./arrayify";

export default function(compare) {
  if (!compare) compare = ascending;

  function compareNode(a, b) {
    return a && b ? compare(a.__data__, b.__data__) : !a - !b;
  }

  for (var groups = arrayify(this), j = 0, m = groups.length; j < m; ++j) {
    groups[j].sort(compareNode);
  }

  return this.order();
}

function ascending(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}
