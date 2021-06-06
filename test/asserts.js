import assert from "assert";
import {selection} from "../src/index.js";

export function assertSelection(actual, expected) {
  let expectedGroups, expectedParents, expectedEnter, expectedExit, expectedRest;
  if (expected instanceof selection) {
    ({
      _groups: expectedGroups,
      _parents: expectedParents,
      _enter: expectedEnter,
      _exit: expectedExit,
      ...expectedRest
    } = expected);
  } else {
    ({
      groups: expectedGroups,
      parents: expectedParents = Array.from(expectedGroups, () => null),
      enter: expectedEnter,
      exit: expectedExit,
      ...expectedRest
    } = expected);
  }
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
