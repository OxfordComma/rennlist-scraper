import React from 'react'
import ReactDOM from 'react-dom'
import ErrorBoundary from './ErrorBoundary.js'
// import ScatterplotWithLegend from './ScatterplotWithLegend.js'
import Scatterplot from './Scatterplot.js'
import Legend from './Legend.js'
import Checkbox from './Checkbox.js'
// import ReactTable from './Table.js'
import * as d3 from "d3";

class ScatterplotPorsches extends React.Component {
	constructor(props) {
		super(props);
		this.options = ['_model']
		this.state = {
			jsonData: [],
			filteredJsonData: [],
			selectedLegendItems: [],
			optionTree: [],
			legendBy: d => d['_model'],
		};
		// this.handleDropdownSubmit = this.handleDropdownSubmit.bind(this)
		// this.handleDropdownChange = this.handleDropdownChange.bind(this)
		// this.onChartChange = this.onChartChange.bind(this)

		// this.onClickLegend = this.onClickLegend.bind(this)
		// this.onClickChartItem = this.onClickChartItem.bind(this)
		// this.onClickBackground = this.onClickBackground.bind(this)
		// // this.dropdownUpdated = this.dropdownUpdated.bind(this)
		// this.getLegendItems = this.getLegendItems.bind(this)
		// this.onCheckChange = this.onCheckChange.bind(this)
		// this.colorScale = d3.scaleOrdinal(d3.schemeCategory10)
		this.graphRef = React.createRef()
	}

	processData(data) {
		// var startDate = 

	}
	getLegendItems () {
			var legendItems = [...new Set(this.state.jsonData.map(item => this.state.legendBy(item)))]
			return legendItems
	}

	componentDidMount() {
		var dataUrl = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv"

		d3.csv(dataUrl, (err, data) => {
			console.log(data)

			processedData = processData(data)

			this.setState({ data: processedData })
		});
	}
	render() {
		return (
			<div id='covid19' className='container'>
				<div id='sidebar'>
					
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
							colorScale={this.colorScale}
							onClickLegend={this.onClickLegend}
							onClickChartItem={this.onClickChartItem}
							onClickBackground={this.onClickBackground}
						/>
						<Legend
							chartWidth={this.drawWidth}
							offset={50}
							direction={'horizontal'}
							align={'left'}
							legendItems={this.getLegendItems()}
							selectedLegendItems={this.state.selectedLegendItems}
							onClickLegend={this.onClickLegend}
							onClickBackground={this.onClickBackground}
							colorScale={this.colorScale}
							/>
						</svg>
				</div>
				{/*
					<div id='table'>
						<ReactTable nestData={
							this.state.filteredJsonData
						}/>
					</div>
				*/}
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


