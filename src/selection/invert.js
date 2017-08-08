import {Selection} from "./index";

export default function(selection) {
  for (var groups0 = this._groups, m = groups0.length, inverses = [], j = 0; j < m; ++j) {
    for (var group0 = groups0[j], n = group0.length, inverse = inverses[j] = new Array(), node, i = 0; i < n; ++i) {
      for (var groups1 = selection._groups, o = groups1.length, k = 0; k < o; k++) {
        if(node = groups1[k].indexOf(group0[i]) === -1 ? group0[i] : null) {
          inverse.push(node);
        }
      }
    }
  }

  for (; j < m; ++j) {
    inverses[j] = groups0[j];
  }

  return new Selection(inverses, this._parents);
}
