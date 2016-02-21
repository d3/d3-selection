import sparse from "./sparse";
import {Selection} from "./index";

export default function() {
  return new Selection(this._enter || this._groups.map(sparse), this._parents);
}
