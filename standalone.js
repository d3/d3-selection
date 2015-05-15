var event = require("./lib/d3/event"),
    namespace = require("./lib/d3/namespace"),
    selection = require("./lib/d3/selection"),
    d3 = global.d3 || (global.d3 = {});

d3.mouse = event.mouse;
d3.touch = event.touch;
d3.touches = event.touches;
d3.namespace = d3.ns = namespace;
d3.selection = selection;
d3.select = selection.select;
d3.selectAll = selection.selectAll;
selection.prototype.classed = selection.prototype.class;
