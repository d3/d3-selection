export default (selection, name, className) =>
  selection
    .selectAll(className ? `${name}.${className}`: name)
    .data([null])
    .join(name)
    .attr('class', className);
