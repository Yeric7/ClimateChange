
//https://www.analyticsvidhya.com/blog/2017/08/visualizations-with-d3-js/
// Pour importer les données
// import file from '../data/data.csv'




import * as d3 from 'd3'
import { csv } from 'd3';

/* import ville from '../data/CityHeight.csv'
import eau from '../data/WaterLevel.csv'


// Set of data
let villeHauteur = csv(ville)
let eauHauteur = csv(eau)
 */
/* const svgGraph = d3.select('body').append('svg').attr("width", 200, "height", 100); */






//create an svg element
let svgElement = d3.select("body")
.append("svg")
.attr({"width" : 500, "height" : 500});
//create a linear scale to map data to pixels, domain is [0,50] and range is [10,400]
let xScale = d3.scaleLinear().domain([0,50]).range([10,400]);
//create a axis based on the scale
let xAxis = d3.axisBottom().scale(xScale)
.tickFormat(5) //limit number of ticks to 5
.orient("bottom"); //horizontal axis with labels to  the bottom 
//create a new group to hold the axis
let x = svgElement.append("g")
.call(xAxis);



/* var xAxis = d3.axisBottom(xRange).tickFormat(function(d){ return d.x;}); */
/* 
// create a group for the bars
let bars = svgGraph.append('g')
			.attr('class', 'bars');


bars.selectAll('rect')
	.data(villeHauteur)
    .enter()
    .append('rect')
    .attr('x', (d,i) => i*25 )
    .attr('y', (d) => 100-d)
    .attr('width', 20)
    .attr('height', (d) => d); */