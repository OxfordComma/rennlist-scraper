import React from 'react'
import ReactDOM from 'react-dom'
import ErrorBoundary from './ErrorBoundary.js'
// import ScatterplotWithLegend from './ScatterplotWithLegend.js'
import Scatterplot from './Scatterplot.js'
import Legend from './Legend.js'
import ReactTable from './Table.js'
import GraphSidebar from './GraphSidebar'
import * as d3 from "d3";

class ScatterplotPorsches extends React.Component {
	constructor(props) {
		super(props);
		this.options = ['_model', 'model', 'year', 'cabriolet']
		this.state = {
			jsonData: [],
			filteredJsonData: [],
			legendItems: [],
			selectedLegendItems: [],
			// optionTree: [],
			legendBy: d => d['_model'],
			colorScale: d3.scaleOrdinal(d3.schemeCategory10)
		};
		this.handleDropdownChange = this.handleDropdownChange.bind(this)

		this.onClickLegend = this.onClickLegend.bind(this)
		this.onClickChartItem = this.onClickChartItem.bind(this)
		this.onClickBackground = this.onClickBackground.bind(this)

		this.getLegendItems = this.getLegendItems.bind(this)
		this.getUniqueItems = this.getUniqueItems.bind(this)
		this.onCheckChange = this.onCheckChange.bind(this)

		this.graphRef = React.createRef()
	}
	getLegendItems (data) {
			return this.getUniqueItems(data, this.state.legendBy)
	}

	getUniqueItems (data, accessor) {
			return [...new Set(data.map(accessor))]
	}

	componentDidMount() {
		var dataUrl = "/data/cars/porsche"

		d3.json(dataUrl, (err, data) => {
			console.log(data)

			data = data.map(d => {
				d.selected = true; 
				return d
			})

			var allLegendItems = [...new Set(data.map(item => this.state.legendBy(item)))]
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

			var currentData = this.state.filteredJsonData
			var currentSelection = this.state.selectedLegendItems

			var newSelectedLegendItems
			if (currentSelection.length == 1 && currentSelection[0] == item.toString())
					newSelectedLegendItems = this.getLegendItems(currentData)
			else
					newSelectedLegendItems = [item.toString()]
			
			var newData = currentData.map(c => {
				c.selected = newSelectedLegendItems.includes(this.state.legendBy(c).toString()) ? true : false
				return c
			})
			this.setState({ 
				filteredJsonData: newData,
				selectedLegendItems: newSelectedLegendItems
			})
	}

	onClickChartItem(item) {
			console.log('circle click')
			var currentData = this.state.filteredJsonData
			var currentlySelected = currentData.filter(d => d.selected == true)
			var newData
			var newSelectedLegendItems

			if (currentlySelected.length == 1 && currentlySelected[0].id == item.id) {
					newData = currentData.map(c => {
						c.selected = true
						return c
					})
					newSelectedLegendItems = this.getLegendItems(newData)
			}
			else {
					newData = currentData.map(c => {
						c.selected = c==item ? true : false
						return c
					})
					newSelectedLegendItems = []
			}
			this.setState({ 
				filteredJsonData: newData,
				selectedLegendItems: newSelectedLegendItems
			})
	}

	onClickBackground() {
		console.log('background click')
		var currentData = this.state.filteredJsonData
		var newData = currentData.map(c => {
			c.selected = true
			return c
		})
		var newSelectedLegendItems = this.getLegendItems(currentData)

		this.setState({ 
			filteredJsonData: newData,
			selectedLegendItems: newSelectedLegendItems
		})

	}

	handleDropdownChange(event) {
		console.log('dropdown change')
		var legendItem = event.target.value
		var legendBy = d => d[legendItem]

		var newLegendItems = this.getUniqueItems(this.state.filteredJsonData, legendBy)

		event.preventDefault();

		this.setState({ 
			legendBy: legendBy,
			legendItems: newLegendItems,
			selectedLegendItems: newLegendItems
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
		var newLegendItems = this.getUniqueItems(newJsonData, this.state.legendBy)
		var newColorScale = this.state.colorScale
			.domain(newLegendItems)

		this.setState({
			legendItems: newLegendItems,
			filteredJsonData: newJsonData,
			selectedLegendItems: newLegendItems,
			colorScale: newColorScale
		})

	}

	render() {
		// console.log(this.graphRef.current?.offsetWidth)
		return (
			<div id='porsche' className='container'>
				<div id='sidebar'>
					<form>
						<select onChange={this.handleDropdownChange} onSubmit={this.handleDropdownSubmit}>
							{this.options.map(d => <option key={d} value={ d }>{ d }</option>)}
						</select>
					</form>

					<GraphSidebar 
						options={this.options}
						data={this.state.jsonData}
						filteredData={this.state.filteredJsonData}
						onCheckChange={this.onCheckChange}
						/>
					
				</div>
				<div id='graph' ref={this.graphRef}>
					<svg className="scatter" 
						width={this.graphRef.current?.offsetWidth}
						height={this.graphRef.current?.offsetHeight}
						>
						<Scatterplot
							width={this.graphRef.current?.offsetWidth}
							height={this.graphRef.current?.offsetHeight}
							xValue={'mileage'}
							yValue={'price'} 
							// yMin={0}
							// yMax={150000}
							data={this.state.filteredJsonData}
							legendBy={this.state.legendBy}
							selectedLegendItems={this.state.selectedLegendItems}
							colorScale={this.state.colorScale}
							onClickLegend={this.onClickLegend}
							onClickChartItem={this.onClickChartItem}
							onClickBackground={this.onClickBackground}
						/>
						<Legend
							chartWidth={this.drawWidth}
							offset={50}
							direction={'horizontal'}
							align={'left'}
							legendItems={this.state.legendItems}
							selectedLegendItems={this.state.selectedLegendItems}
							onClickLegend={this.onClickLegend}
							onClickBackground={this.onClickBackground}
							colorScale={this.state.colorScale}
							/>
						</svg>
				</div>
				{
					<div id='table'>
						<ReactTable 
							data={this.state.filteredJsonData.filter(d => d.selected)}
							headers={['_model', 'cabriolet', 'city', 'country',
								'make', 'mileage', 'model', 'price', 'state', 'transmission',
								'turbo', 'year', 'color', '^price', 'url']}
							/>
					</div>
				}
			</div>
		)
	}
}

// Render application
ReactDOM.render(
	<ErrorBoundary>
		<ScatterplotPorsches />
	</ErrorBoundary>,
	document.getElementById('root')
);


