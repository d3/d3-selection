import blank from "./blank";

export default function() {
  return this._enter || ((this._enter = blank(this))._update = this, this._enter);
};
