var tape = require("tape"),
    jsdom = require("./jsdom"),
    d3 = require("../");

global.document = jsdom("");

const node = d3.create("div").node();

const mouse = { pageX: 10, pageY: 20, clientX: 10, clientY: 20, type: "mousemove", target: node, currentTarget: node };

const touch = { type: "touchmove", target: node, currentTarget: node,
  touches: [ { pageX: 10, pageY: 20, clientX: 10, clientY: 20 } ]
};

const multitouch = { type: "touchmove", target: node, currentTarget: node,
  touches: [
    { pageX: 10, pageY: 20, clientX: 10, clientY: 20 },
    { pageX: 11, pageY: 21, clientX: 11, clientY: 21 }
  ]
};

tape("d3.pointer(event) returns an array of coordinates", function(test) {
  test.deepEqual(d3.pointer(mouse), [10, 20]);
  test.deepEqual(d3.pointer(touch.touches[0]), [10, 20]);
  test.deepEqual(d3.pointer(multitouch.touches[0]), [10, 20]);
  test.deepEqual(d3.pointer(mouse, node), [10, 20]);
  test.deepEqual(d3.pointer(touch.touches[0], node), [10, 20]);
  test.deepEqual(d3.pointer(multitouch.touches[0], node), [10, 20]);
  test.end();
});

tape("d3.pointers(event) returns an array of arrays of coordinates", function(test) {
  test.deepEqual(d3.pointers(mouse), [[10, 20]]);
  test.deepEqual(d3.pointers(touch), [[10, 20]]);
  test.deepEqual(d3.pointers(multitouch), [[10, 20], [11, 21]]);
  test.deepEqual(d3.pointers(mouse, node), [[10, 20]]);
  test.deepEqual(d3.pointers(touch, node), [[10, 20]]);
  test.deepEqual(d3.pointers(multitouch, node), [[10, 20], [11, 21]]);
  test.end();
});

