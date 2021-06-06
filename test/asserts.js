import assert from "assert";
import {selection} from "../src/index.js";

export function assertSelection(selected, groups, parents) {
  assert(selected instanceof selection);
  assert.deepStrictEqual([...selected._groups], groups, "selection groups are equal");
  assert.deepStrictEqual([...selected._parents], parents, "selection parents are equal");
}
