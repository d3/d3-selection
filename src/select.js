import {Selection} from "./selection/index";

export default function(selector) {
  return new Selection([typeof selector === "string" ? document.querySelector(selector) : selector], 1);
};
