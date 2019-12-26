import { 
	// select, 
	scaleTime, 
	scaleLinear, 
	extent,
	axisLeft,
	axisBottom,
	format,
	// nest,
	// line,
	// curveBasis,
	// mouse
} from 'd3';

export const scatterplot = (selection, props) => {
	const {
		data,
		xLabel,
		yLabel,
		xDomain,
		yDomain,
		colorScale,
		// colorValue,
		opacityFilter,
		innerWidth,
		innerHeight,
		circleRadius
	} = props;
	

	const xAxisLabel = xLabel; 
	const yAxisLabel = yLabel;
	

	const gUpdate = selection.selectAll('g').data([null]);
	const gEnter = gUpdate.enter().append('g');
	const g = gUpdate.merge(gEnter);


	const xScale = scaleTime()
		.domain(xDomain)
		.range([0, innerWidth])
		.nice(); 
		
	const yScale = scaleLinear()
		.domain(yDomain)
		.range([innerHeight, 0])
		.nice();

	const xVar = d => xScale(d[xAxisLabel])
	const yVar = d => yScale(d[yAxisLabel])

	const xAxisTickFormat = number =>
		format('t')(number)
			// .replace('.0', '');

	const xAxis = axisBottom(xScale)
		// .ticks(26)
		// .tickSize(-innerHeight)
		// .tickPadding(15);
		.tickFormat(xAxisTickFormat)
	
	const xAxisG = gEnter
		.append('g').call(xAxis)
			.attr('transform', `translate(0,${innerHeight})`)
			.attr('class', 'x-axis')
	
	xAxisG.select('.domain').remove();
	
	xAxisG.append('text')
		.attr('class', 'axis-label')
		.attr('x', innerWidth / 2)
		.attr('y', 25)
		.attr('fill', 'black')
		.text(xAxisLabel);

	const yAxisTickFormat = number =>
		format('.2s')(number)
			.replace('.0', '');
	
	const yAxis = axisLeft(yScale)
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

	console.log(selection.select('.y-axis').style('width'))

	var dots = selection.selectAll('.datapoint')
		.data(data)

	var dotsEnter = dots.enter().append('circle')
		// .attr('make', d => d.make)
		// .attr('model', d => d.model)
		// .attr('url', d => d.url)
		// .transition(100)
		// 	.attr('opacity', 1)

	dotsEnter.merge(dots)
		.attr("cx", xVar)
		.attr("cy", yVar)
		.attr("r", circleRadius)
		.attr('class', 'datapoint')
		.style("fill", d => colorScale(d.model)) 
		.transition(500)
			.attr('opacity', d => opacityFilter.includes(d.model) ? 1 : 0.1)


	dots.exit()
		.transition(100)
		.attr('opacity', 0)
		.remove()

};
