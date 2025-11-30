const width = 1000;
const height = 600;

const svg = d3
  .select("#treemap")
  .attr("width", width)
  .attr("height", height);

const tooltip = d3.select("#tooltip");

// start hidden
tooltip
  .style("opacity", 0)
  .style("visibility", "hidden");

const color = d3.scaleOrdinal(d3.schemeCategory10);

const url =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";

d3.json(url).then((data) => {
  const root = d3
    .hierarchy(data)
    .sum((d) => d.value)
    .sort((a, b) => b.value - a.value);

  d3
    .treemap()
    .size([width, height])
    .paddingInner(1)(root);

  const leaves = root.leaves();

  const categories = [...new Set(leaves.map((d) => d.data.category))];
  color.domain(categories);

  const cells = svg
    .selectAll("g")
    .data(leaves)
    .enter()
    .append("g")
    .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

  // tiles
  cells
    .append("rect")
    .attr("class", "tile")
    .attr("data-name", (d) => d.data.name)
    .attr("data-category", (d) => d.data.category)
    .attr("data-value", (d) => d.data.value)
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0)
    .attr("fill", (d) => color(d.data.category))
    .on("mouseover", (event, d) => {
      tooltip
        .style("visibility", "visible")
        .style("opacity", 1)
        .attr("data-value", d.data.value)
        .html(
          `${d.data.name}<br>${d.data.category}<br>${d.data.value.toLocaleString()}`
        )
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 30 + "px");
    })
    .on("mousemove", (event) => {
      tooltip
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 30 + "px");
    })
    .on("mouseout", () => {
      tooltip
        .style("opacity", 0)
        .style("visibility", "hidden");
    });

  // labels inside tiles
  cells
    .append("text")
    .selectAll("tspan")
    .data((d) => d.data.name.split(/(?=[A-Z][^A-Z])/g))
    .enter()
    .append("tspan")
    .attr("x", 4)
    .attr("y", (_, i) => 12 + i * 10)
    .text((d) => d)
    .attr("font-size", "10px");

  // legend
  const legendWidth = 500;
  const legendRectSize = 18;
  const legendPadding = 10;
  const itemsPerRow = 4;

  const legendSvg = d3
    .select("#legend")
    .append("svg")
    .attr("width", legendWidth)
    .attr(
      "height",
      legendRectSize * 2 +
        legendPadding * 2 +
        Math.ceil(categories.length / itemsPerRow) * 20
    );

  const legend = legendSvg
    .selectAll(".legend-item-group")
    .data(categories)
    .enter()
    .append("g")
    .attr("class", "legend-item-group")
    .attr("transform", (d, i) => {
      const x =
        (i % itemsPerRow) * (legendWidth / itemsPerRow) + legendPadding;
      const y =
        Math.floor(i / itemsPerRow) * (legendRectSize + 20) + legendPadding;
      return `translate(${x},${y})`;
    });

  legend
    .append("rect")
    .attr("class", "legend-item")
    .attr("width", legendRectSize)
    .attr("height", legendRectSize)
    .attr("fill", (d) => color(d));

  legend
    .append("text")
    .attr("x", legendRectSize + 6)
    .attr("y", legendRectSize - 4)
    .text((d) => d)
    .attr("font-size", "12px")
    .attr("alignment-baseline", "middle");
});
