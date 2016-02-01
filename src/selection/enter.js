import sparse from "./sparse";
import {Selection} from "./index";

export default function() {
  var enter = this._enter;
  if (enter) return this._enter = null, enter;
  enter = new Selection(this._groups.map(sparse), this._parents);
  enter._update = this;
  return enter;
}
