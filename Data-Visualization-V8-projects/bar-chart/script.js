const urlGDP =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

const margin = { top: 60, right: 40, bottom: 60, left: 60 };
const width = 900 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const svgBar = d3
  .select("#bar-chart")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

const tooltipBar = d3
  .select("#tooltip")
  .style("opacity", 0);

d3.json(urlGDP).then((dataset) => {
  const data = dataset.data.map((d) => ({
    date: new Date(d[0]),
    value: d[1],
    dateString: d[0],
  }));

  const xScale = d3
    .scaleBand()
    .domain(data.map((d) => d.date))
    .range([0, width])
    .padding(0);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.value)])
    .nice()
    .range([height, 0]);

  const xAxis = d3
    .axisBottom(
      d3
        .scaleTime()
        .domain(d3.extent(data, (d) => d.date))
        .range([0, width])
    )
    .ticks(10);

  const yAxis = d3.axisLeft(yScale);

  svgBar
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis);

  svgBar.append("g").attr("id", "y-axis").call(yAxis);

  svgBar
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => xScale(d.date))
    .attr("y", (d) => yScale(d.value))
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => height - yScale(d.value))
    .attr("data-date", (d) => d.dateString)
    .attr("data-gdp", (d) => d.value)
    .on("mouseover", (event, d) => {
      const dollars = d.value.toLocaleString("en-US", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      });

      tooltipBar
        .style("opacity", 1)
        .attr("data-date", d.dateString)
        .html(`${d.dateString}<br>$${dollars} Billion`)
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 40 + "px");
    })
    .on("mouseout", () => tooltipBar.style("opacity", 0));
});
