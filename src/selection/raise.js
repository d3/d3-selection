function raise() {
  this.parentNode.appendChild(this);
}

export default function() {
  return this.each(raise);
}
