export default function array(x) {
  return x == null ? [] : Array.isArray(x) ? x : Array.from(x);
}
