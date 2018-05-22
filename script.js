var body = d3.select('body');
var margin = { top: 50, right: 50, bottom: 50, left: 50 };
var h = 600;
var w = 600;
var dataCsv={};

d3.queue()
    .defer(d3.csv, "ivispro_data_comma.csv")
    .awaitAll(function(error, results) {
        if (error) throw error;
        dataCsv=results;
    });



//fillScale for the circles
var fillScale = d3.scaleLinear()
    .domain([0, 60])
    .range([0, 100]);

// Scales
var colorScale = d3.scaleOrdinal(d3.schemeCategory20);

var xScale = d3.scaleLinear()
    .domain([0,65000])
    .range([0,600]);

var yScale = d3.scaleLinear()
    .domain([0,65000])
    .range([600,0]);

var svg = body.append('svg')
    .attr('height',h + margin.top + margin.bottom)
    .attr('width',w + margin.left + margin.right)
    .append('g')
    .attr('transform','translate(' + margin.left + ',' + margin.top + ')');

// X-axis
var xAxis = d3.axisBottom(xScale)
    .ticks(5);

// Y-axis
var yAxis = d3.axisLeft(yScale)
    .ticks(5);

svg.append('g')
    .attr('class','axis')
    .call(xAxis)
    .attr("transform", "translate(0,620)")
    .append('text') // X-axis Label
    .attr('class','label')
    .attr('y',-10)
    .attr('x',w)
    .attr('dy','.71em')
    .style('text-anchor','end')
    .text('X-Achse');

// Y-axis
svg.append('g')
    .attr('class', 'axis')
    .call(yAxis)
    .attr("transform", "translate(0,0)")
    .append('text') // y-axis Label
    .attr('class','label')
    .attr('transform','rotate(-90)')
    .attr('x',0)
    .attr('y',5)
    .attr('dy','.71em')
    .style('text-anchor','end')
    .text('Y-Achse');


function saveId(id){
    yearId=id;
    updateBubbles(id);
}

function updateBubbles(attribute) {

    console.log(attribute);
    // Circles

        var circles = svg.selectAll('circle')
            .data(dataCsv[0])
            .attr('cx', function (d) {
                return xScale(d[attribute])
            })
            .attr('cy', function (d) {
                return yScale(d['Year2011'])
            })
            .attr('r', function (d) {
                return fillScale(d['Year2008'] / 1000)
            })
            .enter()
            .append('circle')
            .attr('cx', function (d) {
                return xScale(d[attribute])
            })
            .attr('cy', function (d) {
                return yScale(d['Year2011'])
            })
            .attr('r', function (d) {
                return fillScale(d['Year2008'] / 1000)
            })
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .attr('fill', function (data, i) {
                return colorScale(i)
            })
            .on('mouseover', function () {
                d3.select(this)
                    .transition()
                    .duration(500)

            })
            .on('mouseout', function () {
                d3.select(this)
                    .transition()
                    .duration(500)

            })
            .append('title') // Tooltip
            .text(function (d) { return d['Country'] +
                '\nYear 2010: ' + (d['Year2010']) +
                '\nYear 2011: ' + (d['Year2011']) });



}
