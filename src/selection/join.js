import identity from "../identity";

function joinAppend(name) {
  return function(selection) {
    return selection.append(name);
  };
}

function joinRemove(selection) {
  return selection.remove();
}

export default function(onenter, onupdate, onexit) {
  if (typeof onenter !== "function") onenter = joinAppend(onenter + "");
  if (onupdate == null) onupdate = identity;
  if (onexit == null) onexit = joinRemove;
  var enter = onenter(this.enter()), update = onupdate(this);
  onexit(this.exit());
  return enter && update ? enter.merge(update).order() : update;
}
