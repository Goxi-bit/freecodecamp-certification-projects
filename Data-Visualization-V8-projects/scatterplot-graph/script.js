const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

const margin = { top: 60, right: 40, bottom: 60, left: 60 };
const width = 900 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const svg = d3
  .select("#scatterplot")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

const tooltip = d3
  .select("#tooltip")
  .style("opacity", 0);

const color = d3
  .scaleOrdinal()
  .domain([true, false])
  .range(["#e41a1c", "#377eb8"]); // doping / no doping

d3.json(url).then((data) => {
  // Parse times as Date objects (minutes:seconds)
  data.forEach((d) => {
    const [min, sec] = d.Time.split(":").map(Number);
    d.TimeObj = new Date(Date.UTC(1970, 0, 1, 0, min, sec));
  });

  const xDomain = d3.extent(data, (d) => d.Year);
  const yDomain = d3.extent(data, (d) => d.TimeObj);

  const xScale = d3
    .scaleLinear()
    .domain([xDomain[0] - 1, xDomain[1] + 1])
    .range([0, width]);

  const yScale = d3
    .scaleTime()
    .domain(yDomain.reverse()) // fastest at top
    .range([0, height]);

  const xAxis = d3
    .axisBottom(xScale)
    .tickFormat(d3.format("d"));

  const yAxis = d3
    .axisLeft(yScale)
    .tickFormat(d3.timeFormat("%M:%S"));

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis);

  svg.append("g").attr("id", "y-axis").call(yAxis);

  // Circles
  svg
    .selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", (d) => xScale(d.Year))
    .attr("cy", (d) => yScale(d.TimeObj))
    .attr("r", 6)
    .attr("data-xvalue", (d) => d.Year)
    .attr("data-yvalue", (d) => d.TimeObj.toISOString())
    .attr("fill", (d) => color(d.Doping !== ""))
    .attr("stroke", "#000")
    .on("mouseover", (event, d) => {
      tooltip
        .style("opacity", 1)
        .attr("data-year", d.Year)
        .html(
          `${d.Name} (${d.Nationality})<br/>
           Year: ${d.Year}, Time: ${d.Time}<br/>
           ${d.Doping || "No doping allegations"}`
        )
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 40 + "px");
    })
    .on("mouseout", () => tooltip.style("opacity", 0));

  // Legend
  const legend = d3
    .select("#legend")
    .append("svg")
    .attr("width", 260)
    .attr("height", 70);

  const legendData = [
    { label: "Rider with doping allegations", value: true },
    { label: "No doping allegations", value: false },
  ];

  const legendItem = legend
    .selectAll("g")
    .data(legendData)
    .enter()
    .append("g")
    .attr("transform", (d, i) => `translate(10, ${10 + i * 25})`);

  legendItem
    .append("rect")
    .attr("class", "legend-item")
    .attr("width", 18)
    .attr("height", 18)
    .attr("fill", (d) => color(d.value));

  legendItem
    .append("text")
    .attr("x", 24)
    .attr("y", 13)
    .text((d) => d.label)
    .attr("font-size", "12px");
});

