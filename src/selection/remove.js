import {Selection} from "./index";

export default function() {

  for (var groups = this._, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, parent, i = 0; i < n; ++i) {
      if (node = group[i]) {
        if (parent = node.parentNode) parent.removeChild(node);
        subgroup[i] = node, delete group[i];
      }
    }
    subgroup._parent = group._parent;
  }

  return new Selection(subgroups);
};
