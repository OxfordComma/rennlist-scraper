(function (d3$1) {
	'use strict';

	const scatterplot = (selection, props) => {
		const {
			data,
			xDomain,
			yDomain,
			colorScale,
			// colorValue,
			opacityFilter,
			innerWidth,
			innerHeight,
			circleRadius
		} = props;
		

		const xAxisLabel = 'year'; 
		const yAxisLabel = 'price';
		
		const gUpdate = selection.selectAll('g').data([null]);
		const gEnter = gUpdate.enter().append('g');
		const g = gUpdate.merge(gEnter);


		const xScale = d3$1.scaleTime()
			.domain(xDomain)
			.range([0, innerWidth])
			.nice(); 
			
		const yScale = d3$1.scaleLinear()
			.domain(yDomain)
			.range([innerHeight, 0])
			.nice();

		const xAxisTickFormat = number =>
			d3$1.format('t')(number);
				// .replace('.0', '');

		const xAxis = d3$1.axisBottom(xScale)
			// .ticks(26)
			// .tickSize(-innerHeight)
			// .tickPadding(15);
			.tickFormat(xAxisTickFormat);
		
		const xAxisG = gEnter
			.append('g').call(xAxis)
				.attr('transform', `translate(0,${innerHeight})`)
				.attr('class', 'x-axis');
		
		xAxisG.select('.domain').remove();
		
		xAxisG.append('text')
			.attr('class', 'axis-label')
			.attr('x', innerWidth / 2)
			.attr('y', 25)
			.attr('fill', 'black')
			.text(xAxisLabel);
		
		const yAxis = d3$1.axisLeft(yScale);
			// .tickSize(-innerWidth)
			// .tickPadding(5)
			// .tickFormat(yAxisTickFormat);
		
		const yAxisG = gEnter
			.append('g').call(yAxis)
			.attr('class', 'y-axis');
		
		yAxisG.selectAll('.domain').remove();
		
		yAxisG.append('text')
			.attr('class', 'axis-label')
			.attr('y', -50)
			.attr('x', -innerHeight / 2)
			.attr('fill', 'black')
			.attr('transform', `rotate(-90)`)
			.attr('text-anchor', 'middle')
			.text(yAxisLabel);

		console.log(selection.select('.y-axis').style('width'));

		var dots = selection.selectAll('.datapoint')
			.data(data);

		var dotsEnter = dots.enter().append('circle')
			.attr('make', d => d.make)
			.attr('model', d => d.model)
			.attr('url', d => d.url);
			// .transition(100)
			// 	.attr('opacity', 1)


		
		dotsEnter.merge(dots)
			.attr("cx", function (d) { return xScale(d.year); } )
			.attr("cy", function (d) { return yScale(d.price); } )
			.attr("r", circleRadius)
			.attr('class', 'datapoint')
			.style("fill", d => colorScale(d.model)) 
			.transition(500)
				.attr('opacity', d => opacityFilter.includes(d.model) ? 1 : 0.1);


		dots.exit()
			.transition(100)
			.attr('opacity', 0)
			.remove();

	};

	const colorScale = d3$1.scaleOrdinal();

	var opacityFilter;

	var fullData, chartData;

	const width = window.innerWidth;
	const height = window.innerHeight/2;

	const xAxisHeight = 30;
	const yAxisWidth = 60;
	const svg = d3$1.select('#dashboard').append('svg')
	  .attr('width', width)
	  .attr('height', height);


	// const width = +svg.attr('width');
	// const height = +svg.attr('height');
	const margin = { top: 30, right: 30, bottom: xAxisHeight, left: yAxisWidth };
	const innerWidth = width - margin.left - margin.right;
	const innerHeight = height - margin.top - margin.bottom;
	const title = 'Porsches';

	const scatterG = svg.append('g')
	  // .attr('class', 'scatterplot')
	  .attr('transform', `translate(${margin.left},${margin.top})`);

	const legendG = svg.append('g')
	  .attr('class', 'legend-ordinal')
	  .attr('transform', `translate(${20 + yAxisWidth}, 20)`);

	var legendOrdinal = d3.legendColor()
	  .shape("path", d3.symbol().type(d3.symbolTriangle).size(150)())
	  .shapePadding(10)
	  .scale(colorScale)
	  .on('cellclick', cell => {
	    opacityFilter.includes(cell) ? 
	      opacityFilter = opacityFilter.filter(c => c != cell) : opacityFilter.push(cell);
	    render();
	  });

	svg.append('text')
	  .attr('class', 'title')
	  .attr('x', (width + margin.left) / 2)
	  .attr('y', 45)
	  .text(title);

	d3.json('/cars/porsche/data/download').then(porscheData => {
	  console.log(porscheData);
	  fullData = porscheData.sort();
	  chartData = fullData;
	  var models = [...new Set(fullData.map(item => item.model))];
	  opacityFilter = models;

	  const $table = $('#table');
	  $(function() {
	    $table.bootstrapTable( { 
	      'data': fullData, 
	      'onSearch': function()  {
	        var tableData = $table.bootstrapTable('getData');
	        chartData = fullData.filter(d => tableData.includes(d));
	        render();
	      },
	    }); 
	  });
	  render();
	  colorScale 
	    .domain(models)
	    .range(d3$1.schemeCategory10);
	});

	const render = () => {
	  legendG.call(legendOrdinal);
	  
	  scatterG.call(scatterplot, {
	    data: chartData,
	    xDomain: d3$1.extent(fullData, d => d.year),
	    yDomain: [0, 150000],//extent(fullData, d => d.price),
	    colorScale,
	    // colorValue,
	    opacityFilter,
	    innerWidth,
	    innerHeight,
	    circleRadius: 3
	  });
	  
	};

}(d3));
//# sourceMappingURL=997.js.map
