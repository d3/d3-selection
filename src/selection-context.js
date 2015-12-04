export default function(args) {
  var n = args.length,
      m = n >> 1,
      i = n + 1,
      j = m,
      ancestor = this._root,
      offset = this._depth - m,
      ancestors = new Array(m),
      stack = new Array(n);

  while (--j >= 0) {
    i -= 2, ancestor = ancestor[stack[i] = args[i]];
    ancestors[j] = j + offset ? ancestor._parent : ancestor;
  }

  args = null; // allow gc

  return function(callback) {
    var i = m;
    while (--i >= 0) stack[i << 1] = ancestors[i].__data__;
    callback.apply(ancestors[0], stack);
  };
};
