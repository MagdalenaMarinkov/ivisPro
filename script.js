d3.csv('ivispro_data_comma.csv', function (data) {
    // Variables
    var body = d3.select('body')
    var margin = { top: 50, right: 50, bottom: 50, left: 50 }
    var h = 600
    var w = 600

    //fillScale for the circles
    var fillScale = d3.scale.linear()
                  .domain([0, 60])
                  .range([0, 100]);

    // Scales
    var colorScale = d3.scale.category20()

    var xScale = d3.scale.linear()
        .domain([0,65000])
        .range([0,600])
    var yScale = d3.scale.linear()
        .domain([0,65000])
        .range([600,0])
    // SVG
    var svg = body.append('svg')
        .attr('height',h + margin.top + margin.bottom)
        .attr('width',w + margin.left + margin.right)
        .append('g')
        .attr('transform','translate(' + margin.left + ',' + margin.top + ')')
    // X-axis
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .ticks(5)
    // Y-axis
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .ticks(5)
        .orient('left')
    // Circles
    var circles = svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx',function (d) { return xScale(d.Year2005) })
        .attr('cy',function (d) { return yScale(d.Year2011) })
        .attr('r', function (d) { return fillScale(d.Year2008 / 1000)})
        .attr('stroke','black')
        .attr('stroke-width',1)
        .attr('fill',function (d,i) { return colorScale(i) })
        .on('mouseover', function () {
            d3.select(this)
                .transition()
                .duration(500)
                .attr('r',20)
                .attr('stroke-width',3)
        })
        .on('mouseout', function () {
            d3.select(this)
                .transition()
                .duration(500)
                .attr('r',10)
                .attr('stroke-width',1)
        })
        .append('title') // Tooltip
        .text(function (d) { return d.Country +
            '\nYear 2010: ' + (d.Year2010) +
            '\nYear 2011: ' + (d.Year2011) })
    // X-axis
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
        .text('X-Achse')
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
        .text('Y-Achse')
})
