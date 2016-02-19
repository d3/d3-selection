import sparse from "./sparse";
import {Selection} from "./index";

export default function() {
  return this._exit || (this._exit = new Selection(this._groups.map(sparse), this._parents));
}
