import React from 'react'
import ReactDOM from 'react-dom'
import ErrorBoundary from './ErrorBoundary.js'
// import ScatterplotWithLegend from './ScatterplotWithLegend.js'
import Scatterplot from './Scatterplot.js'
import Legend from './Legend.js'
import Checkbox from './Checkbox.js'
import LinkFilterTable from './Table.js'
import * as d3 from "d3";

class ScatterplotPorsches extends React.Component {
	constructor(props) {
		super(props);
		this.options = ['transmission', 'model', 'cabriolet', 'turbo']
		this.state = {
			jsonData: [],
			filteredJsonData: [],
			selectedLegendItems: [],
			filterOut: [],
			optionTree: [],
			legendBy: d => d['transmission'],
		};
		// this.handleDropdownSubmit = this.handleDropdownSubmit.bind(this)
		// this.handleDropdownChange = this.handleDropdownChange.bind(this)
		// this.onChartChange = this.onChartChange.bind(this)

		this.onClickLegend = this.onClickLegend.bind(this)
    this.onClickChartItem = this.onClickChartItem.bind(this)
    this.onClickBackground = this.onClickBackground.bind(this)
    // this.dropdownUpdated = this.dropdownUpdated.bind(this)
    this.getLegendItems = this.getLegendItems.bind(this)
    this.onCheckChange = this.onCheckChange.bind(this)
    this.colorScale = d3.scaleOrdinal(d3.schemeCategory10)

  }
	getLegendItems () {
			var legendItems = [...new Set(this.state.jsonData.map(item => this.state.legendBy(item)))]
      // console.log(legendItems)
      return legendItems
  }

	componentDidMount() {
		var dataUrl = "https://localhost:3000/data/porsche"

		d3.json(dataUrl, (err, data) => {
			console.log(data)
			
			// var nest = d3.nest()
			// 	.key(this.state.legendBy)
			// 	.entries(data)
			// // console.log(nest)

			// nest = nest.map(n => {
			// 	n.values.map(d => { d.selected = true; return d })
			// 	return n
			// })
			// console.log(nest)

			data = data.map(d => {
				d.selected = true; 
				return d
			})

			this.setState({ jsonData: data })
			this.setState({ filteredJsonData: data })
			// this.setState({ nestData: nest });
			// this.setState({ selectedLegendItems: nest.map(d => d.key) })
			this.setState({ selectedLegendItems: [...new Set(data.map(item => this.state.legendBy(item)))] })

			// console.log(nest)
			var optionTree = this.options.reduce((acc, curr) => {
				acc[curr] = [...new Set(data.map(item => item[curr]))].reduce((a, c) => { a[c] = true; return a }, {})
				return acc
			}, {})

			// console.log(optionTree)
			this.setState({ optionTree: optionTree })
		});
	}

	onClickLegend(item) {
      console.log('legend click')

      // var legendBy = this.props.legendBy
      var currentData = this.state.filteredJsonData
      var currentSelection = this.state.selectedLegendItems

      var newSelectedLegendItems
      if (currentSelection.length == 1 && currentSelection[0] == item.toString())
          newSelectedLegendItems = this.getLegendItems()
      else
          newSelectedLegendItems = [item.toString()]
      
      // console.log(newSelectedLegendItems)
      var newData = currentData.map(c => {
        c.selected = newSelectedLegendItems.includes(this.state.legendBy(c).toString()) ? true : false
        return c
      })
      // console.log(newData)
      this.setState({ filteredJsonData: newData })
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
          newSelectedLegendItems = this.getLegendItems()
      }
      else {
          newData = currentData.map(c => {
            c.selected = c==item ? true : false
            return c
          })
          newSelectedLegendItems = []
      }
      this.setState({ filteredJsonData: newData })
  }

  onClickBackground() {
    console.log('background click')
    var currentData = this.state.filteredJsonData
    var newSelectedLegendItems = this.getLegendItems()
    var newData = currentData.map(c => {
      c.selected = true
      return c
    })
    this.setState({ filteredJsonData: newData })
  }

	// handleDropdownChange(event) {
	// 	var legendItem = event.target.value
	// 	var legendBy = d => d[legendItem]

	// 	event.preventDefault();

	// 	var nest = d3.nest()
	// 		.key(d => {
	// 			// console.log(d)
	// 			return legendBy(d)
	// 		})
	// 		.entries(this.state.jsonData)
		
	// 	// console.log(nest)
		
	// 	nest = nest.map(n => {
	// 		n.values.map(d => { d.selected = true; return d })
	// 		return n
	// 	})
	// 	console.log(nest)
	// 	this.setState({ legendBy: legendBy })
	// 	this.setState({ nestData: nest });
	// 	// this.onChartChange(nest)
	// 	this.setState({ selectedLegendItems: nest.map(d => d.key) })

	// 	this.colorScale 
 //      // = d3.scaleOrdinal(d3.schemeCategory10)
 //          .domain(nest.map(d => d.key).sort())
	// }

	// handleDropdownSubmit(event) {
	// 	console.log(event.target.value)
	// 	console.log('bernie sanders')
	// 	// event.preventDefault();
	// 	// this.setState({ legendBy: d => d[event.target.value] })
	// }

	onCheckChange(event) {
		console.log('onCheckChange')
		// console.log(event.target)
		if (event.target.checked == true) {
			var category = event.target.getAttribute('heading')
			var val = event.target.name
			// console.log(event.target.value)

			var optionTree = this.state.optionTree
			optionTree[category][val] = true
			var newJsonData = this.state.jsonData
			Object.keys(optionTree).map(opt => {
				Object.keys(optionTree[opt]).map(i => {
					if (optionTree[opt][i] == false)  {
						newJsonData = newJsonData.filter(d => {
							return i != d[opt].toString()
						})
					}
				})				
			})
			this.setState({
				filteredJsonData: newJsonData,
				optionTree: optionTree
			})
		}	
		else {
			var category = event.target.getAttribute('heading')
			var val = event.target.name
			// console.log(event.target.value)
			var optionTree = this.state.optionTree
			optionTree[category][val] = false

			var newJsonData = this.state.jsonData

			Object.keys(optionTree).map(opt => {
				Object.keys(optionTree[opt]).map(i => {
					if (optionTree[opt][i] == false)  {
						newJsonData = newJsonData.filter(d => {
							// console.log(optionTree[opt][i] == true && i == d[opt])
							return i != d[opt].toString()
							// return true
						})
					}
					
				})					
			})
			// console.log(newJsonData)
			this.setState({
				filteredJsonData: newJsonData,
				optionTree: optionTree
			})
		}	

	}

	render() {
		console.log(document.getElementById('graph'))
    return (
    	<div id='porsche' className='container'>
    		<div id='sidebar'>
        	<form onSubmit={this.handleDropdownSubmit} id='legendoptions'>
						{/*<select onChange={this.handleDropdownChange}>
							{this.options.map(d => <option value={ d }>{ d }</option>)}
						</select>
						*/}

						{
							this.options.map(opt => {
								var unique = [...new Set(this.state.jsonData.map(item => item[opt]))].sort()
								return (
									<div className='checkbox'>
										<ul>
											{opt}
											{
												unique.map(u => {
													return (
														<li>
															<Checkbox
																label={u.toString()}
																heading={opt}
																isSelected={
																	Object.keys(this.state.optionTree).length > 0 ? this.state.optionTree[opt][u] : true
																}
																onCheckboxChange={this.onCheckChange}
																/>
														</li>
													)
												})
											}
										</ul>
									</div>
								)
							})
						}

					</form>
					
				</div>
        <div id='graph'>
          <svg className="scatter" 
        		// width={document.getElementById('graph') ? document.getElementById('graph').offsetWidth : 0} 
        		// height={document.getElementById('graph') ? document.getElementById('graph').offsetHeight : 0}
        		viewBox={"0 0 "+(window.innerWidth)+" "+(window.innerHeight) }
        		preserveAspectRatio="xMidYMid meet"
        		>
            <Scatterplot
              width={window.innerWidth}
              height={window.innerHeight*0.5}
              // xValue={this.xVar}
              // yValue={this.yVar} 
              data={this.state.filteredJsonData}
              legendBy={this.state.legendBy}
              // legendItems={this.getLegendItems()}
              // selectedLegendItems={this.state.selectedLegendItems}
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
        <div id='table'>
	        <LinkFilterTable nestData={
						this.state.filteredJsonData
					}/>
				</div>
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


