import * as d3 from "d3"
import * as icons from "../assets/Icon/icons"

export default function climateChangeGraph({
  cityHeightData,waterLevelData,citationTextData,containerCitationText
}) {

const data = parse(cityHeightData, waterLevelData, citationTextData)
function citationText({ containerCitationText, data }) {
    var currentIndex = 0
  
    containerCitationText.text(data[currentIndex].text)
  
    function update(delta) {
      let next = delta + currentIndex
      if (next < 0 || next > data.length - 1) return
  
      currentIndex = next
      containerCitationText.text(data[currentIndex].text)
    }
  
    return update
  }


  const citationTextUpdate = citationText({
    containerCitationText,
    data: data.citationText,
  })

  function jar({ svgJar, cityHeight, waterLevel }) {
  //size
  const width = 615
  const height = 730
  const margin = { left: 0, right: 0, top: 300, bottom: 8 }
  
  const cityWidth = 130

  //scale
  const yearToHeightDomains = []
  waterLevel.forEach((d, i, a) => {
    if (i !== a.length - 1) {
      yearToHeightDomains.push({
        domain: [d.year, a[i + 1].year],
        range: [d.height, a[i + 1].height],
      })
    }
  })

  
  //scale
  const heightScale = piecewiseLinearScale()
    .domain([
      { domain: [0, 10], pp: [0, 0.5] },
      { domain: [10, 20], pp: [0.5, 0.6] },
      { domain: [20, 80], pp: [0.6, 1] },
    ])
    .range([innerHeight * 0.9, 0])

  const yearToCityPositionX = d3.scaleLinear().domain(d3.extent(waterLevel, (d) => d.year)).range([
      margin.left, width - margin.right - cityWidth * cityHeight.length - cityWidth * 4,])


  var gCityX = margin.left
gCity.attr("class", "draggable").attr("transform", (d) => `translate(${gCityX},${margin.top})`).call(d3.drag().on("drag", dragging))

  

    const x = gCityX + e.dx

    if (
      x <= yearToCityPositionX.range()[0] &&
      x >= yearToCityPositionX.range()[1]
    ) {
      gCityX = x
      gCity.attr("transform", `translate(${gCityX},${margin.top})`)
    }
  }


}