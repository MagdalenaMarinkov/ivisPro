var body = d3.select('body');
var margin = {top: 50, right: 50, bottom: 50, left: 150};
var h = 600;
var w = 600;
var dataCsvHIV = {};
var dataCsvLeukemia = {};
var dataCsvTuberculosis = {};
var diseaseId = "hiv";
var yearId = "Year2008";

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


function saveDiseaseId(id) {
    diseaseId = id;
    updateBubbles();
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
    .range([0, 100]);

// Scales
var colorScale = d3.scaleOrdinal(d3.schemeCategory20);

var xScale = d3.scaleLinear()
    .domain([0, 8023])
    .range([0, 600]);

var yScale = d3.scaleLinear()
    .domain([0, 6000000])
    .range([600, 0]);

var svg = body.append('svg')
    .attr('height', h + margin.top + margin.bottom)
    .attr('width', w + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// X-axis
var xAxis = d3.axisBottom(xScale)
    .ticks(5);

// Y-axis
var yAxis = d3.axisLeft(yScale)
    .ticks(5);

svg.append('g')
    .attr('class', 'axis')
    .call(xAxis)
    .attr("transform", "translate(0,620)")
    .append('text') // X-axis Label
    .attr('class', 'label')
    .attr('y', -10)
    .attr('x', w)
    .attr('dy', '.71em')
    .style('text-anchor', 'end')
    .text('X-Achse');

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
    .style('text-anchor', 'end')
    .text('Y-Achse');

// Setup the tool tip.  Note that this is just one example, and that many styling options are available.
// See original documentation for more details on styling: http://labratrevenge.com/d3-tip/
var tool_tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-8, 0])
    .html(function (d) {
        return "Name: " + d.Country + "<br>" + "Lebenserwartung: " + d["LE"+ yearId] +"<br>" + "BIP: " + d["GDP"+ yearId] + "<br>" + "Anzahl Erkrankte: " + d[yearId]
    });
svg.call(tool_tip);


function updateBubbles() {
    var defs = svg.append('svg:defs');

    defs= svg.selectAll('.flag')
        .data(retunCVS())
        .enter()
        .append("pattern")
        .attr("id", function(d) { return d.CountryCode; })
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
        .attr("xlink:href", function(d) {
            return "flags/" + d.CountryCode + ".svg";
        });



    var circles = svg.selectAll('circle')
        .data(retunCVS());

    circles
        .transition()
        .duration(2000)
        .attr('cx', function (d) {
            console.log("csv " + d["Disease"]);
            return xScale(d[yearId])
        })
        .attr('cy', function (d) {
            return yScale(d['GDP' + yearId])
        })
        .attr('r', function (d) {
            return fillScale(d['LE' + yearId]/10)
        })
        .attr("fill", function(d) {
            return "url(#" + d["CountryCode"] + ")" ;
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

        /*.attr('fill', function (data, i) {
            //return colorScale(i)
            return "url(#" + d.CountryCode + ")"
        })*/
        .on('mouseover', tool_tip.show)
        .on('mouseout', tool_tip.hide)
        .transition()
        .duration(2000)
        .attr('r', function (d) {
            return fillScale(d['LE' + yearId] / 1000)
        });


}
