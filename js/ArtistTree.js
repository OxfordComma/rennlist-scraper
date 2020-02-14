import React from 'react'
import ReactDOM from 'react-dom'
import ErrorBoundary from './ErrorBoundary.js'
import StackedAreaLegend from './StackedAreaLegend.js'

class StackedAreaMain extends React.Component {
	constructor(props) {
		super(props);

    Date.prototype.getWeek = function() {
        var onejan = new Date(this.getFullYear(), 0, 1);
        var weekNum = Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
        return weekNum > 52 ? 52 : weekNum
    }

		this.state = {
      jsonData: [],
      nestData: [],
      seriesData: [],

      legendBy: d => d['artists'][0],
      nestBy: d => new Date(d.listen_date).getWeek().toString(),

      legendLimit: 5,
      username: document.getElementById('username').getAttribute("username").toString(),
      year: 2020
    }
	}

	componentDidMount() {
		var dataUrl = "https://localhost:3000/data/lastfm?username="+this.state.username
		d3.json(dataUrl, (err, data) => {
      console.log(new Date(data[0].listen_date).getFullYear() == this.state.year)
      data = data.filter(d => new Date(d.listen_date).getFullYear() == this.state.year)
      console.log(data)

      // Counts for each category
      var counts = d3.nest()
        .key(this.state.legendBy)
        .rollup(v => v.length)
        .entries(data)
        .sort((a, b) => b.value - a.value)

      console.log(counts)

      var legendItems = counts.slice(0, this.state.legendLimit).map(i => i.key)
      data = data
        .map(d => { d.selected = true; return d })
        .filter(d => legendItems.includes(this.state.legendBy(d)))
      console.log(data)

      // Data by week
      var obj = {}
      legendItems.forEach(l => obj[l] = 0)
      // console.log(obj)     
      
      // dataByWeek
      // needs to be .object in order to stack properly
      var nest = d3.nest()
        .key(this.state.nestBy)
        .key(this.state.legendBy)
        .rollup(v => {
            // console.log(v)
            return v.length
        })
        .object(data)

      console.log(nest)

      // Reconfigure for stacking
      var toStack = Object.keys(nest).map(k => {
        var toReturn = { key: k, ...nest[k] }
        console.log(toReturn)
        return toReturn
      })

      // Add in missing values for 0 
      toStack.forEach(n => {
        legendItems.forEach(d => {
          if (!(d in n))
            n[d] = 0
        })
      })
      console.log(toStack)
  
      var stack = d3.stack()
          .keys(legendItems)
          .offset(d3.stackOffsetWiggle)
          .order(d3.stackOrderInsideOut)
      // console.log(stack)

      var series = stack(toStack)

      // dataToStack
      series = series.map(d => { d.selected = true; return d })
      console.log(series)

      this.setState({ jsonData: data })
      this.setState({ nestData: nest })
      this.setState({ seriesData: series });
      // this.setState({ legendItems: legendItems })
      // this.setState({ selectedLegendItems: legendItems })
      // console.log(this.state)
		})
	}

	render() {
		return (
			<div className="container">
				<StackedAreaLegend
					width={window.innerWidth}
					height={window.innerHeight}
					data={this.state.seriesData}
          year={this.state.year}
					// seriesData={this.state.seriesData}
          legendBy={this.state.legendBy}
          nestBy={this.state.nestBy}
					// legendItems={this.state.legendItems}
					// selectedLegendItem={this.state.legendItems}
					/>
			</div>
		)
	}
}

// Render application
ReactDOM.render(
	<ErrorBoundary>
		<StackedAreaMain/>
	</ErrorBoundary>,
	document.getElementById('root')
);