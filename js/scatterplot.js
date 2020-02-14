import React from 'react'
import * as d3 from "d3";
import { regressionLoess } from 'd3-regression'

// Scatterplot
class Scatterplot extends React.Component {
	constructor(props) {
		super(props);
		// Graph width and height - accounting for margins
		this.drawWidth = this.props.width - this.props.margin.left - this.props.margin.right;
		this.drawHeight = this.props.height - this.props.margin.top - this.props.margin.bottom;
	}
	componentDidMount() {
		this.update();
	}
	// Whenever the component updates, select the <g> from the DOM, and use D3 to manipulte circles
	componentDidUpdate() {
		this.update();
	}
	updateScales() {
		// Calculate limits
		// let xMin = d3.min(this.props.data, (d) => +d[this.props.xValue] - 1);
		var xMin = 2005
		// let xMax = d3.max(this.props.data, (d) => +d[this.props.xValue] + 1);
		var xMax = 2012
		let yMin = 0//d3.min(this.state.data, (d) => +d[yValue] * .9);
		let yMax = 150000//d3.max(this.state.data, (d) => +d[yValue] * 1.1);
		
		// Define scales
		this.xScale = d3.scaleLinear().domain([xMin, xMax]).range([0, this.drawWidth])
		this.yScale = d3.scaleLinear().domain([yMax, yMin]).range([0, this.drawHeight])
		
	}
	updatePoints() {
		// Define hovers 
		// Add tip
		// let tip = d3.tip().attr('class', 'd3-tip').html(function (d) {
		// 	return d['info'];
		// });

		let background = d3.select(this.chartArea).selectAll('rect').data([null])
		var backgroundEnter = background.enter().append('rect')
			.attr('class', 'chart-background')
			.attr('x', 0)   
			.attr('y', 0)   
			.attr('width', this.drawWidth)
			.attr('height', this.drawHeight)
			.attr('opacity', 0)

		backgroundEnter.merge(background)
			.on('click', d => this.props.onClickBackground(d))

		// console.log(this.props.data)
		// var circleGroups = d3.select(this.chartArea).selectAll('.circle-group').data(this.props.data, d=>d.key.toString())
		// var circleGroups = d3.select(this.chartArea).selectAll('.circle-group').data(this.props.data)//, d=>d._id.toString())
		
		// var circleGroupsEnter = circleGroups.enter().append('g')
		// 	.attr('class', 'circle-group')
		// 	.merge(circleGroups)
		// circleGroupsEnter.merge(circleGroups)

		// circleGroups.exit().remove()


		// Select all circles and bind data
		let circles = d3.select(this.chartArea).selectAll('circle').data(this.props.data);
		// var circles = circleGroupsEnter.selectAll('circle').data(d => d.values)

		// Use the .enter() method to get your entering elements, and assign their positions
			
		circles.enter().append('circle')
			.merge(circles)
				.on('click', d => this.props.onClickChartItem(d))
				.attr('r', (d) => this.props.radius)
				// .attr('label', (d) => d.label)
				// .on('mouseover', d => d.selected = true)
				// .on('mouseout', d => d.selected = false)
				.attr('cx', (d) => this.xScale(d[this.props.xValue]))
				.attr('cy', (d) => this.yScale(d[this.props.yValue]))
				.transition().duration(200)
					.attr('fill', (d) => this.props.colorScale(this.props.legendBy(d)) )
					.attr('pointer-events', d => d.selected == true ? 'visiblePainted' : 'none')
					.style('fill-opacity', d => d.selected == true ? 1 : 0.05)
					.style('stroke', 'black')
					.style('stroke-width', 0.5)
					.style('stroke-opacity', d => d.selected == true ? 1 : 0)


		// Use the .exit() and .remove() methods to remove elements that are no longer in the data
		circles.exit().remove();

		
		// var regressionGenerator = regressionLoess()
		// 	.x(d => d[this.props.xValue])
		// 	.y(d => d[this.props.yValue])
		// 	.bandwidth(0.25)
		// 	// .domain([2005, 2012])

		// var lineGenerator = d3.line()
		// 	.curve(d3.curveBasis)
		// 	.x(d => this.xScale(d[0]))
		// 	.y(d => this.yScale(d[1]))

		// var lines = d3.select(this.chartArea).selectAll('.regression').data(this.props.data)
		// // // var lines = circleGroupsEnter.selectAll('.regression')

		// var linesEnter = lines.enter().append('path')
		// 	.attr('class', 'regression')
		// 	.attr('stroke', d => this.props.colorScale(d.key.toString()))
		// 	.style('fill', 'none')
			
		// linesEnter.merge(lines)
		// 	.transition().duration(200)
		// 		.attr('stroke-opacity', d => 
		// 			this.props.selectedLegendItems.length == 1 && this.props.selectedLegendItems[0] == d.key.toString() ? 1 : 0.1)

		// linesEnter.merge(lines)
		// 	.datum(d => {
		// 		console.log(d)
		// 		// var regressionData = this.props.data.filter(pt => this.props.legendBy(pt) == d)
		// 		return regressionGenerator(d.values)
		// 	})
		// 	.attr('d', lineGenerator)
								

		// lines.exit().remove()
		

		// Add hovers using the d3-tip library        
		// d3.select(this.chartArea).call(tip);
	}
	updateAxes() {
		let xAxisFunction = d3.axisBottom()
			.scale(this.xScale)
			.ticks(5, 's')
			.tickFormat(number => d3.format('t')(number))

		let yAxisFunction = d3.axisLeft()
			.scale(this.yScale)
			.ticks(5, 's')
			.tickFormat(number => d3.format('.2s')(number).replace('.0', ''));

		d3.select(this.xAxis)
			.call(xAxisFunction);

		d3.select(this.yAxis)
			.call(yAxisFunction);
	}
	update() {
		this.updateScales();
		this.updatePoints();
		this.updateAxes();
	}
	render() {
		return (
			<g>
				<text transform={`translate(${this.drawWidth/2},0)`}>{this.props.title}</text>
				
				<g ref={(node) => { this.chartArea = node; }}
					transform={`translate(${this.props.margin.left}, ${this.props.margin.top})`} />
				
				<g ref={(node) => { this.xAxis = node; }}
					transform={`translate(${this.props.margin.left}, ${this.props.height - this.props.margin.bottom})`}></g>
				<g ref={(node) => { this.yAxis = node; }}
					transform={`translate(${this.props.margin.left}, ${this.props.margin.top})`}></g>

				<text className="axis-label" transform={`translate(${this.props.margin.left + this.drawWidth / 2}, 
					${this.props.height - this.props.margin.bottom + 30})`}>{this.props.xValue}</text>

				<text className="axis-label" transform={`translate(${this.props.margin.left - 30}, 
					${this.drawHeight / 2 + this.props.margin.top}) rotate(-90)`}>{this.props.yValue}</text>
			</g>
		)
	}
}

Scatterplot.defaultProps = {
	data: [{ x: 10, y: 20 }, { x: 15, y: 35 }],
	width: 300,
	height: 300,
	radius: 5,
	spacing: 100,
	color: "blue",
	margin: {
		left: 50,
		right: 100,
		top: 20,
		bottom: 50
	},
	xTitle: "X Title",
	yTitle: "Y Title",
	xValue: "year",
	yValue: "price",
	// legendBy: "model",
	labelBy: "price",
	title: "Porsches"
};

export default Scatterplot