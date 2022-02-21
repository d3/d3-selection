export default (selection, selector) => {
  const [name, className] = selector.split('.');
  return selection
    .selectAll(name + '.' + className)
    .data([null])
    .join(name)
    .attr('class', className);
}
