export default function(x) {
  return Array.isArray(x) ? x : Array.from(x);
}
