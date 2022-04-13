/*https://vegibit.c om/create-a-bar-chart-with-d3-javascript/
 */
//https://www.analyticsvidhya.com/blog/2017/08/visualizations-with-d3-js/
// Pour importer les données
// import file from '../data/data.csv'

//https://www.tutorialsteacher.com/d3js/create-bar-chart-using-d3js


import * as d3 from 'd3'
/* import { csv } from 'd3' */
import { csv, json } from 'd3-fetch'

/* // import villedata from '../data/CityHeight.csv'
import eauData from '../data/WaterLevel.csv'
console.log(eauData)

import villeData from '../data/CityHeight.csv'
console.log(villeData)



console.log(villeData['0'])
console.log(villeData['Ville'])

//put villedatainto an array
let villeTab = [] 
for (let i = 0; i < villeData.length; i++) {
    villeTab.push(villeData[i])
}
console.log('oui')
console.log(villeTab) */

//d


import villeData from '../data/CityHeight.csv'
//console.log(villeData)

for (let i = 0; i < villeData.length; i++) {
    console.log((villeData[i]));
}

console.log('oui')
console.log(villeData.Hauteur)
console.log(villeData.map(d => d.Hauteur))

//Scale
const maxHauteur = d3.max(villeData, d => d.Hauteur)
const minHauteur = d3.min(villeData, d => d.Hauteur)

consolet



/* let svg = d3.select("svg"),
        margin = 200,
        width = svg.attr("width") - margin,
        height = svg.attr("height") - margin;


    let xScale = d3.scaleBand().range ([0, width]).padding(0.4),
        yScale = d3.scaleLinear().range ([height, 0]);

    let g = svg.append("g")
               .attr("transform", "translate(" + 100 + "," + 100 + ")");

  d3.csv('../data/CityHeight.csv', function(error, data) {
    if (error) {
        throw error;
    }
});

        xScale.domain(data.map(function(d) { return d.ville; }));
        yScale.domain([0, d3.max(data, function(d) { return d.hauteur; })]);

        g.append("g")
         .attr("transform", "translate(0," + height + ")")
         .call(d3.axisBottom(xScale));

        g.append("g")
         .call(d3.axisLeft(yScale).tickFormat(function(d){
             return "$" + d;
         }).ticks(10))
         .append("text")
         .attr("y", 6)
         .attr("dy", "0.71em")
         .attr("text-anchor", "end")
         .text("value");


 */

