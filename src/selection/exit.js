import sparse from "./sparse";

export default function() {
  return this._exit || (this._exit = sparse(this));
};
