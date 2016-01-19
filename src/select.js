import {Selection, root} from "./selection/index";

export default function(selector) {
  return new Selection([[typeof selector === "string" ? document.querySelector(selector) : selector]], root);
}
