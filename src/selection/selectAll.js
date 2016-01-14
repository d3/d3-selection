import {Selection} from "./index";
import selectorAll from "../selectorAll";

export default function(select) {
  if (typeof select !== "function") select = selectorAll(select);

  for (var groups = this._, m = groups.length, subgroups = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        subgroups.push(subgroup = select.call(node, node.__data__, i, group));
        subgroup._parent = node;
      }
    }
  }

  return new Selection(subgroups);
};
