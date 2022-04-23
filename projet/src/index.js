/*https://vegibit.c om/create-a-bar-chart-with-d3-javascript/
 */
//https://www.analyticsvidhya.com/blog/2017/08/visualizations-with-d3-js/
// Pour importer les données
// import file from '../villeData/villeData.csv'

//https://www.tutorialsteacher.com/d3js/create-bar-chart-using-d3js


import * as d3 from 'd3'
/* import { csv } from 'd3' */
import { csv, json } from 'd3-fetch'

/* // import villedata from '../villeData/CityHeight.csv'
import eauData from '../villeData/WaterLevel.csv'
console.log(eauData)

import villeData from '../villeData/CityHeight.csv'
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


import eauData from '../data/WaterLevel.csv'
console.log(eauData.map(b => b.hauteurCumnul));
console.log(eauData)


//Scale
const maxHauteur = d3.max(villeData, d => d.Hauteur)
const minHauteur = d3.min(villeData, d => d.Hauteur)



const width = 700;
const height = 400;
const margin = {
    top:40, bottom: 40, left: 40, right: 40};

const svg = d3.select('#d3-container')
	.append('svg') 
    .attr('height', height - margin.top - margin.bottom)
    .attr('width', width - margin.left - margin.right)
    .attr('viewBox', [0, 0, width, height]);



const x = d3.scaleBand()
	.domain(d3.range(villeData.length)) 
	.range([margin.left, width - margin.right])
	.paddingInner(0.1);


// Axe des ordonnées

const y = d3.scaleLinear()
	.domain([0, maxHauteur])
	.range([height - margin.bottom, margin.top])

svg .append('g')
    .attr('fill', 'royalblue')
    .selectAll('rect')
    .villeData(villeData.sort((a, b) => d3.descending(a.hauteurVille, b.hauteurVille)))
    .join('rect')
    .attr('x', (d, i) => x(i))
        .attr('y', (d) => y(d.hauteurVille))
        .attr('height', d => y(0) - y(d.hauteurVille))
        .attr('width', x.bandwidth())


function xAxis(g) {
    g.attr('transform', `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickFormat(i => villeData[i].ville))
    .attr('font-size', '5px')


}

function yAxis(g) {
    g.attr('transform', `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(y).ticks(null, villeData.format))
    .attr('font-size', '20px')


}


svg.append('g').call(xAxis);
svg.append('g').call(yAxis);
svg.node(); 










// Axe des abcisses

const x2 = d3.scaleBand()
	.domain(d3.range(villeData.length)) 
	.range([margin.left, width - margin.right])
	.paddingInner(0.1);


// Axe des ordonnées

const y2 = d3.scaleLinear()
	.domain([0, d3.max(villeData, d => d.hauteurCumnul)])
	.range([height - margin.bottom, margin.top])

svg
    .append('g')
    .attr('fill', 'royalblue')
    .selectAll('rect')
    .villeData(villeData.sort((c, f) => d3.descending(c.hauteurCumnul, f.hauteurAnnee)))
    .join('rect')
    .attr('x2', (d, i) => x2(i))
        .attr('y2', (d) => y2(d.hauteurAnnee))
        .attr('height', d => y2(0) - y2(d.hauteurAnnee))
        .attr('width', x2.bandwidth())


function xAxis2(g) {
    g.attr('transform', `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(x2).tickFormat(i => villeData[i].annee))
    .attr('font-size', '5px')


}

function yAxis2(g) {
    g.attr('transform', `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(y2).ticks(null, villeData.format))
    .attr('font-size', '20px')


}


svg.append('g').call(xAxis2);
svg.append('g').call(yAxis2);
svg.node();

