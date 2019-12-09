(function (d3$1) {
  'use strict';

  // Mouseover line adapted from here

  const scatterplot = (selection, props) => {
    const {
      data,
      colorScale,
      colorValue,
      selectedArtist,
      innerWidth,
      innerHeight,
      circleRadius
    } = props;
    
    console.log(data); 
   
    const xValue = d => new Date(d.year);
   
    const yValue = d => d.price;
    
  	// const tooltipMargin = { left: 0, bottom: 0, right: 0, top: 0 };
   //  const tooltipLineMargin = 10;
   //  const tooltipWidth = 150;
    
    const gUpdate = selection.selectAll('g').data([null]);
    const gEnter = gUpdate.enter().append('g');
    const g = gUpdate.merge(gEnter);
    
    const xScale = d3$1.scaleTime()
      .domain(d3$1.extent(data, xValue))
      .range([0, innerWidth]);
      //.nice(); 
      
    const yScale = d3$1.scaleLinear()
      .domain(d3$1.extent(data, yValue))
      .range([innerHeight, 0])
      .nice();

    const xAxis = d3$1.axisBottom(xScale);
      // .ticks(26)
      // .tickSize(-innerHeight)
      // .tickPadding(15);
    
    const xAxisG = gEnter
    	.append('g').call(xAxis)
      .attr('transform', `translate(0,${innerHeight})`);
    
    // xAxisG.select('.domain').remove();
    
    // xAxisG.append('text')
    //   .attr('class', 'axis-label')
    //   .attr('y', 50)
    //   .attr('x', innerWidth / 2)
    //   .attr('fill', 'black')
    //   .text(xAxisLabel);

    // const yAxisTickFormat = number =>
    //   format('.2s')(number)
    //     .replace('.0', '');
    
    const yAxis = d3$1.axisLeft(yScale);
      // .tickSize(-innerWidth)
      // .tickPadding(5)
      // .tickFormat(yAxisTickFormat);
    
    const yAxisG = gEnter
    	.append('g').call(yAxis);
    
    // yAxisG.selectAll('.domain').remove();
    
    // yAxisG.append('text')
    //   .attr('class', 'axis-label')
    //   .attr('y', -35)
    //   .attr('x', -innerHeight / 2)
    //   .attr('fill', 'black')
    //   .attr('transform', `rotate(-90)`)
    //   .attr('text-anchor', 'middle')
    //   .text(yAxisLabel);

    // var legendOrdinal = d3.legendColor()
    // //d3 symbol creates a path-string, for example
    // //"M0,-8.059274488676564L9.306048591020996,
    // //8.059274488676564 -9.306048591020996,8.059274488676564Z"
    // .shape("path", d3.symbol().type(d3.symbolTriangle).size(150)())
    // .shapePadding(10)
    // //use cellFilter to hide the "e" cell
    // // .cellFilter(function(d){ return d.label !== "e" })
    // .scale(colorScale)
    // // .on('cellclick', cell => {
    // //   if (filtered.includes(cell)) {
    // //     filtered = filtered.filter(c => c != cell)
    // //   }
    // //   else {
    // //     filtered.push(cell)
    // //   }
    // //   console.log(filtered)
    // // });

    // d3.select(".legendOrdinal")
    //   .call(legendOrdinal);

      // const lines = selection.selectAll('.line-path').data(nested);
      // const linesEnter = lines.enter().append('path')
      //     .attr('class', 'line-path')
      //     .attr('stroke', d => colorScale(d.key));
          
      // lines.merge(linesEnter)
      //   .transition()
      //     .duration(200)
      //     .attr('d', d => lineGenerator(d.values))
      //     .attr('stroke-width', d => (!selectedArtist || d.key === selectedArtist) ? 1 : 0);
      
      var dots = selection.selectAll('dot').data(data);
      var dotsEnter = dots.enter().append("circle")
        .attr("cx", function (d) { return xScale(d.year); } )
        .attr("cy", function (d) { return yScale(d.price); } )
        .attr("r", circleRadius)
        .style("fill", d => colorScale(d.model));

      dots.merge(dotsEnter);
        // .attr('opacity', d => console.log(filtered.includes(d)))

      // Add dots
      // svg.append('g')
      //   .selectAll("dot")
      //   .data(data)
      //   .enter()
      //   .append("circle")
      //     .attr("cx", function (d) { return x(new Date(d.year)); } )
      //     .attr("cy", function (d) { return y(d.price); } )
      //     .attr("r", 1.5)
      //     .style("fill", d => modelScale(d.model))

    // })
     // const lineGenerator = line()
     //  .x(d => xScale(xValue(d)))
     //  .y(d => yScale(yValue(d)))
     //  .curve(curveBasis);
    

    // const nested = nest()
    //   .key(d => d.genre)
    //   .entries(data);
    
      
    // const lines = selection.selectAll('.line-path').data(nested);
    // const linesEnter = lines.enter().append('path')
    //     .attr('class', 'line-path')
    //     .attr('stroke', d => colorScale(d.key));
      	
    // lines.merge(linesEnter)
    // 	.transition()
    //   	.duration(200)
    //   	.attr('d', d => lineGenerator(d.values))
    //   	.attr('stroke-width', d => (!selectedArtist || d.key === selectedArtist) ? 1 : 0);
    
    
  };

  const colorScale = d3$1.scaleOrdinal();
  // var modelScale = d3.scaleOrdinal()
    

  const colorValue = d => d.model;
  // var genres;
  var selectedArtist;
  var data;
  const width = window.innerWidth;
  const height = window.innerHeight/2;
  const svg = d3$1.select('#dashboard').append('svg')
    .attr('width', width)
    .attr('height', height);


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
    console.log(data);
    // data = processedData.weekData;
    // genres = processedData.sortedGenres;
    data = porscheData;
    render();
  });

  const render = () => {
    colorScale
      .domain(['911', 'Cayman'])
      .range(d3$1.schemeCategory10);
    
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

}(d3));
//# sourceMappingURL=scatter.js.map
