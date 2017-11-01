import {Selection, root} from "./selection/index";

export default function(selector) {
  if (typeof selector === "string") {
    return new Selection([document.querySelectorAll(selector)], [document.documentElement]);
  }
  if (typeof selector === "function") {
    return new Selection([selector.call(document)], [document]);
  }
  return new Selection([selector == null ? [] : selector], root);
}
