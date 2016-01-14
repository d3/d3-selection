export default function(selection) {
  for (var groups = selection._, j = 0, m = groups.length; j < m; ++j) {
    if (!Array.isArray(group = groups[j])) {
      for (var n = group.length, array = groups[j] = new Array(n), group, i = 0; i < n; ++i) {
        array[i] = group[i];
      }
      array._parent = group._parent;
    }
  }
  return groups;
};
