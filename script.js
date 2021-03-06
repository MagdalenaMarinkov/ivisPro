var body = d3.select('body');
var margin = {top: 50, right: 50, bottom: 50, left: 100};
var h = 400;
var w = 1800;
var dataCsvHIV = {};
var dataCsvLeukemia = {};
var dataCsvTuberculosis = {};
var diseaseId = "hiv";
var yearId = "Year2006";
var isAnimating = false;
var allYearIds =["Year2006", "Year2007","Year2008", "Year2009", "Year2010", "Year2011", "Year2012", "Year2013","Year2014"];


d3.queue()
    .defer(d3.csv, "data_hiv_comma.csv")
    .awaitAll(function (error, results) {
        if (error) throw error;
        dataCsvHIV = results;
    });

d3.queue()
    .defer(d3.csv, "data_leukemia_comma.csv")
    .awaitAll(function (error, results) {
        if (error) throw error;
        dataCsvLeukemia = results;
    });

d3.queue()
    .defer(d3.csv, "data_tuberculosis_comma.csv")
    .awaitAll(function (error, results) {
        if (error) throw error;
        dataCsvTuberculosis = results;
    });

d3.interval(function () {
    if (isAnimating === true) {
        var index = allYearIds.indexOf(yearId);
        ++index;
        saveYearId(allYearIds[index % (allYearIds.length)]);
        var valueSlider= yearId.match(/\d/g);
        valueSlider= valueSlider.join("");
        document.getElementById("slider").value = valueSlider;
    }
}, 2000, 2000);

function startAnimation() {
    isAnimating = true;
    var radio=document.getElementsByName("disableme");
    var len=radio.length;
    for(var i=0;i<len;i++)
    {
        radio[i].disabled=true;
    }
}

function stopAnimation() {
    isAnimating = false;
    var radio=document.getElementsByName("disableme");
    var len=radio.length;
    for(var i=0;i<len;i++)
    {
        radio[i].disabled=false;
    }
}

function saveDiseaseId(id) {
    diseaseId = id;
    updateBubbles();
}
function preSaveYearId(){
    var click= document.getElementById("slider");
        click.addEventListener('mouseup', function() {
            saveYearId("Year"+this.value)
        });
}
function saveYearId(id) {
    yearId = id;
    updateBubbles();
}

function retunCVS() {
    if (diseaseId == "hiv") {
        return dataCsvHIV[0];

    } else if (diseaseId == "tuberculosis") {
        return dataCsvTuberculosis[0];
    } else {
        return dataCsvLeukemia[0]
    }
}

//fillScale for the circles
var fillScale = d3.scaleLinear()
    .domain([0, 60])
    .range([0, 70]);

// Scales
var colorScale = d3.scaleOrdinal(d3.schemeCategory20);

var xScale = d3.scaleLinear()
    .domain([-200, 16000])
    .range([0, 1800]);

var yScale = d3.scaleLinear()
    .domain([-1000, 5500000])
    .range([420, 0]);

var svg = body.append('svg')
    .attr('height', h + margin.top + margin.bottom)
    .attr('width', w + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
     .attr("width", "100%")
     .attr("height", "100%")
     .call(d3.zoom().on("zoom", function () {
        svg.attr("transform", d3.event.transform)
     }))
     .append("g");

// X-axis
var xAxis = d3.axisBottom(xScale)
    .tickValues([500, 1000, 2000, 3000, 5000, 8000, 12000])

// Y-axis
var yAxis = d3.axisLeft(yScale)
    .ticks(10);

svg.append('g')
    .attr('class', 'axis')
    .call(xAxis)
    .attr("transform", "translate(0,420)")
    .append('text') // X-axis Label
    .attr('class', 'label')
    .attr('y', -10)
    .attr('x', w)
    .attr('dy', '.71em')
    .style('text-anchor', 'middle')
    .text('X-Achse');

    svg.append("text")      // text label for the x axis
            .attr("x", 460 )
            .attr("y",  450 )
            .style("text-anchor", "middle")
            .text("Number diseased");



// Y-axis
svg.append('g')
    .attr('class', 'axis')
    .call(yAxis)
    .attr("transform", "translate(0,0)")
    .append('text') // y-axis Label
    .attr('class', 'label')
    .attr('transform', 'rotate(-90)')
    .attr('x', 0)
    .attr('y', 5)
    .attr('dy', '.71em')
    .style('text-anchor', 'middle')
    .text('Y-Achse');

    svg.append("text")      // text label for the x axis
            .attr("x", -25 )
            .attr("y",  -20 )
            .style("text-anchor", "middle")
            .text("GDP");

var tool_tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-8, 0])
    .html(function (d) {
        return "Name: " + d.Country + "<br>" + "Lebenserwartung: " + d["LE" + yearId] + "<br>" + "BIP: " + d["GDP" + yearId] + "<br>" + "Anzahl Erkrankte: " + d[yearId]
    });
svg.call(tool_tip);


function updateBubbles() {
    var defs = svg.append('svg:defs');

    defs = svg.selectAll('.flag')
        .data(retunCVS())
        .enter()
        .append("pattern")
        .attr("id", function (d) {
            return d.CountryCode;
        })
        .attr("class", "flag")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("patternContentUnits", "objectBoundingBox")
        .append("image")
        .attr("width", 1)
        .attr("height", 1)
        // xMidYMid: center the image in the circle
        // slice: scale the image to fill the circle
        .attr("preserveAspectRatio", "xMidYMid slice")
        .attr("xlink:href", function (d) {
            return "flags/" + d.CountryCode + ".svg";
        });


    var circles = svg.selectAll('circle')
        .data(retunCVS());

    circles
        .transition()
        .duration(2000)
        .attr('cx', function (d) {
            return xScale(d[yearId])
        })
        .attr('cy', function (d) {
            return yScale(d['GDP' + yearId])
        })
        .attr('r', function (d) {
            if(d[yearId] === ""){
                console.log(yearId);
                return fillScale(0);
            }else{
                console.log(yearId);
                return fillScale(d['LE' + yearId] / 10)
            }
        });

    circles.enter()
        .append('circle')
        .attr('cx', function (d) {
            return xScale(d[yearId])
        })
        .attr('cy', function (d) {
            return yScale(d['GDP' + yearId])
        })
        .attr('stroke', 'black')
        .attr('stroke-width', 1)

        .on('mouseover', tool_tip.show)
        .on('mouseout', tool_tip.hide)
        .transition()
        .duration(2000)
        .attr("fill", function (d) {
            return "url(#" + d["CountryCode"] + ")";
        })
        .attr('r', function (d) {
            if(d[yearId] === "") {
                return fillScale(0);
            }else{
                return fillScale(d['LE' + yearId] / 10)
            }
        });





}
