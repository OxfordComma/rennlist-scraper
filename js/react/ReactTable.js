import React from 'react'
import { useTable, useSortBy, useFilters, useRowSelect } from 'react-table'

// function filterLessThan(rows, id, filterValue) {
// 		return rows.filter(row => {
// 			const rowValue = row.values[id]
// 			return rowValue <= filterValue
// 		})
// 	}

	const IndeterminateCheckbox = React.forwardRef(
		({ indeterminate, ...rest }, ref) => {
			const defaultRef = React.useRef()
			const resolvedRef = ref || defaultRef

			React.useEffect(() => {
				resolvedRef.current.indeterminate = indeterminate
			}, [resolvedRef, indeterminate])

			return (
				<div>
					<input type="checkbox" ref={resolvedRef} {...rest} />
				</div>
			)
		}
	)


	function SelectColumnFilter({
		column: { filterValue, setFilter, preFilteredRows, id },
	}) {
		// Calculate the options for filtering
		// using the preFilteredRows
		const options = React.useMemo(() => {
			const options = new Set()
			preFilteredRows.forEach(row => {
				options.add(row.values[id])
			})
			return [...options.values()]
		}, [id, preFilteredRows])

		// Render a multi-select box
		return (
			<select
				value={filterValue}
				onChange={e => {
					setFilter(e.target.value || undefined)
				}}
			>
				<option value="">All</option>
				{options.map((option, i) => (
					<option key={i} value={option}>
						{option}
					</option>
				))}
			</select>
		)
	}

	// function SliderColumnFilter({
	// 	column: { filterValue, setFilter, preFilteredRows, id },
	// }) {
	// 	// Calculate the min and max
	// 	// using the preFilteredRows

	// 	const [min, max] = React.useMemo(() => {
	// 		let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
	// 		let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
	// 		preFilteredRows.forEach(row => {
	// 			min = Math.min(row.values[id], min)
	// 			max = Math.max(row.values[id], max)
	// 		})
	// 		return [min, max]
	// 	}, [id, preFilteredRows])

	// 	return (
	// 		<div>
	// 			<input
	// 				type="range"
	// 				min={min}
	// 				max={max}
	// 				value={filterValue || min}
	// 				onChange={e => {
	// 					setFilter(parseInt(e.target.value, 10))
	// 				}}
	// 			/>
	// 			<button onClick={() => setFilter(undefined)}>Off</button>
	// 		</div>
	// 	)
	// }

	// // This is a custom UI for our 'between' or number range
	// // filter. It uses two number boxes and filters rows to
	// // ones that have values between the two
	// function NumberRangeColumnFilter({
	// 	column: { filterValue = [], preFilteredRows, setFilter, id },
	// }) {
	// 	const [min, max] = React.useMemo(() => {
	// 		let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
	// 		let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
	// 		preFilteredRows.forEach(row => {
	// 			min = Math.min(row.values[id], min)
	// 			max = Math.max(row.values[id], max)
	// 		})
	// 		return [min, max]
	// 	}, [id, preFilteredRows])

	// 	return (
	// 		<div
	// 			style={{
	// 				display: 'flex',
	// 			}}
	// 			>
	// 			<input
	// 				value={filterValue[0] || ''}
	// 				type="number"
	// 				onChange={e => {
	// 					const val = e.target.value
	// 					setFilter((old = []) => [val ? parseInt(val, 10) : undefined, old[1]])
	// 				}}
	// 				placeholder={`Min (${min})`}
	// 				style={{
	// 					width: '70px',
	// 					marginRight: '0.5rem',
	// 				}}
	// 			/>
	// 			to
	// 			<input
	// 				value={filterValue[1] || ''}
	// 				type="number"
	// 				onChange={e => {
	// 					const val = e.target.value
	// 					setFilter((old = []) => [old[0], val ? parseInt(val, 10) : undefined])
	// 				}}
	// 				placeholder={`Max (${max})`}
	// 				style={{
	// 					width: '70px',
	// 					marginLeft: '0.5rem',
	// 				}}
	// 			/>
	// 		</div>
	// 	)
	// }

	
function Table({ columns, data }) {
	var manualRowSelectedKey = 'selected'
	// Use the state and functions returned from useTable to build your UI
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
		selectedRowIds,
	} = useTable({
			columns,
			data,
			manualRowSelectedKey
		},
		useFilters,
		useSortBy,
		useRowSelect,
		hooks => {
			hooks.flatColumns.push(columns => [
				// Let's make a column for selection
				{
					id: 'selection',
					// The header can use the table's getToggleAllRowsSelectedProps method
					// to render a checkbox
					Header: ({ getToggleAllRowsSelectedProps }) => (
						<div>
							<IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
						</div>
					),
					// The cell can use the individual row's getToggleRowSelectedProps method
					// to the render a checkbox
					Cell: ({ row }) => (
						<div>
							<IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
						</div>
					),
				},
				...columns,
			])
		}
	)


	// data = data.filter(d => )
	// Render the UI for your table
	return (
		<table {...getTableProps()}>
			<thead>
				{headerGroups.map(headerGroup => (
					<tr {...headerGroup.getHeaderGroupProps()}>
						{headerGroup.headers.map(column => (
							<th {...column.getHeaderProps(column.getSortByToggleProps())}>
								{column.render('Header')}
								{column.canFilter ? column.render('Filter') : null}
							</th>
						))}
					</tr>
				))}
			</thead>
			<tbody {...getTableBodyProps()}>
				{rows.map(
					(row, i) => {
						prepareRow(row);
						return (
							<tr {...row.getRowProps()}>
								{row.cells.map(cell => {
									return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
								})}
							</tr>
						)}
				)}
			</tbody>
		</table>
	)
}

function LinkFilterTable({ nestData }) {
	function onRowClick(state, rowInfo, column, instance) {
		console.log(rowinfo)
		console.log(state)
		return {
			onClick: e => {
				console.log('A Td Element was clicked!')
				console.log('it produced this event:', e)
				console.log('It was in this column:', column)
				console.log('It was in this row:', rowInfo)
				console.log('It was in this table instance:', instance)
			}
		}
	}
	const columns = React.useMemo(
		() => [
			// {
				// id: 'stuff',
				// columns: [
					// {
					// 	Header: 'Selected?',
					// 	accessor: 'selected',
					// 	Filter: '',
					// 	// Filter: SelectColumnFilter,
					// },
					{
						Header: 'Year',
						accessor: row => row['year'].toString(),
						Filter: SelectColumnFilter,
						width: 200

					},
					{
						Header: 'Model',
						accessor: 'model',
						Filter: SelectColumnFilter,
						minWidth: 200
					},
					{
						Header: 'Info',
						accessor: 'info',
						Filter: '',
					},
					{
						Header: 'Price',
						accessor: 'price',
						Filter: '',
						// filter: 'between'
					},
					{
						Header: 'Mileage',
						accessor: 'mileage',
						Filter: '',
						// Filter: 'SliderColumnFilter',
						// filter: filterLessThan
					},
					{
						Header: 'Transmission',
						accessor: 'transmission',
						Filter: SelectColumnFilter,
						filter: 'includes'
					},
					{
						Header: 'Convertible?',
						accessor: row => row['cabriolet'].toString(),
						Filter: SelectColumnFilter,
						filter: 'includes'
					},
					{
						Header: 'Turbo?',
						accessor: row => row['turbo'].toString(),
						Filter: '',
						// filter: 'includes'
					},
					{
						Header: 'URL',
						accessor: 'url',
						Filter: '',
						Cell: (instance) => {
							// console.log(instance)
							return <a href={instance.cell.value}>URL</a>
						}
					},
				],
			// },
		// ],
		[]
	)

	// console.log(nestData)
	const data = React.useMemo(() => nestData)
	// console.log(columns)
	// console.log(data)

	return (
		<Table 
			columns={columns} 
			data={data} 
			getTrProps={(state, rowInfo) => ({
        onClick: () => console.log('test')
      })} 
			// getTdProps={console.log('test2')}
			/>
	)
}

class ReactTable extends React.Component {
	constructor(props) {
    super(props);
    // this.state = {
    //   data: makeData(5)
    // };
  }
	
	render() {
		
		return (
			<LinkFilterTable nestData={this.props.nestData}/>
		)
	}

}
export default ReactTable
