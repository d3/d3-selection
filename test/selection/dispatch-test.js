var tape = require("tape"),
    jsdom = require("../jsdom"),
    d3 = require("../../");

tape("selection.dispatch(type) dispatches a custom event of the specified type to each selected element in order", function(test) {
  var result = [],
      event,
      document = jsdom("<h1 id='one'></h1><h1 id='two'></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      selection = d3.selectAll([one, two]).datum(function(d, i) { return "node-" + i; }).on("bang", function(e, d) { event = e; result.push(this, d); });
  test.equal(selection.dispatch("bang"), selection);
  test.deepEqual(result, [one, "node-0", two, "node-1"]);
  test.equal(event.type, "bang");
  test.equal(event.bubbles, false);
  test.equal(event.cancelable, false);
  test.equal(event.detail, null);
  test.end();
});

tape("selection.dispatch(type, params) dispatches a custom event with the specified constant parameters", function(test) {
  var result = [],
      event,
      document = jsdom("<h1 id='one'></h1><h1 id='two'></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      selection = d3.selectAll([one, two]).datum(function(d, i) { return "node-" + i; }).on("bang", function(e, d) { event = e; result.push(this, d); });
  test.equal(selection.dispatch("bang", {bubbles: true, cancelable: true, detail: "loud"}), selection);
  test.deepEqual(result, [one, "node-0", two, "node-1"]);
  test.equal(event.type, "bang");
  test.equal(event.bubbles, true);
  test.equal(event.cancelable, true);
  test.equal(event.detail, "loud");
  test.end();
});

tape("selection.dispatch(type, function) dispatches a custom event with the specified parameter function", function(test) {
  var result = [],
      events = [],
      document = jsdom("<h1 id='one'></h1><h1 id='two'></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      selection = d3.selectAll([one, two]).datum(function(d, i) { return "node-" + i; }).on("bang", function(e, d) { events.push(e); result.push(this, d); });
  test.equal(selection.dispatch("bang", function(d, i) { return {bubbles: true, cancelable: true, detail: "loud-" + i}; }), selection);
  test.deepEqual(result, [one, "node-0", two, "node-1"]);
  test.equal(events[0].type, "bang");
  test.equal(events[0].bubbles, true);
  test.equal(events[0].cancelable, true);
  test.equal(events[0].detail, "loud-0");
  test.equal(events[1].type, "bang");
  test.equal(events[1].bubbles, true);
  test.equal(events[1].cancelable, true);
  test.equal(events[1].detail, "loud-1");
  test.end();
});

tape("selection.dispatch(type) skips missing elements", function(test) {
  var result = [],
      event,
      document = jsdom("<h1 id='one'></h1><h1 id='two'></h1>"),
      one = document.querySelector("#one"),
      two = document.querySelector("#two"),
      selection = d3.selectAll([, one,, two]).datum(function(d, i) { return "node-" + i; }).on("bang", function(e, d) { event = e; result.push(this, d); });
  test.equal(selection.dispatch("bang"), selection);
  test.deepEqual(result, [one, "node-1", two, "node-3"]);
  test.equal(event.type, "bang");
  test.equal(event.detail, null);
  test.end();
});
