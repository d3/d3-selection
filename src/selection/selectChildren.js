import matcher from "../matcher.js";

var filter = Array.prototype.filter;

function children() {
  return this.children;
}

function childrenFilter(match) {
  match = typeof match === "function" ? match : matcher(match);
  return function() {
    return filter.call(this.children, function(e) { return match.call(e); });
  };
}

export default function(match) {
  return this.selectAll(match == null ? children
    : childrenFilter(typeof match === "function" ? match : matcher(match)));
}
