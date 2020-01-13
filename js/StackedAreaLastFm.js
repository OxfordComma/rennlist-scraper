import React from 'react'
import ReactDOM from 'react-dom'
import ErrorBoundary from './ErrorBoundary.js'
import StackedAreaLegend from './StackedAreaLegend.js'

class StackedAreaMain extends React.Component {

	constructor(props) {
		super(props);

    Date.prototype.getWeek = function() {
      var onejan = new Date(this.getFullYear(), 0, 1);
      var weekNum = Math.ceil((((this - onejan) / 86400000) + onejan.getDay()-1)/7);
      return weekNum > 52 ? 52 : weekNum
    }

    let getWeekDateTime = function(date) {
      date = new Date(date)
      var dayFromWeek = ((date.getWeek()-1) * 7 + 1)
      var dateFromWeek = new Date(date.getFullYear(), 0, dayFromWeek)
      return dateFromWeek
    }

		this.state = {
      jsonData: [],
      nestData: [],
      seriesData: [],

      legendBy: d => d['artists'][0],
      nestBy: d => getWeekDateTime(d.listen_date),
      legendLimit: 10,
      username: document.getElementById('username').getAttribute("username").toString(),
      pages: (document.getElementById('pages').getAttribute("pages")).toString(),
    }

    this.xFunction = d => new Date(d.listen_date)
	}

	componentDidMount() {
    console.log(this.state.pages)
		var dataUrl = "https://localhost:3000/data/lastfm?username="+this.state.username+"&pages="+this.state.pages
		d3.json(dataUrl, (err, data) => {
      console.log(data)
      // Counts for each category
      var counts = d3.nest()
        .key(this.state.legendBy)
        .rollup(v => v.length)
        .entries(data)
        .sort((a, b) => b.value - a.value)

      // console.log(counts)

      var legendItems = counts.slice(0, this.state.legendLimit).map(i => i.key)
      data = data
        .map(d => { d.selected = true; return d })
        .filter(d => legendItems.includes(this.state.legendBy(d)))


      this.xMin = d3.min(data.map(d => this.state.nestBy(d)))
      this.xMax = d3.max(data.map(d => this.state.nestBy(d)))
      // console.log(this.xMin)
      // console.log(this.xMax)
      this.yMin = 0
      this.yMax = 250

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

      // console.log(nest)

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
      // console.log(toStack)
  
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
		})
	}

	render() {
		return (
			<div className="container">
				<StackedAreaLegend
					width={window.innerWidth}
					height={window.innerHeight}
          jsonData={this.state.jsonData}
					seriesData={this.state.seriesData}
          xDomain={[this.xMin, this.xMax]}
          yDomain={[this.yMin, this.yMax]}
          xFunction={this.xFunction}
          legendBy={this.state.legendBy}
          nestBy={this.state.nestBy}
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