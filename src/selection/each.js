export default function(callback) {
  var result = [];
  var hasAsync;
  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i]) {
        var val = callback.call(node, node.__data__, i, group);
        if (!hasAsync) hasAsync = val && typeof val.then === 'function';
        result.push(val);
      }
    }
  }

  return hasAsync ? Promise.all(result) : this;
}
