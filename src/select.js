import {Selection, root} from "./selection/index";

export default function(selector) {
  return typeof selector === "string"
      ? new Selection([[document.querySelector(selector)]], [document.documentElement])
      : new Selection([[typeof selector === "function" ? selector.call(document) : selector]], root);
}
