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
			albumData: [],
			albumsWithArt: [],
			selectedAlbum: null,
		};

		this.onClickRow = this.onClickRow.bind(this)
		this.onClickAlbum = this.onClickAlbum.bind(this)
		
	}
	// getLegendItems (data) {
	// 		return this.getUniqueItems(data, this.state.legendBy)
	// }

	// getUniqueItems (data, accessor) {
	// 		return [...new Set(data.map(accessor))]
	// }

	componentDidMount() {
		var dataUrl = "/gibbstack.csv"

		Promise.all([d3.csv(dataUrl), d3.csv("/albums.csv")]).then(data => {//, (err, data) => {
			console.log(data)
			var playedTracks = data[0]
			var albumData = data[1]
			
			var albumsWithArt = d3.nest()
				.key(d => d['album'])
				.rollup(v => v[0].albumart_url)
				.entries(albumData)

			albumData = albumData.map(d => {
				d.selected = playedTracks.some(t => t['track'] == d['track']); 
				return d
			})

			playedTracks = playedTracks.map(d => {
				d.selected = true
				return d
			})

			// var allLegendItems = [...new Set(data.map(item => this.state.legendBy(item)))]
			// console.log(allLegendItems)

			// var newColorScale = this.state.colorScale
			// 	.domain(allLegendItems)

			this.setState({ 
				data: playedTracks,
				albumData: albumData,
				albumsWithArt: albumsWithArt
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
			var datum = this.state.data.filter(d => d['track'] == id)[0]
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

	onClickAlbum(event) {
		var album = event.currentTarget.getAttribute('album')
		if (album == this.state.selectedAlbum)
			album = null

		console.log(album)

		this.setState({
			selectedAlbum: album
		})
	}

	

	render() {
		console.log(this.state.albumData)
		return (
			<div id='gibbstack' className='container'>
				<div id='header'>
						<h1>Ben Gibbard: Live From Home</h1>
					</div>
				<div id='table'>
					<ReactTable 
						data={this.state.selectedAlbum != null ? 
							this.state.albumData.filter(d => d['album'] == this.state.selectedAlbum) : 
							this.state.data }
						headers={this.state.selectedAlbum != null ?
							['trackindex', 'album', 'track'] : 
							['date', 'artist', 'track']}
						showHeaders={true}
						keyBy={'track'}
						onClickRow={this.onClickRow}
						/>
				</div>
				<div id='albumart'>
					
					<AlbumArt data={this.state.albumsWithArt} onClick={this.onClickAlbum}/>
					
				</div>
			</div>

		) 
	}
}
function AlbumArt(props) {
	console.log(props.data)
	
	return props.data.map(d => {
		return <img key={d.key} src={d.value} album={d.key} onClick={props.onClick} />
		
	})
}


// Render application
ReactDOM.render(
	<ErrorBoundary>
		<Gibbstack />
	</ErrorBoundary>,
	document.getElementById('root')
);


