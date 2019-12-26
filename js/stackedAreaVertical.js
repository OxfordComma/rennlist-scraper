import { 
  // select, 
  scaleTime, 
  scaleLinear, 
  // extent,
  axisLeft,
  axisBottom,
  // format,
  area,
  // stack,
  max,
  sum
  // csv
} from 'd3';
// import { colorLegend } from './colorLegend';

export const stackedAreaVertical = (selection, props) => {
  const {
    dataToStack,
    topArtists,
    colorScale,
    selectedLegendList,
    width,
    height,
    numArtists,
    onClick,
    year,
    amplitude,
    position,
    stackOffset,
    stackOrder
  } = props;

  const topArtistsTrimmed = topArtists.slice(0, numArtists);
  const margin = {left: 0, right: 0}
  const innerWidth = width - margin.left - margin.right
  
  selection
    .attr('transform', `rotate(-90)`);

  const g = selection.selectAll('.container').data([null]);
  const gEnter = g.enter()
    .append('g')
      .attr('class', 'container');

  // const h = selection.selectAll('.axes').data([null]);
  // const hEnter = h.enter()
  //   .append('g')
  //     .attr('class', 'axes');

  const artistText = selection.selectAll('.artist-text').data(selectedLegendList)
  const artistTextEnter = artistText.enter().append('g')
      .attr('class', 'artist-text d-block d-md-none')
      .attr('transform', 'translate(-20, 95) rotate(90)')
  
  artistTextEnter.merge(artistText)
    .append('text')
      .transition()
        .duration(500)
      .attr('x', '0')
      .attr('y', '0')
      .attr('fill', d => colorScale(d))
      .text(d => d)

  artistText.exit()
    .remove()
 
  // const xValue = d => d.week;

  // const xAxisLabel = 'Week';
  // const yAxisLabel = 'Plays';
  
  // X-axis and scale
  // This converts from the week scale to a day scale
  const getDateFromWeek = (weekNumber) => {
    const numberOfDays = 7*(weekNumber-1)+1;
    return new Date(year, 0, numberOfDays);
  }

  const xScale = scaleTime()
    .domain([
      new Date(year, 0, 1), 
      new Date(year, 11, 31)])
      // getDateFromWeek(max(Object.keys(dataToStack).map(d => parseInt(d, 10))))])
    .range([0, -height])
    // .nice()

  const yScale = scaleLinear()
    .domain([0, max(dataToStack.map(d => sum(Object.values(d))))])
    .range([0, width * amplitude])
    .nice(); 
  
  const xAxis = axisBottom(xScale)
    .ticks(12)
    .tickSize(0)
    // .tickPadding(15)
    .tickFormat(d3.timeFormat('%B'));
  
  const xAxisG = g.select('.x-axis');
  const xAxisGEnter = gEnter
    .append('g').attr('class', 'x-axis');
  
  xAxisGEnter
    .merge(xAxisG)
      .call(xAxis)
      .selectAll('text')
        .attr('text-anchor', 'start')
        .attr('transform', `rotate(90) translate(50, 0)`);

  xAxisGEnter.merge(xAxisG).selectAll('.domain').remove()
  
  // xAxisGEnter.append('text')
  //     .attr('class', 'axis-label')
  //     .attr('transform', `rotate(90)`)
  //     .attr('y', 50)
  //     .attr('x', 0 / 2)
  //     .attr('fill', 'black')
  //     .text(xAxisLabel);
 
  // const yAxisTickFormat = number =>
  //   format('.2s')(number)
  //     .replace('.0', '');
  
  const yAxis = axisLeft(yScale)
    .ticks('none')
    // .tickSize(-width)
    // .tickPadding(5)
    // .tickFormat(yAxisTickFormat);
  
  const yAxisG = g.select('.y-axis');
  const yAxisGEnter = gEnter
    .append('g')
      .attr('class', 'y-axis');
  
  yAxisGEnter
    .merge(yAxisG)
      .transition().duration(200)
      .call(yAxis);
  
  yAxisGEnter.merge(yAxisG).selectAll('.domain').remove();
  
  // yAxisGEnter.append('text')
  //   .attr('class', 'axis-label')
  //   .attr('y', -35)
  //   .attr('x', -height / 2)
  //   .attr('fill', 'black')
  //   .attr('transform', `rotate(-90)`)
  //   .attr('text-anchor', 'middle')
  //   .text(yAxisLabel);
  
  var stack = d3.stack(dataToStack)
    .keys(topArtistsTrimmed)
    .offset(stackOffset)
    .order(stackOrder)

  var series = stack(dataToStack);

  const areaGenerator = area()
    .x(d => {
      // console.log(xScale(getDateFromWeek(d.data.week)))
      return xScale(getDateFromWeek(d.data.week))
    })
    .y0(d => yScale(selectedLegendList.length != 0 && (selectedLegendList.includes(d.artist)) ? 0 : d[0]))
    .y1(d => yScale(selectedLegendList.length != 0 && (selectedLegendList.includes(d.artist)) ? d[1] - d[0] : d[1]))
    .curve(d3.curveBasis);
  
  // const lastYValue = d =>
  //   yValue(d.values[d.values.length - 1]);
  
  const lines = selection.selectAll('.line-path').data(series);

  const linesEnter = lines.enter()
    .append('path')
      .attr('class', 'line-path') 
      .attr('fill', d => colorScale(d.key))
      .attr('transform', `translate(0, ${(width)/2 + position})`)

  lines.merge(linesEnter)
    .on('click', d => onClick(d.key))
    .attr('d', areaGenerator)
    .append('title')
      .text(d => d.key)
  
  lines.merge(linesEnter)
    .transition()
      .duration(200)
        .attr('opacity', d => {
          return (selectedLegendList.length == 0 || selectedLegendList.includes(d.key)) ? 1 : 0.1})
        .attr('stroke-width', d => (selectedLegendList.length != 0 || selectedLegendList.includes(d.key)) ? 0.05 : 0);

  // const annotations = []
  // csv('https://raw.githubusercontent.com/OxfordComma/oxfordcomma.github.io/master/concert_dates.csv').then(annotationData => {
  //   console.log(annotationData)
  //   annotationData.forEach(a => {
  //     a.date = new Date(a.date)
  //     // console.log(a.date)
  //     // console.log(xScale(a.date))
  //     annotations.push({
  //       note: {
  //         title: a.artists,
  //         label: a.date.getMonth()+1 + '/' + a.date.getDate() + ' at ' + a.venue
  //       },
  //       x: 0,
  //       y: -xScale(a.date), 
  //       dx: 0,
  //       dy: 0,
  //       connector: {
  //         curve: d3.curveLinear,
  //         points: [[0, 0]]
  //       },
  //       color: 'black'
  //     })
  //   });

  //   const makeAnnotations = d3.annotation()
  //   .editMode(true)
  //   //also can set and override in the note.padding property
  //   //of the annotation object
  //   .notePadding(15)
  //   .type(d3.annotationCallout)
  //   .annotations(annotations)

  //   d3.select(".stacked-area-container")
  //     .append("g")
  //     .attr("class", "annotation-group")
  //     .attr('transform', 'rotate(90)')
  //     .call(makeAnnotations)
  //   console.log(annotations)

  // });

  
};
