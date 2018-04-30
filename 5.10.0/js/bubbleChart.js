BubbleChart = function(_parentElement){
  this.parentElement = _parentElement;

  this.initVis();
};

BubbleChart.prototype.initVis = function(){
  var vis = this;

  //Define canvas dimensions
  const margin = { left: 80, right: 20, top: 50, bottom: 100 };
  const height = 500 - margin.top - margin.bottom;
  const width = 800 - margin.left - margin.right;

  //define canvas
  let g = d3.select('#bubble-chart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  //add tooltip
  let tip = d3.tip().attr('class', 'd3-tip')
    .html(function (d) {
      return (

        `<strong>Country:</strong> <span style='color:yellow'>${d.country}</span><br>
								<strong>Continent:</strong> <span style='text-transformation:capitalize; color:yellow'>${d.continent}</span><br>
								<strong>Life Expectancy:</strong> <span style='color:yellow'>${d3.format('.2f')(d.life_exp)}</span><br>
								<strong>GDP Per Capita:</strong> <span style='color:yellow'>${d3.format('$,.0f')(d.income)}</span><br>
								<strong>Population:</strong> <span style='color:yellow'>${d3.format(',.0f')(d.population)}</span><br>`
      )

    });

  //call tip
  g.call(tip);

  //scales
  let x = d3.scaleLog()
    .base(10)
    .domain([200, 150000])
    .range([0, width]);

  let y = d3.scaleLinear()
    .domain([0, 90])
    .range([height, 0]);

  let area = d3.scaleLinear()
    .domain([0, 1400000000])
    .range([25 * Math.PI, 1500 * Math.PI]);

  const continentColors = d3.scaleOrdinal(d3.schemeSet2);

  //x axis
  const xAxis = d3.axisBottom(x)
    .tickValues([400, 4000, 40000])
    .tickFormat(d3.format('$'));
  g.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0, ${height})`)
    .call(xAxis);

  //y axis
  const yAxis = d3.axisLeft(y)
    .tickFormat(d => +d);
  g.append('g')
    .attr('class', 'y axis')
    .call(yAxis);

  //Create a Legend
  const legend = g.append('g')
    .attr('transform', 'translate(' + (width - 10) + ',' + (height - 125) + ')');

  const continents = ["africa", "americas", "asia", "europe"];

  continents.forEach((continent, idx) => {
    let row = legend.append('g').attr('transform', `translate(0, ${idx * 20})`);
    row.append('rect').attr('width', 15).attr('height', 15).attr('fill', continentColors(continent));
    row.append('text').attr('x', -10).attr('y', 10)
      .attr('text-anchor', 'end')
      .attr('font-size', '12px')
      .style('text-transform', 'capitalize')
      .text(continent)
  });

  //Labels
  const xLabel = g.append('text')
    .attr('x', width / 2 + 5)
    .attr('y', height + 70)
    .attr('text-anchor', 'middle')
    .attr('font-size', '18px')
    .text('GDP Per Capita (PPP$ inflation-adjusted)');

  const yLabel = g.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -170)
    .attr('y', -40)
    .attr('text-anchor', 'middle')
    .attr('font-size', '18px')
    .text('Life Expectancy (Years)');

  const dateLabel = g.append('text')
    .attr('y', height - 10)
    .attr('x', width - 40)
    .attr('text-anchor', 'middle')
    .attr('font-size', '40px')
    .attr('opacity', '0.4')
    .text('1800');

    vis.wrangleData();
};

BubbleChart.prototype.wrangleData = function(){
  var vis = this;

  // $('#play-button').on('click', function () {
  //   let button = $(this);
  //   if (button.text() === 'Play') {
  //     button.text('Pause')
  //     interval = setInterval(step, 100);
  //   } else {
  //     button.text('Play')
  //     clearInterval(interval)
  //   }
  // });

  // $('#reset-button').on('click', function () {
  //   time = 0;
  //   vis.updateVis(filtered[0]);
  // });

  // $('#continent-select').on('change', function () {
  //   vis.updateVis(filtered[time]);
  // });

  $('#date-slider').slider({
    max: 2014,
    min: 1800,
    step: 1,
    slide: function (event, ui) {
      time = ui.value - 1800;
      vis.updateVis(filtered[time]);
    }
  })

  $("#date-slider").slider({
    max: 2014,
    min: 1800,
    step: 1,
    slide: function (event, ui) {
      time = ui.value - 1800;
      vis.updateVis(filtered[time]);
    }
  })
  vis.updateVis();
}

BubbleChart.prototype.updateVis = function(){
  var vis = this;
  function step() {
    //we have 214 years of data
    time = time < 214 ? time + 1 : 0
    update(filtered[time])
  }

  //Define our update lifecycle
  function update(zdata) {
    let t = d3.transition()
      .duration(100);

    var continent = $('#continent-select').val();

    let data = zdata.filter((d) => {
      return continent === 'all' ? true : d.continent === continent;
    })

    let circles = g.selectAll('circle').data(data, d => d.country);

    circles.exit().attr('class', 'exit').remove();

    circles.enter()
      .append('circle')
      .attr('class', 'enter')
      .attr('fill', d => continentColors(d.continent))
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
      .merge(circles)
      .transition(t)
      .attr('cx', d => x(d.income))
      .attr('cy', d => y(d.life_exp))
      .attr('r', d => Math.sqrt(area(d.population) / Math.PI));

    // Update the time label
    dateLabel.text(+(time + 1800))
    $("#year")[0].innerHTML = +(time + 1800)

    $("#date-slider").slider("value", +(time + 1800))
	// $('#year')[0].innerHTML = +(time + 1800);
	// $('#date-slider').slider('value', +(time + 1800));
  }
}
