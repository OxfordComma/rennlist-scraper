import React from 'react'
import ReactDOM from 'react-dom'
import ErrorBoundary from './ErrorBoundary.js'
import ScatterplotWithLegend from './ScatterplotWithLegend.js'

class ScatterplotMain extends React.Component {
	constructor(props) {
		super(props);
		this.options = ['transmission', 'model', 'cabriolet', 'turbo']
		this.state = {
			jsonData: [],
			nestData: [],
			legendBy: d => d['transmission']
		};
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleChange = this.handleChange.bind(this)
	}
	componentDidMount() {
		var dataUrl = "https://localhost:3000/data/porsche"

		d3.json(dataUrl, (err, data) => {
			console.log(data)
			
			var nest = d3.nest()
				.key(this.state.legendBy)
				.entries(data)
			// console.log(nest)
			nest = nest.map(n => {
				n.values.map(d => { d.selected = true; return d })
				return n
			})
			// console.log(nest)
			this.setState({ nestData: nest });
			this.setState({ jsonData: data })
			// console.log(this.state)
		});
	}
	// componentDidUpdate() {

	// }
	handleChange(event) {
		var legendItem = event.target.value
		var legendBy = d => d[legendItem]
		// console.log(this.state.legendBy)

		event.preventDefault();

		var nest = d3.nest()
			.key(d => {
				// console.log(d)
				return legendBy(d)
			})
			.entries(this.state.jsonData)
		
		// console.log(nest)
		
		nest = nest.map(n => {
			n.values.map(d => { d.selected = true; return d })
			return n
		})
		console.log(nest)
		this.setState({ legendBy: legendBy })
		this.setState({ nestData: nest });

	}

	handleSubmit(event) {
		// console.log(event.target.value)
		// event.preventDefault();
		// this.setState({ legendBy: d => d[event.target.value] })
	}

	render() {
		return (
			<div className='container'>
				<ScatterplotWithLegend
					width={window.innerWidth}
					height={window.innerHeight*0.9}
					data={this.state.nestData}
					legendBy={this.state.legendBy}
					/>
				<form onSubmit={this.handleSubmit} id='legendoptions'>
					<select onChange={this.handleChange}>
						{this.options.map(d => <option value={ d }>{ d }</option>)}
					</select>
				</form>

			</div>
		)
	}
}

// Render application
ReactDOM.render(
	<ErrorBoundary>
		<ScatterplotMain />
	</ErrorBoundary>,
	document.getElementById('root')
);