export default function(x) {
  return x == null ? [] // null, undefined
    : typeof x === "object" && "length" in x ? x // Array, TypedArray, NodeList
    : Array.from(x); // Map, Set, iterable, string, or anything else
}
