import React from "react";
import Checkbox from './Checkbox.js'

const GraphSidebar = ({ options, data, filteredData, onCheckChange }) => (
	<form id='legendoptions'>
		{
			options.map(opt => {
				var unique = [...new Set(data.map(item => item[opt]))].filter(d => d).sort()
				// console.log(unique)
				return (
					<div className='checkbox' key={opt}>
						<ul>
							{opt}
							{
								unique.map(u => {
									// console.log(u)
									return (
										<li key={u}>
											<Checkbox
												label={u.toString()}
												heading={opt}
												isSelected={ filteredData.some(d => d[opt] == u) }
												onCheckboxChange={onCheckChange}
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
);

export default GraphSidebar;