import assert from "assert";
import {selection} from "../src/index.js";

export function assertSelection(actual, {
  groups: expectedGroups,
  parents: expectedParents = Array.from(expectedGroups, () => null),
  enter: expectedEnter,
  exit: expectedExit,
  ...expectedRest
} = {}) {
  assert(actual instanceof selection);
  const {
    _groups: actualGroups,
    _parents: actualParents,
    _enter: actualEnter,
    _exit: actualExit,
    ...actualRest
  } = actual;
  assert.deepStrictEqual({
    groups: Array.from(actualGroups, group => Array.from(group)),
    parents: Array.from(actualParents),
    enter: actualEnter && actualEnter.map(group => group.map(node => ({...node}))), // ignore EnterNode
    exit: actualExit,
    ...actualRest
  }, {
    groups: Array.from(expectedGroups, group => Array.from(group)),
    parents: expectedParents,
    enter: expectedEnter,
    exit: expectedExit,
    ...expectedRest
  });
}
