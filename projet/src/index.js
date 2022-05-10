import * as d3 from "d3"
import "../css/style.css"
/* import { csv } from 'd3' */
/* import { csv, json } from 'd3-fetch' */
import climateChangeGraph from "./climateChangeGraph"
import cityHeightData from "../data/cityHeight.csv"
import waterLevelData from "../data/WaterLevel.csv"
import citationTextData from "../data/CitationText.csv"


const container = d3.select(".container")

climateChangeGraph({
  cityHeightData,
  waterLevelData,
  citationTextData,

  container,
  svgJar: container.select("svg.jar"),
  btnCitationTextArrorLeft: container.select(".arrow-left"),
  btnCitationTextArrorRight: container.select(".arrow-right"),
  containerCitationText: container.select(".citationText .content"),
  imgWheel: container.select(".wheel"),
  svgYearSlider: container.select("svg.year-slider"),
})

console.log("test")