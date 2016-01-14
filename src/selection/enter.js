import arrayify from "./arrayify";
import {Selection} from "./index";

function enter(update) {
  var enter = new Array(update.length);
  enter._update = update;
  return enter;
}

export default function() {
  return this._enter || (this._enter = new Selection(arrayify(this).map(enter)));
};
