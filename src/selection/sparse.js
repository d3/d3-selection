import arrayify from "./arrayify";
import {Selection} from "./index";

function blankGroup(group) {
  return new Array(group.length);
}

export default function(selection) {
  return new Selection(arrayify(selection).map(blankGroup));
};
