import assert from "node:assert";
import {select, selection} from "../../src/index.js";
import {it} from "vitest";

it("selection() returns a selection of the document element", () => {
  assert.strictEqual(selection().node(), document.documentElement);
});

it("selection.prototype can be extended", () => {
  document.documentElement.innerHTML = "<input type='checkbox'>";
  const s = select(document.querySelector("[type=checkbox]"));
  try {
    selection.prototype.checked = function(value) {
      return arguments.length
          ? this.property("checked", !!value)
          : this.property("checked");
    };
    assert.strictEqual(s.checked(), false);
    assert.strictEqual(s.checked(true), s);
    assert.strictEqual(s.checked(), true);
  } finally {
    delete selection.prototype.checked;
  }
});

it("selection() returns an instanceof selection", () => {
  assert(selection() instanceof selection);
});
