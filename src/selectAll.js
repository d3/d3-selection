import {Selection} from "./selection/index";

export default function(selector) {
  return new Selection([typeof selector === "string" ? document.querySelectorAll(selector) : selector]);
}
