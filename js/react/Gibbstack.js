import React from 'react'
import ReactDOM from 'react-dom'
import ErrorBoundary from './ErrorBoundary.js'
// import ScatterplotWithLegend from './ScatterplotWithLegend.js'
// import Scatterplot from './Scatterplot.js'
// import Legend from './Legend.js'
import ReactTable from './Table.js'
// import GraphSidebar from './GraphSidebar'
import * as d3 from "d3";

class Gibbstack extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [{}],
			// filteredJsonData: [],
			// legendItems: [],
			// selectedLegendItems: [],
			// colorScale: []
		};
		// this.handleDropdownChange = this.handleDropdownChange.bind(this)

		this.onClickRow = this.onClickRow.bind(this)
		// this.onClickChartItem = this.onClickChartItem.bind(this)
		// this.onClickBackground = this.onClickBackground.bind(this)

		// this.getLegendItems = this.getLegendItems.bind(this)
		// this.getUniqueItems = this.getUniqueItems.bind(this)
		// this.onCheckChange = this.onCheckChange.bind(this)

		// this.graphRef = React.createRef()
	}
	// getLegendItems (data) {
	// 		return this.getUniqueItems(data, this.state.legendBy)
	// }

	// getUniqueItems (data, accessor) {
	// 		return [...new Set(data.map(accessor))]
	// }

	componentDidMount() {
		var dataUrl = "/gibbstack.csv"

		d3.csv(dataUrl, (err, data) => {
			console.log(data)

			// data = data.map(d => {
			// 	d.selected = true; 
			// 	return d
			// })

			// var allLegendItems = [...new Set(data.map(item => this.state.legendBy(item)))]
			// console.log(allLegendItems)

			// var newColorScale = this.state.colorScale
			// 	.domain(allLegendItems)

			this.setState({ 
				data: data,
				// filteredJsonData: data,
				// legendItems: allLegendItems,
				// selectedLegendItems: allLegendItems,
				// colorScale: newColorScale
			})
		});
	}

	onClickRow(event) {
			console.log('legend click')
			var id = event.currentTarget.id
			console.log(id)
			var datum = this.state.data.filter(d => d['id'] == id)[0]
			console.log(datum)
			var url = datum.url + '&t=' + datum.timestamp
			console.log(url)
			window.open(url, '_blank')
			// console.log(item.target.getAttribute(data))
			// var currentData = this.state.filteredJsonData
			// var currentSelection = this.state.selectedLegendItems

			// var newSelectedLegendItems
			// if (currentSelection.length == 1 && currentSelection[0] == item.toString())
			// 		newSelectedLegendItems = this.getLegendItems(currentData)
			// else
			// 		newSelectedLegendItems = [item.toString()]
			
			// var newData = currentData.map(c => {
			// 	c.selected = newSelectedLegendItems.includes(this.state.legendBy(c).toString()) ? true : false
			// 	return c
			// })
			// this.setState({ 
			// 	filteredJsonData: newData,
			// 	selectedLegendItems: newSelectedLegendItems
			// })
	}

	// onClickChartItem(item) {
	// 		console.log('circle click')
	// 		var currentData = this.state.filteredJsonData
	// 		var currentlySelected = currentData.filter(d => d.selected == true)
	// 		var newData
	// 		var newSelectedLegendItems

	// 		if (currentlySelected.length == 1 && currentlySelected[0].id == item.id) {
	// 				newData = currentData.map(c => {
	// 					c.selected = true
	// 					return c
	// 				})
	// 				newSelectedLegendItems = this.getLegendItems(newData)
	// 		}
	// 		else {
	// 				newData = currentData.map(c => {
	// 					c.selected = c==item ? true : false
	// 					return c
	// 				})
	// 				newSelectedLegendItems = []
	// 		}
	// 		this.setState({ 
	// 			filteredJsonData: newData,
	// 			selectedLegendItems: newSelectedLegendItems
	// 		})
	// }

	// onClickBackground() {
	// 	console.log('background click')
	// 	var currentData = this.state.filteredJsonData
	// 	var newData = currentData.map(c => {
	// 		c.selected = true
	// 		return c
	// 	})
	// 	var newSelectedLegendItems = this.getLegendItems(currentData)

	// 	this.setState({ 
	// 		filteredJsonData: newData,
	// 		selectedLegendItems: newSelectedLegendItems
	// 	})

	// }

	// handleDropdownChange(event) {
	// 	console.log('dropdown change')
	// 	var legendItem = event.target.value
	// 	var legendBy = d => d[legendItem]

	// 	var newLegendItems = this.getUniqueItems(this.state.filteredJsonData, legendBy)

	// 	event.preventDefault();

	// 	this.setState({ 
	// 		legendBy: legendBy,
	// 		legendItems: newLegendItems,
	// 		selectedLegendItems: newLegendItems
	// 	})
	// }


	// onCheckChange(event) {
	// 	console.log('onCheckChange')

	// 	var key = event.target.getAttribute('heading')
	// 	var val = event.target.name
	// 	var newJsonData
	// 	console.log(event.target.checked)

	// 	if (!event.target.checked) {
	// 		newJsonData = this.state.filteredJsonData.filter(d => d[key] != val.toString())
	// 	}
	// 	else if (event.target.checked) {
	// 		newJsonData = this.state.filteredJsonData.concat(
	// 			this.state.jsonData.filter(d => d[key] == val.toString())
	// 		)
	// 	}

	// 	console.log(newJsonData )
	// 	var newLegendItems = this.getUniqueItems(newJsonData, this.state.legendBy)
	// 	var newColorScale = this.state.colorScale
	// 		.domain(newLegendItems)

	// 	this.setState({
	// 		legendItems: newLegendItems,
	// 		filteredJsonData: newJsonData,
	// 		selectedLegendItems: newLegendItems,
	// 		colorScale: newColorScale
	// 	})

	// }

	render() {
		// console.log(this.graphRef.current?.offsetWidth)
		return (
			<div id='gibbstack' className='container'>
				{
					<div id='table'>
						<ReactTable 
							data={this.state.data}
							headers={['artist', 'name']}
							showHeaders={false}
							keyBy={'id'}
							onClickRow={this.onClickRow}
							/>
					</div>
				}
				<div id='albumart'>
					<img src='https://lastfm.freetls.fastly.net/i/u/770x0/e95a1db7bdcc4112c1c040afc88aad94.webp#e95a1db7bdcc4112c1c040afc88aad94'/>
				</div>
			</div>

		)
	}
}

// Render application
ReactDOM.render(
	<ErrorBoundary>
		<Gibbstack />
	</ErrorBoundary>,
	document.getElementById('root')
);


