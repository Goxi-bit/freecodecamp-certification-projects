

const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    const baseTemp = data.baseTemperature;
    const dataset = data.monthlyVariance.map((d) => ({
      year: d.year,
      month: d.month,
      temp: baseTemp + d.variance,
    }));

    const margin = { top: 60, right: 50, bottom: 100, left: 100 };
    const width = 1200 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3
      .select("#heatmap")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const years = dataset.map((d) => d.year);
    const months = dataset.map((d) => d.month);

    const xScale = d3
      .scaleBand()
      .domain([...new Set(years)])
      .range([0, width]);

    const yScale = d3
      .scaleBand()
      .domain([...new Set(months)])
      .range([0, height]);

    const colorScale = d3
      .scaleQuantize()
      .domain([d3.min(dataset, (d) => d.temp), d3.max(dataset, (d) => d.temp)])
      .range(["#313695", "#74add1", "#fdae61", "#a50026"]); // mind. 4 Farben

    const xAxis = d3
      .axisBottom(xScale)
      .tickValues(xScale.domain().filter((year) => year % 10 === 0));

    const yAxis = d3
      .axisLeft(yScale)
      .tickFormat((d) => d3.timeFormat("%B")(new Date(0, d - 1)));

    svg
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svg.append("g").attr("id", "y-axis").call(yAxis);

    const tooltip = d3.select("#tooltip");

    svg
      .selectAll(".cell")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("class", "cell")
      .attr("data-year", (d) => d.year)
      .attr("data-month", (d) => d.month - 1)
      .attr("data-temp", (d) => d.temp)
      .attr("x", (d) => xScale(d.year))
      .attr("y", (d) => yScale(d.month))
      .attr("width", xScale.bandwidth())
      .attr("height", yScale.bandwidth())
      .attr("fill", (d) => colorScale(d.temp))
      .on("mouseover", (event, d) => {
        tooltip
          .style("opacity", 1)
          .html(
            `${d.year} - ${d3.timeFormat("%B")(
              new Date(0, d.month - 1)
            )}: ${d.temp.toFixed(2)}°C`
          )
          .attr("data-year", d.year)
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 30 + "px");
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      });

    // Legende
    const legendWidth = 400;
    const legendHeight = 20;
    const legendValues = colorScale.range();

    const legend = svg
      .append("g")
      .attr("id", "legend")
      .attr(
        "transform",
        `translate(${width / 2 - legendWidth / 2},${height + 50})`
      );

    legend
      .selectAll("rect")
      .data(legendValues)
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * (legendWidth / legendValues.length))
      .attr("y", 0)
      .attr("width", legendWidth / legendValues.length)
      .attr("height", legendHeight)
      .attr("fill", (d) => d);

    const legendScale = d3
      .scaleLinear()
      .domain(d3.extent(dataset, (d) => d.temp))
      .range([0, legendWidth]);

    const legendAxis = d3.axisBottom(legendScale).ticks(5);

    legend
      .append("g")
      .attr("transform", `translate(0,${legendHeight})`)
      .call(legendAxis);
  });

