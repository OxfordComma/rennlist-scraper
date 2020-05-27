import React from 'react'
import ReactDOM from 'react-dom'
import ErrorBoundary from './ErrorBoundary.js'
// import ScatterplotWithLegend from './ScatterplotWithLegend.js'
import Scatterplot from './Scatterplot.js'
import Legend from './Legend.js'
// import ReactTable from './Table.js'
import ReactTable from './ReactTable.js'
import GraphSidebar from './GraphSidebar'
import * as d3 from "d3";

class ScatterplotPorsches extends React.Component {
	constructor(props) {
		super(props);
		this.options = ['_model', '_submodel', 'year', 'cabriolet', 'color', 'transmission', '_generation']
		this.state = {
			jsonData: [],
			filteredJsonData: [],
			legendItems: [],
			selectedLegendItems: [],
			datum: null,
			legendBy: '_submodel',
			colorScale: d3.scaleOrdinal(d3.schemeCategory10),
			transitionSpeed: 300,
			xValue: 'year',
			yValue: '_price',
		};
		this.onLegendDropdownChange = this.onLegendDropdownChange.bind(this)
		this.onXAxisDropdownChange = this.onXAxisDropdownChange.bind(this)
		this.onYAxisDropdownChange = this.onYAxisDropdownChange.bind(this)

		this.onClickLegend = this.onClickLegend.bind(this)
		this.onClickChartItem = this.onClickChartItem.bind(this)
		this.onClickBackground = this.onClickBackground.bind(this)
		this.onClickRow = this.onClickRow.bind(this)
		this.onClickCell = this.onClickCell.bind(this)

		this.getLegendItems = this.getLegendItems.bind(this)
		this.getUniqueItems = this.getUniqueItems.bind(this)
		this.onCheckChange = this.onCheckChange.bind(this)

		this.graphRef = React.createRef()
		this.tableRef = React.createRef()

	}
	getLegendItems (data) {
			return this.getUniqueItems(data, d => d[this.state.legendBy]).sort()
	}

	getUniqueItems (data, accessor) {
			return [...new Set(data.map(accessor))].sort()
	}

	componentDidMount() {
		// var dataUrl = "../porsche_normalized_.csv"
		// d3.csv(dataUrl).then((data) => {
		var dataUrl = "http://localhost:3000/data/cars/porsche/predicted"
		d3.json(dataUrl).then((data) => {
			console.log(data)


			data = data.map(d => {
				d.selected = true; 
				return d
			})
  
			// var allLegendItems = [...new Set(data.map(item => this.state.legendBy(item)))].sort()
			var allLegendItems = this.getUniqueItems(data, d => d[this.state.legendBy])
			// console.log(allLegendItems)

			var newColorScale = this.state.colorScale
				.domain(allLegendItems)

			this.setState({ 
				jsonData: data,
				filteredJsonData: data,
				legendItems: allLegendItems,
				selectedLegendItems: allLegendItems,
				colorScale: newColorScale
			})
		});
	}

	onClickLegend(item) {
			console.log('legend click')
			// var item = event.currentTarget
			// console.log(event)
			var currentData = this.state.filteredJsonData
			var currentSelection = this.state.selectedLegendItems

			var newSelectedLegendItems
			if (currentSelection.length == 1 && currentSelection[0] == item)
					newSelectedLegendItems = this.getLegendItems(currentData)
			else
					newSelectedLegendItems = [item.toString()]
			
			var newData = currentData.map(c => {
				c.selected = newSelectedLegendItems.includes(c[this.state.legendBy].toString()) ? true : false
				return c
			})
			this.setState({ 
				filteredJsonData: newData,
				selectedLegendItems: newSelectedLegendItems
			})
	}

	onClickChartItem(item) {
			console.log('circle click')
			console.log(item)
			var currentData = this.state.filteredJsonData
			var currentlySelected = currentData.filter(d => d.selected == true)
			var newData
			var newSelectedLegendItems
			var datum

			if (currentlySelected.length == 1 && currentlySelected[0]._id == item._id) {
				newData = currentData.map(c => {
					c.selected = true
					return c
				})
				newSelectedLegendItems = this.getLegendItems(newData)
				datum = null
			}
			else {
				newData = currentData.map(c => {
					c.selected = c._id==item._id ? true : false
					return c
				})
				newSelectedLegendItems = []
				datum = newData.filter(c => c.selected)[0]
			}
			this.setState({ 
				filteredJsonData: newData,
				selectedLegendItems: newSelectedLegendItems,
				datum: datum
			})
	}

	onClickBackground(event) {
		console.log('background click')
		var currentData = this.state.filteredJsonData
		var newData = currentData.map(c => {
			c.selected = true
			return c
		})
		var newSelectedLegendItems = this.getLegendItems(currentData)

		this.setState({ 
			filteredJsonData: newData,
			selectedLegendItems: newSelectedLegendItems,
			datum: null
		})

	}

	onClickRow(event) {
		console.log('row click')
		// event.stopPropagation()

		console.log(event.currentTarget)
		var item = event.currentTarget
		console.log(item.id)
		var currentData = this.state.filteredJsonData
		var currentlySelected = currentData.filter(d => d.selected == true)
		var newData
		var newSelectedLegendItems

		if (currentlySelected.length == 1 && currentlySelected[0]._id == item.id) {
				newData = currentData.map(c => {
					c.selected = true
					return c
				})
				newSelectedLegendItems = this.getLegendItems(newData)
		}
		else {
				newData = currentData.map(c => {
					c.selected = c._id==item.id ? true : false
					return c
				})
				newSelectedLegendItems = []
		}
		this.setState({ 
			filteredJsonData: newData,
			selectedLegendItems: newSelectedLegendItems
		})
	}

	onClickCell(event) {
		console.log(event.currentTarget)

		console.log('td click')
	}

	onLegendDropdownChange(event) {
		console.log('legend dropdown change')
		var legendItem = event.target.value
		var legendBy = legendItem
		var newLegendItems = this.getUniqueItems(this.state.filteredJsonData, d => d[legendBy])

		event.preventDefault();

		this.setState({ 
			legendBy: legendBy,
			legendItems: newLegendItems,
			selectedLegendItems: newLegendItems
		})
	}

	onXAxisDropdownChange(event) {
		console.log('x-axis dropdown change')

		event.preventDefault();

		this.setState({ 
			xValue: event.target.value
		})
	}

	onYAxisDropdownChange(event) {
		console.log('y-axis dropdown change')

		event.preventDefault();

		this.setState({ 
			yValue: event.target.value
		})
	}


	onCheckChange(event) {
		console.log('onCheckChange')

		var key = event.target.getAttribute('heading')
		var val = event.target.name
		var newJsonData
		console.log(event.target.checked)

		if (!event.target.checked) {
			newJsonData = this.state.filteredJsonData.filter(d => d[key] != val.toString())
		}
		else if (event.target.checked) {
			newJsonData = this.state.filteredJsonData.concat(
				this.state.jsonData.filter(d => d[key] == val.toString())
			)
		}

		console.log(newJsonData )
		var newLegendItems = this.getUniqueItems(newJsonData, d => d[this.state.legendBy])
		// var newColorScale = this.state.colorScale
		// 	.domain(newLegendItems)

		this.setState({
			legendItems: newLegendItems,
			filteredJsonData: newJsonData,
			selectedLegendItems: newLegendItems,
			// colorScale: newColorScale
		})

	}

	render() {
		return (
			<div id='porsche-scatter' className='container'>
				<div className='sidebar'>
					<DropdownForm
						title='Legend:'
						onChange={this.onLegendDropdownChange}
						onSubmit={this.onLegendDropdownSubmit}
						options={this.options}
						default={this.state.legendBy}
						/>
					<DropdownForm
						title='X axis:'
						onChange={this.onXAxisDropdownChange}
						onSubmit={this.onXAxisDropdownSubmit}
						options={['_model', 'year', 'mileage', '_mileage', 'post_time', 'price', '_price', '^price', 'transmission', 'color']}
						default={this.state.xValue}
						/>
					<DropdownForm
						title='Y axis:'
						onChange={this.onYAxisDropdownChange}
						onSubmit={this.onYAxisDropdownSubmit}
						options={['_model', 'year', 'mileage', '_mileage', 'post_time', 'price', '_price', '^price', 'transmission', 'color']}
						default={this.state.yValue}

						/>

					<GraphSidebar 
						options={this.options}
						data={this.state.jsonData}
						filteredData={this.state.filteredJsonData}
						onCheckChange={this.onCheckChange}
						/>
					
				</div>
				<div className='chart' ref={this.graphRef}>
					<svg className="scatter" 
						width={this.graphRef.current?.offsetWidth}
						height={this.graphRef.current?.offsetHeight}
						>
						<Scatterplot
							width={this.graphRef.current?.offsetWidth}
							height={this.graphRef.current?.offsetHeight}
							xValue={this.state.xValue}
							yValue={this.state.yValue}
							transitionSpeed={this.state.transitionSpeed}
							data={this.state.filteredJsonData}
							legendBy={this.state.legendBy}
							selectedLegendItems={this.state.selectedLegendItems}
							colorScale={this.state.colorScale}
							onClickLegend={this.onClickLegend}
							onClickChartItem={this.onClickChartItem}
							onClickBackground={this.onClickBackground}
						/>
					</svg>
				</div>
				<div className='legend-container'>
					<svg width='10vw' height='100vh'>
					<Legend
						chartWidth={this.drawWidth}
						offset={0}
						direction={'vertical'}
						align={'left'}
						legendItems={this.state.legendItems}
						selectedLegendItems={this.state.selectedLegendItems}
						onClickLegend={this.onClickLegend}
						onClickBackground={this.onClickBackground}
						colorScale={this.state.colorScale}
						legendBy={this.state.legendBy}
						/>
					</svg>
				</div>
				<div>
					<DataPoint 
						datum={this.state.datum} 
						options={
							['_id', 'year', 'make', 'model', 'submodel', 'info', 'mileage', 
							'transmission', 'color', 'price', '^price',
							'_mileage', '_options', '_price']}
							/>
					<div className='table' ref={this.tableRef}>
						<ReactTable 
							data={this.state.filteredJsonData.filter(d => d.selected)}
							columns={['_id', 'year', 'make', 'model', 'info', 'mileage', 'transmission', 'color', 'price', '^price']}
							// columns={[...new Set(this.state.jsonData.reduce((acc, curr) => acc.concat(Object.keys(curr)), []) )]}
							onClickRow={this.onClickRow}
							// onClickCell={this.onClickCell}
							keyBy={'_id'}
							/>
					</div>
				</div>

				{
				///*
					
				//*/
			}
			</div>
		)
	}
}

var DataPoint = function(props) {
	var options = props.options.filter(opt => opt[0] != '_')
	console.log(props.datum)
	return (
		!props.datum ? null : 
		<table>
			<tbody>
				{
					options.map(opt => {
						if (!props.datum) {
							return null
						}
						else if (props.datum['_'+opt] == undefined)  {
							return (
								<tr> 
									<td>{opt + ': ' + props.datum[opt]}</td>
									<td></td>
								</tr>
							)
						}
						else {
							return (
								<tr>
									<td>{opt + ': ' + props.datum[opt]}</td>
									<td>{'_'+opt + ': ' + props.datum['_'+opt]}</td>
								</tr>
							)
						}
					})
				}
				<tr>
				<td>
					{!props.datum ? null : 
						<a 
						href={props.datum != undefined ? props.datum['url'] : null}
						target='_blank'>
							rennlist link
					</a>}
				</td>
				<td>
				{'price diff:' + 
				parseInt(10000 * (parseInt(props.datum['_price']) - parseInt(props.datum['^price'])) / parseInt(props.datum['_price']) ) / 100
				+'%'}
				</td>
				</tr>
			</tbody>
		</table>
	)
}

var DropdownForm = function(props) {
	return (
		<span>
			{props.title}
			<form>
				<select onChange={props.onChange} onSubmit={props.onSubmit} value={props.default}>
					{props.options.map(d => <option key={d} value={ d }>{ d }</option>)}
				</select>
			</form>
		</span>
	)
}

// Render application
ReactDOM.render(
	<ErrorBoundary>
		<ScatterplotPorsches />
	</ErrorBoundary>,
	document.getElementById('root')
);


