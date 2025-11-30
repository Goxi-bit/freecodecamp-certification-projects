const educationDataUrl =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
const countyDataUrl =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

const svg = d3.select("#choropleth");
const tooltip = d3
  .select("#tooltip")
  .style("opacity", 0);

const width = +svg.attr("width");
const height = +svg.attr("height");

const path = d3.geoPath();

Promise.all([d3.json(countyDataUrl), d3.json(educationDataUrl)]).then(
  ([us, educationData]) => {
    const counties = topojson.feature(us, us.objects.counties).features;

    const minEdu = d3.min(educationData, (d) => d.bachelorsOrHigher);
    const maxEdu = d3.max(educationData, (d) => d.bachelorsOrHigher);

    const colorScale = d3
      .scaleQuantize()
      .domain([minEdu, maxEdu])
      .range(d3.schemeBlues[8]);

    const eduByFips = new Map(
      educationData.map((d) => [d.fips, d])
    );

    svg
      .selectAll("path")
      .data(counties)
      .enter()
      .append("path")
      .attr("class", "county")
      .attr("d", path)
      .attr("data-fips", (d) => d.id)
      .attr("data-education", (d) => {
        const county = eduByFips.get(d.id);
        return county ? county.bachelorsOrHigher : 0;
      })
      .attr("fill", (d) => {
        const county = eduByFips.get(d.id);
        return county ? colorScale(county.bachelorsOrHigher) : "#ccc";
      })
      .on("mouseover", (event, d) => {
        const county = eduByFips.get(d.id);
        if (!county) return;

        tooltip
          .style("opacity", 1)
          .attr("data-education", county.bachelorsOrHigher)
          .html(
            `${county.area_name}, ${county.state}: ${county.bachelorsOrHigher}%`
          )
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 30 + "px");
      })
      .on("mouseout", () => tooltip.style("opacity", 0));

    // State borders
    svg
      .append("path")
      .datum(
        topojson.mesh(us, us.objects.states, (a, b) => a !== b)
      )
      .attr("class", "states")
      .attr("d", path)
      .attr("fill", "none")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1);

    // Legend
    const legendWidth = 300;
    const legendHeight = 12;

    const legendSvg = d3
      .select("#legend")
      .attr("width", legendWidth)
      .attr("height", 60)
      .attr("id", "legend");

    const legendThresholds = colorScale
      .range()
      .map((color) => colorScale.invertExtent(color));

    const legendX = d3
      .scaleLinear()
      .domain([legendThresholds[0][0], legendThresholds[legendThresholds.length - 1][1]])
      .range([20, legendWidth - 20]);

    legendSvg
      .selectAll("rect")
      .data(legendThresholds)
      .enter()
      .append("rect")
      .attr("x", (d) => legendX(d[0]))
      .attr("y", 20)
      .attr("width", (d) => legendX(d[1]) - legendX(d[0]))
      .attr("height", legendHeight)
      .attr("class", "legend-item")
      .attr("fill", (d) => colorScale(d[0]));

    const legendAxis = d3
      .axisBottom(legendX)
      .tickSize(4)
      .tickFormat((d) => `${Math.round(d)}%`)
      .ticks(6);

    legendSvg
      .append("g")
      .attr("transform", `translate(0, ${20 + legendHeight})`)
      .call(legendAxis);
  }
);

