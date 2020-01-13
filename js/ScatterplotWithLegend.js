import React from 'react'
import Scatterplot from './Scatterplot.js'
import Legend from './Legend.js'

// Application file
class ScatterplotWithLegend extends React.Component {
    constructor(props) {
        super(props);

        // Set initial state
        this.state = {
            data: [],
            // legendItems: [],
            selectedLegendItems: [],
        };

        this.drawWidth = this.props.width - this.props.margin.left - this.props.margin.right;
        this.drawHeight = this.props.height - this.props.margin.top - this.props.margin.bottom;

        this.onClickLegend = this.onClickLegend.bind(this)
        this.onClickChartItem = this.onClickChartItem.bind(this)
        this.onClickBackground = this.onClickBackground.bind(this)
        // this.dropdownUpdated = this.dropdownUpdated.bind(this)
        this.getLegendItems = this.getLegendItems.bind(this)
        this.colorScale = d3.scaleOrdinal(d3.schemeCategory10)

        this.xVar = 'year'
        this.yVar = 'price'


    }
    getLegendItems () {
        // console.log(this.props.data)
        var legendItems = this.props.data.map(d => d.key).sort()
        // console.log(legendItems)
        return legendItems
    }
    componentDidMount() {
        // console.log(this.props)
        // Load data when the component mounts
        // d3.json(this.props.dataUrl, (err, data) => {
        //     console.log(data)
        //     data = data.map(d => { d.selected = true; return d })
        //     this.setState({ data: data });
        //     this.setState({ legendItems: this.getLegendItems(data)})
        //     this.setState({ selectedLegendItems: this.getLegendItems(data) })
        // });

    }
    componentDidUpdate() { 
        // console.log(this.state.data)
        // if (this.state.data && this.state.data.length == 0) {
        //     console.log('empty')
        //     this.setState({data: this.props.data})
        // }

        if (this.state.data != this.props.data)
        {
            console.log('update')
            this.setState({data: this.props.data})
            this.setState({selectedLegendItems: this.getLegendItems()})
        }

        this.colorScale 
        // = d3.scaleOrdinal(d3.schemeCategory10)
            .domain(this.getLegendItems())
    }

    onClickLegend(item) {
        console.log('legend click')

        // var legendBy = this.props.legendBy
        var currentData = this.state.data
        var currentSelection = this.state.selectedLegendItems

        var newSelectedLegendItems
        if (currentSelection.length == 1 && currentSelection[0] == item.toString())
            newSelectedLegendItems = this.getLegendItems()
        else
            newSelectedLegendItems = [item.toString()]
        
        // console.log(newSelectedLegendItems)
        var newData = currentData.map(category => {
            category.values = category.values.map(d => {
                d.selected = newSelectedLegendItems.includes(this.props.legendBy(d).toString()) ? true : false
                return d
            })
            return category
        })
        // console.log(newData)
        this.setState({ data: newData })
        this.setState({ selectedLegendItems: newSelectedLegendItems })

    }

    onClickChartItem(item) {
        console.log('circle click')
        var currentData = this.state.data
        var currentlySelected = currentData.filter(d => d.selected == true)
        var newData
        var newSelectedLegendItems

        if (currentlySelected.length == 1 && currentlySelected[0].id == item.id) {
            newData = currentData.map(category => {
                category.values = category.values.map(d => {
                    d.selected = true
                    return d            
                })
                return category
            })
            newSelectedLegendItems = this.getLegendItems()
        }
        else {
            newData = currentData.map(category => {
                category.values = category.values.map(d => {
                    d.selected = d==item ? true : false
                    return d            
                })
                return category
            })
            newSelectedLegendItems = []

        }
        this.setState({ data: newData })
        this.setState({ selectedLegendItems: newSelectedLegendItems })
    }

    onClickBackground() {
        console.log('background click')
        var currentData = this.state.data
        var newSelectedLegendItems = this.getLegendItems()
        var newData = currentData.map(category => {
            category.values = category.values.map(d => {
                d.selected = true
                return d
            })
            return category
        })
        this.setState({ data: newData })
        this.setState({ selectedLegendItems: newSelectedLegendItems })
    }

    // dropdownUpdated(d) {
    //     console.log('dropdown updated')
    //     var newLegendBy = d.target.value
    //     var newLegendItems = [...new Set(this.state.data.map(item => item[newLegendBy]))].sort()
    //     var newSelectedLegendItems = newLegendItems
    //     var newData = this.state.data.map(d => {
    //         d.selected = true
    //         return d
    //     })
    //     this.setState({ legendBy: newLegendBy })
    //     this.setState({ legendItems: newLegendItems })
    //     this.setState({ selectedLegendItems: newSelectedLegendItems })
    //     this.setState({ data: newData })


    // }

    render() {
        // Get list of possible x and y variables
        // let options = this.state.data.length === 0 ? [] : Object.keys(this.state.data[0]);
        // options = options.filter((d) => !['_id', 'url', 'city', 'country',
            // 'description', 'info', 'make', 'modeldate', 'price', 'state', 'vendor',
            // 'vin', 'detailed_description', 'post_time', 'selected'].includes(d));

        return (
            <div className="scatter-legend">
                <svg className="scatter" width={this.drawWidth} height={this.drawHeight}>
                    <Scatterplot
                        width={this.drawWidth}
                        height={this.drawHeight}
                        xValue={this.xVar}
                        yValue={this.yVar} 
                        data={this.state.data}
                        legendBy={this.props.legendBy}
                        legendItems={this.getLegendItems()}
                        selectedLegendItems={this.state.selectedLegendItems}
                        colorScale={this.colorScale}
                        onClickLegend={this.onClickLegend}
                        onClickChartItem={this.onClickChartItem}
                        onClickBackground={this.onClickBackground}
                    />
                    <Legend
                        width={this.props.width}
                        height={20}
                        legendItems={this.getLegendItems()}
                        selectedLegendItems={this.state.selectedLegendItems}
                        onClickLegend={this.onClickLegend}
                        onClickBackground={this.onClickBackground}
                        colorScale={this.colorScale}
                    />
                </svg>
            </div>
        )
    }
}
ScatterplotWithLegend.defaultProps = {
    data: [{key: "key", value: []}],
    width: 300,
    height: 300,
    radius: 5,
    spacing: 100,
    color: "blue",
    margin: {
        left: 5,
        right: 5,
        top: 5,
        bottom: 5
    },
    xTitle: "X Title",
    yTitle: "Y Title",
    xValue: "year",
    yValue: "price",
    // legendBy: "model",
    labelBy: "price",
    title: "Porsches"
};

export default ScatterplotWithLegend