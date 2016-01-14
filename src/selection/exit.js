import arrayify from "./arrayify";
import {Selection} from "./index";

function exit(update) {
  return new Array(update.length);
}

export default function() {
  return this._exit || (this._exit = new Selection(arrayify(this).map(exit)));
};
