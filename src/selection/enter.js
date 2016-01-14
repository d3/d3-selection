import arrayify from "./arrayify";
import sparse from "./sparse";
import {Selection} from "./index";

export default function() {
  var enter = this._enter;
  if (enter) return delete this._enter, enter;
  enter = new Selection(arrayify(this).map(sparse));
  enter._update = this;
  return enter;
};
