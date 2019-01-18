import identity from "../identity";

function enterAppend(name) {
  return function(enter) {
    return enter.append(name);
  };
}

function exitRemove(exit) {
  return exit.remove();
}

export default function(onenter, onupdate, onexit) {
  if (typeof onenter !== "function") onenter = enterAppend(onenter + "");
  if (onupdate == null) onupdate = identity;
  if (onexit == null) onexit = exitRemove;
  var enter = onenter(this.enter()), update = onupdate(this);
  onexit(this.exit());
  return enter && update ? enter.merge(update).order() : update;
}
