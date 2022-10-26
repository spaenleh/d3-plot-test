import './style.css';
import javascriptLogo from './javascript.svg';
import { setupCounter } from './counter.js';
import * as d3 from 'd3';

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/histogram
function Histogram(
  data,
  {
    value = (d) => d, // convenience alias for x
    domain, // convenience alias for xDomain
    label, // convenience alias for xLabel
    format, // convenience alias for xFormat
    type = d3.scaleLinear, // convenience alias for xType
    x = value, // given d in data, returns the (quantitative) x-value
    y = () => 1, // given d in data, returns the (quantitative) weight
    thresholds = 40, // approximate number of bins to generate, or threshold function
    normalize, // whether to normalize values to a total of 100%
    marginTop = 20, // top margin, in pixels
    marginRight = 30, // right margin, in pixels
    marginBottom = 30, // bottom margin, in pixels
    marginLeft = 40, // left margin, in pixels
    width = 640, // outer width of chart, in pixels
    height = 400, // outer height of chart, in pixels
    insetLeft = 0.5, // inset left edge of bar
    insetRight = 0.5, // inset right edge of bar
    xType = type, // type of x-scale
    xDomain = domain, // [xmin, xmax]
    xRange = [marginLeft, width - marginRight], // [left, right]
    xLabel = label, // a label for the x-axis
    xFormat = format, // a format specifier string for the x-axis
    yType = d3.scaleLinear, // type of y-scale
    yDomain, // [ymin, ymax]
    yRange = [height - marginBottom, marginTop], // [bottom, top]
    yLabel = '↑ Frequency', // a label for the y-axis
    yFormat = normalize ? '%' : undefined, // a format specifier string for the y-axis
    color = 'currentColor', // bar fill color
  } = {}
) {
  // Compute values.
  const X = d3.map(data, x);
  const Y0 = d3.map(data, y);
  const I = d3.range(X.length);

  // Compute bins.
  const bins = d3
    .bin()
    .thresholds(thresholds)
    .value((i) => X[i])(I);
  const Y = Array.from(bins, (I) => d3.sum(I, (i) => Y0[i]));
  if (normalize) {
    const total = d3.sum(Y);
    for (let i = 0; i < Y.length; ++i) Y[i] /= total;
  }

  // Compute default domains.
  if (xDomain === undefined) xDomain = [bins[0].x0, bins[bins.length - 1].x1];
  if (yDomain === undefined) yDomain = [0, d3.max(Y)];

  // Construct scales and axes.
  const xScale = xType(xDomain, xRange);
  const yScale = yType(yDomain, yRange);
  const xAxis = d3
    .axisBottom(xScale)
    .ticks(width / 80, xFormat)
    .tickSizeOuter(0);
  const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);
  yFormat = yScale.tickFormat(100, yFormat);

  const svg = d3
    .select('svg#graph')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])
    .attr('style', 'max-width: 100%; height: auto; height: intrinsic;');

  svg
    .append('g')
    .attr('transform', `translate(${marginLeft},0)`)
    .call(yAxis)
    .call((g) => g.select('.domain').remove())
    .call((g) =>
      g
        .selectAll('.tick line')
        .clone()
        .attr('x2', width - marginLeft - marginRight)
        .attr('stroke-opacity', 0.1)
    )
    .call((g) =>
      g
        .append('text')
        .attr('x', -marginLeft)
        .attr('y', 10)
        .attr('fill', 'currentColor')
        .attr('text-anchor', 'start')
        .text(yLabel)
    );

  svg
    .append('g')
    .attr('fill', color)
    .selectAll('rect')
    .data(bins)
    .join('rect')
    .attr('x', (d) => xScale(d.x0) + insetLeft)
    .attr('width', (d) =>
      Math.max(0, xScale(d.x1) - xScale(d.x0) - insetLeft - insetRight)
    )
    .attr('y', (d, i) => yScale(Y[i]))
    .attr('height', (d, i) => yScale(0) - yScale(Y[i]))
    .append('title')
    .text((d, i) => [`${d.x0} ≤ x < ${d.x1}`, yFormat(Y[i])].join('\n'));

  svg
    .append('g')
    .attr('transform', `translate(0,${height - marginBottom})`)
    .call(xAxis)
    .call((g) =>
      g
        .append('text')
        .attr('x', width - marginRight)
        .attr('y', 27)
        .attr('fill', 'currentColor')
        .attr('text-anchor', 'end')
        .text(xLabel)
    );

  return svg.node();
}

const unemployment = [
  { id: 1001, state: 'Alabama', county: 'Autauga County', rate: 5.1 },
  { id: 1003, state: 'Alabama', county: 'Baldwin County', rate: 4.9 },
  { id: 1005, state: 'Alabama', county: 'Barbour County', rate: 8.6 },
  { id: 1007, state: 'Alabama', county: 'Bibb County', rate: 6.2 },
  { id: 1009, state: 'Alabama', county: 'Blount County', rate: 5.1 },
  { id: 1011, state: 'Alabama', county: 'Bullock County', rate: 7.1 },
  { id: 1013, state: 'Alabama', county: 'Butler County', rate: 6.7 },
  { id: 1015, state: 'Alabama', county: 'Calhoun County', rate: 6.1 },
  { id: 1017, state: 'Alabama', county: 'Chambers County', rate: 5 },
  { id: 1019, state: 'Alabama', county: 'Cherokee County', rate: 5 },
  { id: 1021, state: 'Alabama', county: 'Chilton County', rate: 5.2 },
  { id: 1023, state: 'Alabama', county: 'Choctaw County', rate: 7.9 },
  { id: 1025, state: 'Alabama', county: 'Clarke County', rate: 11.1 },
  { id: 1027, state: 'Alabama', county: 'Clay County', rate: 5.9 },
  { id: 1029, state: 'Alabama', county: 'Cleburne County', rate: 5.5 },
  { id: 1031, state: 'Alabama', county: 'Coffee County', rate: 5.6 },
  { id: 1033, state: 'Alabama', county: 'Colbert County', rate: 6.5 },
  { id: 1035, state: 'Alabama', county: 'Conecuh County', rate: 7.7 },
  { id: 1037, state: 'Alabama', county: 'Coosa County', rate: 5.7 },
  { id: 1039, state: 'Alabama', county: 'Covington County', rate: 6.7 },
];

Histogram(unemployment, {
  value: (d) => d.rate,
  label: 'Unemployment rate (%) →',
  width: 500,
  height: 500,
  color: 'steelblue',
});
