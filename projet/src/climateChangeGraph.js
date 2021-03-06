import * as d3 from "d3"
import * as icons from "../assets/Icon/icons"

var isInStoryMode
var currentYear
var tooltip
var tooltipTimer

export default function climateChangeGraph({
  cityHeightData,
  waterLevelData,
  citationTextData,
  svgYearSlider,
  containerCitationText,
  btnCitationTextArrorLeft,
  btnCitationTextArrorRight,
  svgJar,
  container,
  imgWheel,
}) {
  //data
  const data = parse(cityHeightData, waterLevelData, citationTextData)

  //prop principal
  isInStoryMode = false
  currentYear = d3.min(data.waterLevel, (d) => d.year)
  const totalTime = 20000 //a changer pour accelerer l'animation
  const timeStep = 50

  //scale time/year
  const timeToYearScale = d3
    .scaleLinear()
    .domain([0, totalTime])
    .range(d3.extent(data.waterLevel, (d) => d.year))

  //init main component
  const citationTextUpdate = citationText({
    containerCitationText,
    data: data.citationText,
  })

  const jarUpdate = jar({
    svgJar,
    cityHeight: data.cityHeight,
    waterLevel: data.waterLevel,
  })

  const yearSliderUpdate = yearSlider({
    svgYearSlider,
    waterLevel: data.waterLevel,
    onChange: (e) => {
      jarUpdate(timeStep)
    },
  })

  //infobull -- > eviter interaction pendant le story mode
  tooltip = container
    .append("div")
    .attr("class", "tooltip")
    .style("display", "none")

  //event roue a eau
  imgWheel
    .style("cursor", isInStoryMode ? "auto" : "pointer")
    .on("click", (e) => {
      if (isInStoryMode) {
        const xy = d3.pointer(e, container.node())

        tooltipShow(
          ...xy,
          "Le mode histoire est en cours, attrendre la fin le l'animation pour interagir"
        )

        return
      }

      //demarage du story mode
      isInStoryMode = true
      let currentTime = 0
      imgWheel.classed("rotate", true)

      var timer = setInterval(function () {
        currentTime += timeStep
        currentYear = timeToYearScale(currentTime)

        update()
      }, timeStep)

      setTimeout(function () {
        clearInterval(timer)
        isInStoryMode = false
        imgWheel.classed("rotate", false)
      }, totalTime)
    })

  //
  btnCitationTextArrorLeft.on("click", () => {
    citationTextUpdate(-1)
  })

  btnCitationTextArrorRight.on("click", () => {
    citationTextUpdate(1)
  })

  //
  function update() {
    jarUpdate(timeStep)
    yearSliderUpdate(timeStep)
  }

  function parse(cityHeightData, waterLevelData, citationTextData) {
    const cityHeight = cityHeightData.map((d) => ({
      town: d.Town,
      height: d.Height * 1,
    }))

    const waterLevel = waterLevelData

    const citationText = citationTextData.map((d) => ({ text: d.texte }))

    return { cityHeight, waterLevel, citationText }
  }
}

function jar({ svgJar, cityHeight, waterLevel }) {
  //size
  const width = 615
  const height = 730
  const margin = { left: 0, right: 0, top: 300, bottom: 8 }
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

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

  const yearToHeightScale = piecewiseLinearScale().domain(yearToHeightDomains)

  //scale
  const heightScale = piecewiseLinearScale()
    .domain([
      { domain: [0, 10], pp: [0, 0.5] },
      { domain: [10, 20], pp: [0.5, 0.6] },
      { domain: [20, 80], pp: [0.6, 1] },
    ])
    .range([innerHeight * 0.9, 0])

  const yearToCityPositionX = d3
    .scaleLinear()
    .domain(d3.extent(waterLevel, (d) => d.year))
    .range([
      margin.left,
      width - margin.right - cityWidth * cityHeight.length - cityWidth * 4,
    ])

  //degrad?? bleu
  const gradientblue = "gradientblue"
  svgJar
    .append("defs")
    .append("linearGradient")
    .attr("id", gradientblue)
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "0%")
    .attr("y2", "100%")
    .selectAll("stop")
    .data([
      { offset: "0%", color: "rgba(154, 200, 233,0.5)" },
      { offset: "100%", color: "rgba(60, 92, 170,1)" },
    ])
    .join("stop")
    .attr("offset", (d) => d.offset)
    .attr("stop-color", (d) => d.color)

  //
  const gInner = svgJar.append("g")

  //
  const gWater = gInner
    .append("g")
    .attr("transform", (d) => `translate(${margin.left},${margin.top})`)
    .call((g) => {
      g.append("rect")
        .attr("class", "water")
        .attr("fill", `url(#${gradientblue})`)
        .attr("stroke", "none")
        .attr("width", innerWidth)
        .attr("y", innerHeight)
        .attr("height", 0)
    })

  //
  const gCity = gInner.append("g").call((g) => {
    g.selectAll("rect")
      .data(cityHeight)
      .join("rect")
      .attr("fill", "black")
      .attr("stroke", "black")
      .attr("x", (d, i) => cityWidth * 4 + i * cityWidth)
      .attr("y", (d) => heightScale(d.height))
      .attr("width", cityWidth)
      .attr("height", (d) => innerHeight - heightScale(d.height))

    g.selectAll("text")
      .data(cityHeight)
      .join("text")
      .attr("dominant-baseline", "hanging")
      .attr("text-anchor", "start")
      .attr("fill", "white")
      .attr("font-size", 14)
      .attr("font-weight", "bold")
      .attr("x", (d, i) => cityWidth * 4 + i * cityWidth + 5)
      .attr("y", (d) => heightScale(d.height) + 5)
      .text((d) => d.town)

    g.selectAll("image")
      .data(cityHeight)
      .join("image")
      .attr("x", (d, i) => cityWidth * 4 + i * cityWidth)
      .attr("y", (d) => heightScale(d.height) - 180)
      .attr("width", cityWidth)
      .attr("height", 180)

      // .attr("href", (d) => `/../assets/Icon/${d.town}CityIcon.svg`)
      .attr("href", (d) => `${d.town}CityIcon.svg`)
  })

  var gCityX = margin.left
  gCity
    .attr("class", "draggable")
    .attr("transform", (d) => `translate(${gCityX},${margin.top})`)
    .call(d3.drag().on("drag", dragging))

  function dragging(e) {
    if (isInStoryMode) {
      const xy = d3.pointer(e)
      tooltipShow(...xy, "Le mode histoire est en cours, attrendre la fin le l'animation pour interagir")
      return
    }

    const x = gCityX + e.dx

    if (
      x <= yearToCityPositionX.range()[0] &&
      x >= yearToCityPositionX.range()[1]
    ) {
      gCityX = x
      gCity.attr("transform", `translate(${gCityX},${margin.top})`)
    }
  }

  const gYAxis = svgJar
    .append("g")
    .attr("transform", (d) => `translate(${margin.left},${margin.top})`)
    .call((g) => {
      g.selectAll("text.tick-height")
        .data(waterLevel)
        .join("text")
        .attr("class", "tick-height")
        .attr("dominant-baseline", "middle")
        .attr("text-anchor", "start")
        .attr("fill", "black")
        .attr("font-weight", "bold")
        .attr("font-size", 10)
        .attr("x", 120)
        .attr("y", (d) => heightScale(d.height))
        .text((d) => d.height + "m")

      g.selectAll("text.tick-year")
        .data(waterLevel)
        .join("text")
        .attr("class", "tick-year")
        .attr("dominant-baseline", "middle")
        .attr("text-anchor", "start")
        .attr("fill", "black")
        .attr("font-weight", "bold")
        .attr("font-size", 10)
        .attr("x", 80)
        .attr("y", (d) => heightScale(yearToHeightScale(d.year)))
        .text((d) => d.year)
    })

  update()

  function update(duration = 400) {
    //gWater
    gWater
      .selectAll("rect.water")
      .transition()
      .duration(duration)
      .attr("y", heightScale(yearToHeightScale(currentYear)))
      .attr(
        "height",
        innerHeight - heightScale(yearToHeightScale(currentYear))
      )

    //gCity
    if (isInStoryMode) {
      gCityX = yearToCityPositionX(currentYear)
      gCity
        .transition()
        .duration(duration)
        .attr("transform", `translate(${gCityX},${margin.top})`)
    }
  }

  return update
}

function yearSlider({ svgYearSlider, waterLevel, onChange }) {
  const width = 252
  const height = 170

  const years = waterLevel.map((d) => d.year)
  years.sort()

  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(years))
    .range([0, -1 * (years.length - 1) * width])

  svgYearSlider.attr("width", width).attr("height", height)

  const gInner = svgYearSlider.append("g")

  gInner
    .append("rect")
    .attr("fill", "#C4C4C4")
    .attr("stroke", "none")
    .attr("width", years.length * width)
    .attr("height", height - 10)

  gInner
    .selectAll("text")
    .data(years)
    .join("text")
    .attr("dominant-baseline", "middle")
    .attr("text-anchor", "middle")
    .attr("fill", (d) => (d == currentYear ? "white" : "black"))
    .attr("font-size", 50)
    .attr("font-weight", "bold")
    .attr("x", (d, i) => width / 2 + i * width)
    .attr("y", height / 2)
    .text((d) => d)

  let gXPosition = 0
  gInner.attr("class", "draggable").call(d3.drag().on("drag", dragging))

  function dragging(e) {
    if (isInStoryMode) {
      const xy = d3.pointer(e)
      tooltipShow(...xy, "Story mode is playing, please wait for interaction")
      return
    }

    const x = gXPosition + e.dx

    if (x <= xScale.range()[0] && x >= xScale.range()[1]) {
      gXPosition = x
      gInner.attr("transform", `translate(${gXPosition},${0})`)

      //get current year
      currentYear = Math.round(xScale.invert(gXPosition))

      //change text color
      gInner
        .selectAll("text")
        .attr("fill", (d) => (d == currentYear ? "white" : "black"))

      //
      onChange()
    }
  }

  function update(duration = 400) {
    gXPosition = xScale(currentYear)

    gInner
      .transition()
      .duration(duration)
      .attr("transform", `translate(${gXPosition},${0})`)
  }

  return update
}

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

function tooltipShow(x, y, text) {
  tooltip
    .style("display", "inline")
    .style("left", x + "px")
    .style("top", y + "px")
    .text(text)

  clearTimeout(tooltipTimer)
  tooltipTimer = setTimeout(function () {
    tooltip.style("display", "none")
  }, 3000)
}

function piecewiseLinearScale() {
  var Domain = [{ domain: [0, 1], pp: [0, 1] }]
  var Range = [0, 1]

  function update() {
    Domain.forEach((d) => {
      if (d.pp)
        d.scale = d3
          .scaleLinear()
          .domain(d.domain)
          .range(d.pp.map((p) => d3.interpolate(...Range)(p)))

      if (d.range) d.scale = d3.scaleLinear().domain(d.domain).range(d.range)
    })
  }

  function domain(d) {
    if (d == undefined) return d3.extent(Domain.map((dd) => dd.domain).flat())

    Domain = [...d]
    update()
    return scale
  }

  function range(r) {
    Range = [...r]
    update()
    return scale
  }

  function scale(x) {
    var piece = Domain.find((d) => x <= d.domain[1])
    if (piece == undefined) {
      piece = Domain[Domain.length - 1]
    }
    return piece.scale(x)
  }

  scale.domain = domain
  scale.range = range
  return scale
}
