import {Selection} from "./index";

export default function(selection) {
  if (this._parents !== selection._parents) throw new Error("not siblings");

  for (var groups0 = this._groups, groups1 = selection._groups, m = groups0.length, merges = new Array(m), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }

  return new Selection(merges, this._parents);
}
