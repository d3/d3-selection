export default (selection, name, className) =>
  className
    ? selection
      .selectAll(`${name}.${className}`)
      .data([null])
      .join(name)
      .attr('class', className)
    : selection
      .selectAll(name)
      .data([null])
      .join(name);
  
