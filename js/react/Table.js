import React from 'react'
// import { useTable, useSortBy, useFilters, useRowSelect } from 'react-table'


function Headers(props) {
	if (props.showHeaders) {
		return <thead>
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

function Body(props) {
	return <tbody>
		{
			props.data.map(d => {
				return (
					<tr key={d[props.keyBy]} id={d[props.keyBy]} onClick={props.onClickRow} >
						{ props.headers.map(key => <td key={key} style={{opacity: d.selected ? 1 : 0.1}}>{ d[key] }</td>) }
					</tr>
				)
			})
		}
	</tbody>
}

class ReactTable extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render() {		
		return (
			<table>
				<Headers 
					headers={this.props.headers} 
					showHeaders={this.props.showHeaders}/>
				<Body 
					headers={this.props.headers} 
					data={this.props.data} 
					keyBy={this.props.keyBy} 
					onClickRow={this.props.onClickRow}/>
			</table>
		)
	}

}
export default ReactTable
