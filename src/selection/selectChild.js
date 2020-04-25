import matcher from "../matcher.js";

var find = Array.prototype.find;

function childFind(match) {
  return function() {
    return find.call(this.children, match);
  };
}

export default function(match) {
  return this.select(childFind(typeof match === "function" ? match : matcher(match)));
}
