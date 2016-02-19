import sparse from "./sparse";
import {Selection} from "./index";

export default function() {
  var enter = this._enter;
  if (enter) return enter;
  return this._enter = new Selection(this._groups.map(sparse), this._parents);
}
