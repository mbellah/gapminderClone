/*
*    main.js
*    Mastering Data Visualization with D3.js
*    2.8 - Activity: Your first visualization!
*/

d3.json('data/buildings.json').then((data) => {
  data.forEach((building) => {
  building.height = +building.height
  })
  console.log(data)

  let svg = d3.select("#chart-area").append("svg").attr("width", 500).attr("height", 500)

  let rectangles = svg.selectAll("rect").data(data);

  rectangles.enter().append("rect")
    .attr('x', (d, i) => {
      return (i * 50) + 25
    })
    .attr('y', 15)
    .attr('width', 40)
    .attr('height', (d) => {
        return d.height
      } )
     .attr('fill', 'orange')
})


// let rectangle = svg.append("rect").attr("x", 125).attr("y", 30).attr("width", 150).attr("height", 60).attr("fill", 'blue');
