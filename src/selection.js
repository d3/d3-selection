import selection_select from "./selection-select";
import selection_selectAll from "./selection-selectAll";
import selection_filter from "./selection-filter";
import selection_data from "./selection-data";
import selection_enter from "./selection-enter";
import selection_exit from "./selection-exit";
import selection_order from "./selection-order";
import selection_sort from "./selection-sort";
import selection_call from "./selection-call";
import selection_nodes from "./selection-nodes";
import selection_node from "./selection-node";
import selection_size from "./selection-size";
import selection_empty from "./selection-empty";
import selection_each from "./selection-each";
import selection_attr from "./selection-attr";
import selection_style from "./selection-style";
import selection_property from "./selection-property";
import selection_classed from "./selection-classed";
import selection_text from "./selection-text";
import selection_html from "./selection-html";
import selection_append from "./selection-append";
import selection_remove from "./selection-remove";
import selection_datum from "./selection-datum";
import selection_on from "./selection-on";
import selection_dispatch from "./selection-dispatch";

// When depth = 1, root = [Node, …].
// When depth = 2, root = [[Node, …], …].
// When depth = 3, root = [[[Node, …], …], …]. etc.
// Note that [Node, …] and NodeList are used interchangeably; see arrayify.
export function Selection(root, depth) {
  this._root = root;
  this._depth = depth;
  this._enter = this._update = this._exit = null;
};

function selection() {
  return new Selection([document.documentElement], 1);
}

Selection.prototype = selection.prototype = {
  select: selection_select,
  selectAll: selection_selectAll,
  filter: selection_filter,
  data: selection_data,
  enter: selection_enter,
  exit: selection_exit,
  order: selection_order,
  sort: selection_sort,
  call: selection_call,
  nodes: selection_nodes,
  node: selection_node,
  size: selection_size,
  empty: selection_empty,
  each: selection_each,
  attr: selection_attr,
  style: selection_style,
  property: selection_property,
  classed: selection_classed,
  text: selection_text,
  html: selection_html,
  append: selection_append,
  remove: selection_remove,
  datum: selection_datum,
  on: selection_on,
  dispatch: selection_dispatch
};

export default selection;
