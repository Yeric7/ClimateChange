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
import * as icons from "../assets/Icon"
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

