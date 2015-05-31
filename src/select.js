import {Selection} from "./selection";

export default function(selector) {
  return new Selection([typeof selector === "string" ? document.querySelector(selector) : selector], 1);
};
