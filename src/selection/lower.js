function lower() {
  this.parentNode.insertBefore(this, this.parentNode.firstChild);
}

export default function() {
  return this.each(lower);
}
