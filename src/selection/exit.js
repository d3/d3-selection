import arrayify from "./arrayify";
import {Selection} from "./index";

function exit(update) {
  var exit = new Array(update.length);
  exit._parent = update._parent;
  return exit;
}

export default function() {
  return this._exit || (this._exit = new Selection(arrayify(this).map(exit)));
};
