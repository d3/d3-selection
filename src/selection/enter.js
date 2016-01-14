import sparse from "./sparse";

export default function() {
  return this._enter || ((this._enter = sparse(this))._update = this, this._enter);
};
