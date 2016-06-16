function none() {
  return [];
}

export default function(data) {
  return this.selectAll(none).data(data).enter();
}
