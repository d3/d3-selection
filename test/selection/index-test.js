import assert from "assert";
import * as d3 from "../../src/index.js";
import jsdom from "../jsdom.js";
it("d3.selection() returns a selection of the document element", () => {
  const document = global.document = jsdom();
  try {
    assert.strictEqual(d3.selection().node(), document.documentElement);
} finally {
    delete global.document;
  }
});

it("d3.selection.prototype can be extended", () => {
  const document = jsdom("<input type='checkbox'>"),
      s = d3.select(document.querySelector("[type=checkbox]"));
  try {
    d3.selection.prototype.checked = function(value) {
      return arguments.length
          ? this.property("checked", !!value)
          : this.property("checked");
    };
    assert.strictEqual(s.checked(), false);
    assert.strictEqual(s.checked(true), s);
    assert.strictEqual(s.checked(), true);
} finally {
    delete d3.selection.prototype.checked;
  }
});

it("d3.selection() returns an instanceof d3.selection", () => {
  const document = global.document = jsdom();
  try {
    assert(d3.selection() instanceof d3.selection);
} finally {
    delete global.document;
  }
});
