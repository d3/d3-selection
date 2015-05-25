var event = require("./lib/d3/event"),
    namespace = require("./lib/d3/namespace"),
    selection = require("./lib/d3/selection"),
    d3 = module.exports = global.d3 || (global.d3 = {});

d3.mouse = event.mouse;
d3.touch = event.touch;
d3.touches = event.touches;
d3.namespace = namespace.prefix;
d3.selection = selection;
d3.select = selection.select;
d3.selectAll = selection.selectAll;

// Deprecated aliases for backwards-compatibility with 3.x:
d3.ns = namespace;
selection.prototype.on = selection.prototype.event;
selection.prototype.insert = selection.prototype.append;
selection.prototype.classed = selection.prototype.class;
