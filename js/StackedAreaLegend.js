import React from 'react'
import StackedArea from './StackedArea.js'
import Legend from './Legend.js'

// Application file
class StackedAreaLegend extends React.Component {
    constructor(props) {
        super(props);

        // Set initial state
        this.state = {
            jsonData: [],
            seriesData: [],
            // nestData: [],
            // data: [],
            // legendItems: [],
            selectedLegendItems: [],
            legendLimit: 5,
            username: document.getElementById('username').getAttribute("username").toString()
        };

        // Graph width and height - accounting for margins
        this.drawWidth = this.props.width - this.props.margin.left - this.props.margin.right;
        this.drawHeight = this.props.height - this.props.margin.top - this.props.margin.bottom;

        this.onClickLegend = this.onClickLegend.bind(this)
        this.onClickChartItem = this.onClickChartItem.bind(this)
        this.onClickBackground = this.onClickBackground.bind(this)
        
        this.getLegendItems = this.getLegendItems.bind(this)
        this.colorScale = d3.scaleOrdinal(d3.schemeCategory10)
    }

    getLegendItems(data) {
        var legendItems = this.props.seriesData.map(d => d.key).sort()
        // console.log(legendItems)
        return legendItems
    }

    componentDidMount() {
        
    }
    componentDidUpdate() {
        // console.log(this.state.seriesData)
        if (this.state.seriesData != this.props.seriesData)
        {
            console.log('update')
            this.setState({jsonData: this.props.jsonData})
            this.setState({seriesData: this.props.seriesData})
            this.setState({selectedLegendItems: this.getLegendItems()})
        }

        this.colorScale 
        // = d3.scaleOrdinal(d3.schemeCategory10)
            .domain(this.getLegendItems())
    }

    onClickLegend(item) {
        console.log('legend click')

        // var currentData = this.props.seriesData
        var currentData = this.state.seriesData
        var currentSelection = this.state.selectedLegendItems
        var newSelectedLegendItems

        if (currentSelection.length == 1 && currentSelection[0] == item)
            newSelectedLegendItems = this.getLegendItems()
        else
            newSelectedLegendItems = [item]
        
        var newData = currentData.map(d => {
            d.selected = newSelectedLegendItems.includes(d.key) ? true : false
            return d
        })

        this.setState({ data: newData })
        this.setState({ selectedLegendItems: newSelectedLegendItems })
    }

    onClickChartItem(item) {
        console.log('data click')
        var currentData = this.state.seriesData
        var currentlySelected = currentData.filter(d => d.selected == true)
        var newData
        var newSelectedLegendItems

        if (currentlySelected.length == 1 && currentlySelected[0] == item){
            newData = currentData.map(d => { d.selected = true; return d })
            newSelectedLegendItems = this.getLegendItems()
        }
        else {
            newData = currentData.map(d => {
                d.selected = d==item ? true : false
                return d            
            })
            newSelectedLegendItems = [item.key]
            // console.log(newSelectedLegendItems)

        }
        this.setState({ data: newData })
        this.setState({ selectedLegendItems: newSelectedLegendItems })
    }

    onClickBackground() {
        console.log('background click')
        var currentData = this.state.seriesData
        var newSelectedLegendItems = this.getLegendItems()
        var newData = currentData.map(d => {
            d.selected = true
            return d
        })
        this.setState({ data: newData })
        this.setState({ selectedLegendItems: newSelectedLegendItems })
    }

    // dropdownUpdated(d) {
    //     console.log('dropdown updated')
    //     var newLegendBy = d.target.value
    //     var newLegendItems = [...new Set(this.props.seriesData.map(item => item[newLegendBy]))].sort()
    //     var newSelectedLegendItems = newLegendItems
    //     var newData = this.props.seriesData.map(d => {
    //         d.selected = true
    //         return d
    //     })
    //     this.setState({ legendBy: newLegendBy })
    //     this.setState({ legendItems: newLegendItems })
    //     this.setState({ selectedLegendItems: newSelectedLegendItems })
    //     this.setState({ data: newData })

    // }

    render() {
        console.log('stacked area legend render')
         return (
            // <div className="stacked-area-legend">
                <svg className="stacked-area" width={this.drawWidth} height={this.drawHeight}>
                    <StackedArea
                        width={this.props.width}
                        height={this.props.height}
                        xValue={'a'}
                        yValue={'b'}
                        seriesData={this.state.seriesData}
                        xFunction={this.props.xFunction}
                        xDomain={this.props.xDomain}
                        yDomain={this.props.yDomain}
                        jsonData={this.state.jsonData}
                        // yMax={this.yMax}
                        legendBy={this.state.legendBy}
                        legendItems={this.props.legendItems}
                        selectedLegendItems={this.state.selectedLegendItems}
                        colorScale={this.colorScale}
                        // onClickLegend={this.onClickLegend}
                        onClickChartItem={this.onClickChartItem}
                        onClickBackground={this.onClickBackground}
                        />
                    <Legend
                        chartWidth={this.props.width}
                        height={20}
                        offset={0}
                        direction={'vertical'}
                        align={'right'}
                        // data={this.props.seriesData}
                        legendItems={this.getLegendItems()}
                        selectedLegendItems={this.state.selectedLegendItems}
                        onClickLegend={this.onClickLegend}
                        onClickBackground={this.onClickBackground}
                        colorScale={this.colorScale}
                        />
                    </svg>
            // </div>
        )
    }
}

StackedAreaLegend.defaultProps = {
    data: [],
    width: 300,
    height: 300,
    radius: 5,
    spacing: 100,
    margin: {
        left: 5,
        right: 5,
        top: 0,
        bottom: 0
    },
    xTitle: "X Title",
    yTitle: "Y Title",
    xValue: "year",
    yValue: "price",
    // legendBy: "model",
    labelBy: "price",
    title: "Porsches"
};

export default StackedAreaLegend