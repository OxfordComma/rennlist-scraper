import {
  select,
  csv,
  scaleLinear,
  scaleTime,
  extent,
  axisLeft,
  axisBottom,
  scaleOrdinal,
  schemeCategory10,
  format
} from 'd3';
// import { colorLegend } from './colorLegend';
// import { loadData } from './loadData';
import { scatterplot } from './scatterplot';

const colorScale = scaleOrdinal();
// var modelScale = d3.scaleOrdinal()
  

const colorValue = d => d.model;
var selectedArtist;
var data;

const width = window.innerWidth;
const height = window.innerHeight/2
const svg = select('#dashboard').append('svg')
  .attr('width', width)
  .attr('height', height)


// const width = +svg.attr('width');
// const height = +svg.attr('height');
const margin = { top: 10, right: 10, bottom: 30, left: 40 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;
// const title = 'Porsches';

const scatterG = svg.append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`);
const colorLegendG = svg.append('g')
  .attr('transform', `translate(20, 10)`);

// svg.append('text')
//   .attr('class', 'title')
//   .attr('x', (width + margin.left) / 2)
//   .attr('y', 45)
//   .text(title);

d3.json('/cars/porsche/data/download').then(porscheData => {
  // console.log(data)
  // data = processedData.weekData;
  // genres = processedData.sortedGenres;
  data = porscheData
  render();
});

const onClick = d => {
  selectedArtist = d;
  render(); 
};

const render = () => {
  colorScale
    .domain(['911', 'Cayman'])
    .range(schemeCategory10)
  
  // colorLegendG.call(colorLegend, {
  //   colorScale,
  //   circleRadius: 7,
  //   spacing: 15,
  //   textOffset: 12,
  //   backgroundRectWidth: 135,
  //   onClick,
  //   selectedArtist
  // });
  
  
  scatterG.call(scatterplot, {
    data,
    colorScale,
    colorValue,
    selectedArtist,
    innerWidth,
    innerHeight,
    circleRadius: 3
  });
  
};
// import 'd3'

//     var filtered = []
   
//     var margin = {top: 10, right: 60, bottom: 30, left: 60},
//       width = window.innerWidth - margin.left - margin.right,
//       height = (window.innerHeight/2) - margin.top - margin.bottom;

//     // append the svg object to the body of the page
//     var svg = d3.select("#dashboard")
//       .append("svg")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//       .append("g")
//         .attr("transform",
//           "translate(" + margin.left + "," + margin.top + ")");

//     svg.append('g')
//         .attr('class', 'legendOrdinal')
//         .attr('transform', `translate(20, 20)`)

//     //Read the data
//     d3.json("/cars/porsche/data/download").then(data => {
//       // fullData = data
//       // Add X axis
//       var x = d3.scaleTime()
//         // .domain([2004, 2012])
//         .domain([new Date(2004, 0, 1), new Date(2012, 0, 1)])

//         .range([ 0, width ]);
//       svg.append("g")
//         .attr("transform", "translate(0," + height + ")")
//         .call(d3.axisBottom(x));

//       // Add Y axis
//       var y = d3.scaleLinear()
//         .domain([0, 150000])
//         .range([ height, 0]);
//       svg.append("g")
//         .call(d3.axisLeft(y));

//       var modelScale = d3.scaleOrdinal()
//         .domain(['911', 'Cayman'])
//         .range(["rgb(56, 106, 197)", "rgb(223, 199, 31)"])

//       var legendOrdinal = d3.legendColor()
//         //d3 symbol creates a path-string, for example
//         //"M0,-8.059274488676564L9.306048591020996,
//         //8.059274488676564 -9.306048591020996,8.059274488676564Z"
//         .shape("path", d3.symbol().type(d3.symbolTriangle).size(150)())
//         .shapePadding(10)
//         //use cellFilter to hide the "e" cell
//         // .cellFilter(function(d){ return d.label !== "e" })
//         .scale(modelScale)
//         .on('cellclick', cell => {
//           if (filtered.includes(cell)) {
//             filtered = filtered.filter(c => c != cell)
//           }
//           else {
//             filtered.push(cell)
//           }
//           console.log(filtered)
//         });

//       d3.select(".legendOrdinal")
//         .call(legendOrdinal);

//       // const lines = selection.selectAll('.line-path').data(nested);
//       // const linesEnter = lines.enter().append('path')
//       //     .attr('class', 'line-path')
//       //     .attr('stroke', d => colorScale(d.key));
          
//       // lines.merge(linesEnter)
//       //   .transition()
//       //     .duration(200)
//       //     .attr('d', d => lineGenerator(d.values))
//       //     .attr('stroke-width', d => (!selectedArtist || d.key === selectedArtist) ? 1 : 0);
      
//       var dots = svg.selectAll('dot').data(data)
//       var dotsEnter = dots.enter().append("circle")
//         .attr("cx", function (d) { return x(new Date(d.year)); } )
//         .attr("cy", function (d) { return y(d.price); } )
//         .attr("r", 1.5)
//         .style("fill", d => modelScale(d.model))

//       dots.merge(dotsEnter)
//         .attr('opacity', d => console.log(filtered.includes(d)))

//       // Add dots
//       // svg.append('g')
//       //   .selectAll("dot")
//       //   .data(data)
//       //   .enter()
//       //   .append("circle")
//       //     .attr("cx", function (d) { return x(new Date(d.year)); } )
//       //     .attr("cy", function (d) { return y(d.price); } )
//       //     .attr("r", 1.5)
//       //     .style("fill", d => modelScale(d.model))

//     })