import * as d3 from "d3"
import * as icons from "../assets/Icon/icons"

let isInStoryMode
let currentYear
let tooltip
let tooltipTimer

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

  //props pricipal
  isInStoryMode = false
  currentYear = d3.min(data.waterLevel, (d) => d.year)
  const totalTime = 30000
  const timeStep = 100

  //scale annee
  const timeToYearScale = d3
    .scaleLinear()
    .domain([0, totalTime])
    .range(d3.extent(data.waterLevel, (d) => d.year))

  //init main 
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

      //commence story mode
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

    //bleu
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

    const gInner = svgJar.append("g")
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
        .attr("height", 0);
    })

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
})

g.selectAll("image")
      .data(cityHeight)
      .join("image")
      .attr("x", (d, i) => cityWidth * 4 + i * cityWidth)
      .attr("y", (d) => heightScale(d.height) - 180)
      .attr("width", cityWidth)
      .attr("height", 180)
      .attr("href", (d) => `${d.town}CityIcon.svg`)
  

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
      }
    return update
    })}


    drag = {}

      function dragstarted(event, d) {
        d3.select(this).raise().classed("active", true);
      }
    
      function dragged(event, d) {
        d3.select(this).attr("x", d.x = event.x).attr("y", d.y = event.y);
      }
    
      function dragended(event, d) {
        d3.select(this).attr("stroke", null).classed("active", false)
      }
    
    /*   return d3.drag(){  
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended); */
    

function citationText({ containerCitationText, data }) {
  let currentIndex = 0

  containerCitationText.text(data[currentIndex].text)
  function update(delta) {
    let next = delta + currentIndex;
    if (next < 0 || next > data.length - 1) return

    currentIndex = next
    containerCitationText.text(data[currentIndex].text)
  }
  return update
}

function tooltipShow(x, y, text) {
  tooltip.style("display", "inline")
    .style("left", x + "px")
    .style("top", y + "px")
    .text(text);

  clearTimeout(tooltipTimer);
  tooltipTimer = setTimeout(function () {
    tooltip.style("display", "none");
  }, 3000);
}


var svg = d3.select("svg"),
margin = 200,
width = svg.attr("width") - margin,
height = svg.attr("height") - margin;


var xScale = d3.scaleBand().range ([0, width]).padding(0.4),
yScale = d3.scaleLinear().range ([height, 0]);

var g = svg.append("g")
       .attr("transform", "translate(" + 100 + "," + 100 + ")");

d3.csv("XYZ.csv", function(error, data) {
if (error) {
    throw error;
}

xScale.domain(data.map(function(d) { return d.year; }));
yScale.domain([0, d3.max(data, function(d) { return d.value; })]);

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
});


function piecewiseLinearScale() {
  var Domain = [{ domain: [0, 1], pp: [0, 1] }];
  var Range = [0, 1];

  function update() {
    Domain.forEach((d) => {
      if (d.pp)
        d.scale = d3
          .scaleLinear()
          .domain(d.domain)
          .range(d.pp.map((p) => d3.interpolate(...Range)(p)));

      if (d.range) d.scale = d3.scaleLinear().domain(d.domain).range(d.range);
    });
  }}



