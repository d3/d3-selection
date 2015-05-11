var d3 = global.d3 || (global.d3 = {}),
    selection = d3.selection = require("./lib/d3/selection");
d3.select = selection.select;
d3.selectAll = selection.selectAll;
d3.namespace = require("./lib/d3/namespace/prefix");
d3.mouse = require("./lib/d3/event/mouse");
d3.touch = require("./lib/d3/event/touch");
d3.touches = require("./lib/d3/event/touches");
