import matcher from "../matcher.js";
import constant from "../constant.js";

var find = Array.prototype.find;

function childFind(match) {
  match = typeof match === "function" ? match
        : match == null ? constant(true)
        : matcher(match);
  return function() {
    return find.call(this.children, function(e) { return match.call(e); });
  };
}

export default function(match) {
  return this.select(childFind(match));
}
