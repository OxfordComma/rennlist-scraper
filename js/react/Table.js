import React from 'react'
// import { useTable, useSortBy, useFilters, useRowSelect } from 'react-table'


function Headers(props) {
	if (props.showHeaders) {
		<thead>
			<tr>
				{props.headers.map(d => {
					return <th key={d}>{d}</th>
				})}
			</tr>
		</thead>
	}
	else {
		return <thead></thead>
	}
}

class ReactTable extends React.Component {
	constructor(props) {
		super(props);
		// this.onClickRow = this.props.onClickRow.bind(this)

	}
	
	render() {
		// var key = this.props.key
		
		return (
			<table>
				<Headers headers={this.props.headers} showHeaders={this.props.showHeaders}/>
				<tbody>
					{
						this.props.data.map(d => {
							return (
								<tr key={d[this.props.keyBy]} id={d[this.props.keyBy]} onClick={this.props.onClickRow}>
									{ this.props.headers.map(key => <td key={key}>{ d[key] }</td>) }
								</tr>
							)
						})
					}
				</tbody>
			</table>
		)
	}

}
export default ReactTable
