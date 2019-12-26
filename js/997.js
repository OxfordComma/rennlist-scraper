import {
  select,
  extent,
  scaleOrdinal,
  schemeCategory10
} from 'd3';
import { scatterplot } from './scatterplot';


const colorScale = scaleOrdinal();

var opacityFilter

var fullData, chartData;

const width = window.innerWidth;
const height = window.innerHeight/2

const xAxisHeight = 30
const yAxisWidth = 60
const svg = select('#dashboard').append('svg')
  .attr('width', width)
  .attr('height', height)


// const width = +svg.attr('width');
// const height = +svg.attr('height');
const margin = { top: 30, right: 30, bottom: xAxisHeight, left: yAxisWidth };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;
const title = 'Porsches';

const scatterG = svg.append('g')
  // .attr('class', 'scatterplot')
  .attr('transform', `translate(${margin.left},${margin.top})`);

const legendG = svg.append('g')
  .attr('class', 'legend-ordinal')
  .attr('transform', `translate(${20 + yAxisWidth}, 20)`);

var legendOrdinal = d3.legendColor()
  .shape("path", d3.symbol().type(d3.symbolTriangle).size(150)())
  .shapePadding(10)
  .scale(colorScale)
  .on('cellclick', cell => {
    opacityFilter.includes(cell) ? 
      opacityFilter = opacityFilter.filter(c => c != cell) : opacityFilter.push(cell)
    render();
  })

svg.append('text')
  .attr('class', 'title')
  .attr('x', (width + margin.left) / 2)
  .attr('y', 45)
  .text(title);

d3.json('/data/porsche').then(porscheData => {
  console.log(porscheData)
  fullData = porscheData.sort()
  chartData = fullData
  var models = [...new Set(fullData.map(item => item.model))]
  opacityFilter = models;

  const $table = $('#table')
  $(function() {
    $table.bootstrapTable( { 
      'data': fullData, 
      'onSearch': function()  {
        var tableData = $table.bootstrapTable('getData')
        chartData = fullData.filter(d => tableData.includes(d))
        render()
      },
    }) 
  })
  render();
  colorScale 
    .domain(models)
    .range(schemeCategory10)
});

const render = () => {
  legendG.call(legendOrdinal);
  
  scatterG.call(scatterplot, {
    data: chartData,
    xLabel: 'date',
    yLabel: 'price',
    xDomain: extent(fullData, d => d.year),
    yDomain: [0, 150000],//extent(fullData, d => d.price),
    colorScale,
    // colorValue,
    opacityFilter,
    innerWidth,
    innerHeight,
    circleRadius: 3
  });
  
};
