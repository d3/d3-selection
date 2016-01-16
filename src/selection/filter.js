import {Selection} from "./index";
import matcher from "../matcher";

export default function(match) {
  if (typeof match !== "function") match = matcher(match);

  for (var groups = this._, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
    subgroup._parent = group._parent;
  }

  return new Selection(subgroups);
}
