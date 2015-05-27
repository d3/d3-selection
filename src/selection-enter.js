import emptyOf from "./emptyOf";

// Lazily constructs the enter selection for this (update) selection.
// Until this selection is joined to data, the enter selection will be empty.
export default function() {
  if (!this._enter) {
    this._enter = emptyOf(this);
    this._enter._update = this;
  }
  return this._enter;
};
