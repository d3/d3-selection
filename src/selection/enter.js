import sparse from "./sparse";
import {Selection} from "./index";

export default function() {
  return this._enter || (this._enter = new Selection(this._groups.map(sparse), this._parents));
}
