export default function(x) {
  return x == null ? [] : "length" in x ? x : Array.from(x);
}
