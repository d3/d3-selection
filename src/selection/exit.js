import sparse from "./sparse";
import {Selection} from "./index";

export default function() {
  var exit = this._exit;
  if (exit) return this._exit = null, exit;
  return new Selection(this._groups.map(sparse), this._parents);
}
