/*
*    main.js
*    Mastering Data Visualization with D3.js
*    2.5 - Activity: Adding SVGs to the screen
*/

let data = [25, 20, 10, 12, 15];

let svg = d3.select("#chart-area").append("svg").attr("width", 400).attr("height", 400);

// let circle = svg.append("circle").attr("cx", 200).attr("cy", 200).attr("r", 100).attr("fill", 'green');

let circles = svg.selectAll("circle").data(data);

circles.enter()
    .append("circle")
      .attr("cx", (d, i) => {
        console.log("Item: ", d, "Index: ", i);
        return (i * 50) + 25;
      })
      .attr("cy", 200)
      .attr("r", (d) => {
        console.log("R Item: ", d)
        return d;
      })
      .attr("fill", "red");

// let rectangle = svg.append("rect").attr("x", 125).attr("y", 30).attr("width", 150).attr("height", 60).attr("fill", 'blue');

// let line = svg.append("line").attr("x1", 275).attr("y1", 275).attr("x2", 325).attr("y2", 325).attr("stroke", "purple").attr("stroke-width", 5);

// let ellipse = svg.append("ellipse").attr("cx", 75).attr("cy", 275).attr("rx", 25).attr("ry", 40).attr("fill", "grey");
