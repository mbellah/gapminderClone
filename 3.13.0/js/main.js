/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 1 - Star Break Coffee
*/
const margin = {left: 80, right: 20, top: 20, bottom: 100};
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

let svg = d3.select("#chart-area")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate( ${margin.left} , ${margin.top})`);


  d3.json("data/revenues.json").then((data) => {
    data.forEach((d) => {
    d.revenue = +d.revenue;
    d.profit = +d.profit;
  })
    console.log(data);
    //x scale
    let x = d3.scaleBand()
      .domain(data.map(d => d.month))
      .range([0, width])
      .padding(0.21);

    //y scale
    let y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.revenue)])
        .range([height, 0]);

    let rectangles = svg.selectAll("rect").data(data);

    rectangles.enter().append("rect")
      .attr('x', (d) => x(d.month))
      .attr('y', (d) => y(d.revenue))
      .attr('width', x.bandwidth)
      .attr('height', (d) => height - y(d.revenue))
      .attr('fill', 'orange');

    //x label
    svg.append("text")
      .attr("y", height + 70)
      .attr("x", width/2)
      .attr("font-size", "16px")
      .attr("text-anchor", "middle")
      .text("Month")

      //y label
      svg.append("text")
        .attr("y", -60 )
        .attr("x", -(height / 2))
        .attr("transform", "rotate(-90)")
        .attr("font-size", "16px")
        .attr("text-anchor", "middle")
        .text("Revenue")

      let xAxis = d3.axisBottom(x);
      svg.append("g")
      //.attr("class", "x-axis") unnecessary to get it to render correctly
        .attr("transform", "translate(0," + height +")")
        .call(xAxis);

      let yAxis = d3.axisLeft(y).tickFormat(d => `$ ${d}`);
      svg.append("g")
        .call(yAxis);
});
