import assert from "node:assert";
import {it} from "vitest";
import {namespaces} from "d3-selection";

it("namespaces has the expected value", () => {
  assert.deepStrictEqual(namespaces, {
    svg: "http://www.w3.org/2000/svg",
    xhtml: "http://www.w3.org/1999/xhtml",
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/"
  });
});
