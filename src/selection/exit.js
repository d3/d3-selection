import blank from "./blank";

export default function() {
  return this._exit || (this._exit = blank(this));
};
