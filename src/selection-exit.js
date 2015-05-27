import emptyOf from "./emptyOf";

// Lazily constructs the exit selection for this (update) selection.
// Until this selection is joined to data, the exit selection will be empty.
export default function() {
  return this._exit || (this._exit = emptyOf(this));
};
