const svg = d3.select('svg');
const width = +svg.attr('width');
const height = +svg.attr('height');

const fade = (color) => d3.interpolateRgb(color, '#fff')(0.2);
let color = d3.scaleOrdinal(d3.schemeCategory10.slice(1).map(fade));
let format = d3.format(',d');

const sumByIncome = d => d.income
const sumByGDP = d => d.gdp
const sumByPopulation = d => d.population;
const sumByLifeExpectancy = d => d.life_exp;

//create our treemap
let treemap = d3.treemap()
  .tile(d3.treemapSquarify) //d3.treemapResquarify
  .size([width, height])
  .round(true)
  .paddingInner(1);

// let tip = d3.tip().attr('class', 'd3-tip')
//   .html(function (d) {
//     return (

//       `<strong style='color:blue'>Continent:</strong> <span style='text-transformation:capitalize' style='color:blue'>${d.name}</span><br>
//       <strong style='color:blue'>GPD:</strong> <span style='color:blue'>${d3.format(',.0f')(d.gdp)}</span><br>
//       <strong style='color:blue'>Population:</strong> <span style='color:blue'>${d3.format(',.0f')(d.population)}</span><br>
// 			<strong style='color:blue'>Life Expectancy:</strong> <span style='color:blue'>${d3.format('.2f')(d.life_exp)}</span><br>
//       <strong style='color:blue'>Income:</strong> <span style='color:blue'>${d3.format('$,.0f')(d.income)}</span><br>`
//     )

//   });

//call tip
// svg.call(tip);

//get the data
d3.json('data/treemap.json', function (error, data) {
  if (error) console.log(error);

  //initialize root
let root = d3.hierarchy(data)
  .eachBefore((d) => {d.data.id = (d.parent ? `${d.parent.data.id}.` : null) + d.data.name})
  .sum(sumByGDP)
  .sort((a, b) => b.height - a.height || b.value - a.value);

//pass root
treemap(root);

let cell = svg.selectAll('g')
  .data(root.leaves())
  .enter().append('g')
  .attr('transform', function (d) { return `translate(${d.x0}, ${d.y0})`; })

cell.append('rect')
  .attr('id', function (d) { return d.data.id; })
  .attr('width', function (d) { return d.x1 - d.x0; })
  .attr('height', function (d) { return d.y1 - d.y0; })
  .attr('fill', function (d) { return color(d.parent.data.id); })
  // .on('mouseover', tip.show)
  // .on('mouseout', tip.hide)

//don't let text run into next rect
cell.append('clipPath')
  .attr('id', d => 'clip-' + d.data.id)
  .append('use')
  .attr('xlink:href', d => '#' + d.data.id);

cell.append('text')
      .attr('clip-path', d => `url(clip-${d.data.id})`)
  .selectAll('tspan')
  .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
  .enter().append('tspan')
      .attr('x', 4)
      .attr('y', function (d, i) { return 13 + i * 10; })
      .text(d => d);

cell.append('title')
      .text(function (d) { return d.data.id + '\n' + format(d.value); });

d3.selectAll('input')
  .data([sumByPopulation, sumByIncome, sumByGDP, sumByLifeExpectancy], function (d) { return d ? d.name : this.value; })
  .on('click', change);

let timeout = d3.timeout(function () {
  d3.select('input[value=\'sumByGDP\']')
    .property('checked', true)
    .dispatch('change');
}, 2000);

function change(sum) {
  timeout.stop();

  treemap(root.sum(sum));

  cell.transition()
    .duration(750)
      .attr('transform', function (d) { return `translate(${d.x0}, ${d.y0})`; })
    .select('rect')
      .attr('width', function (d) { return d.x1 - d.x0; })
      .attr('height', function (d) { return d.y1 - d.y0; });
  }
});

// //Create a Legend
// const legend = svg.append('g')
//   .attr('transform', 'translate(' + (width - 10) + ',' + (height - 125) + ')');

// const continents = ["africa", "americas", "asia", "europe"];

// continents.forEach((continent, idx) => {
//   let row = legend.append('g').attr('transform', `translate(0, ${idx * 20})`);
//   row.append('rect').attr('width', 15).attr('height', 15).attr('fill', color(continent));
//   row.append('text').attr('x', -10).attr('y', 10)
//     .attr('text-anchor', 'end')
//     .attr('font-size', '12px')
//     .style('text-transform', 'capitalize')
//     .text(continent)
// });
