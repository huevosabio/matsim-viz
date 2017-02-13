function plotSummary(data, containerId, chartsize, renderFunc) {

	var svg = d3.select(containerId)
    	.append('svg')
    	.attr('width', chartSize.width)
    	.attr('height', chartSize.height),
    	margin = chartsize.margin,
    	width = +chartsize.width - chartsize.margin.left - chartsize.margin.right,
    	height = +chartsize.height - chartSize.margin.top - chartSize.margin.bottom,
    	g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear()
            .domain([0, data.length])
            .range([0, width])
            .clamp(true),
        y = d3.scaleLinear().range([height, 0]),
        z = d3.scaleOrdinal(d3.schemeCategory10);

    //slider
    var slider = svg.append("g")
            .attr("class", "slider")
            .attr("transform", "translate(" + margin.left + "," +  margin.top + ")");

    slider.append("rect")
    	.attr("class",".track-overlay")
    	.attr("y", 0)
        .attr("x", 0)
        .attr("width", width)
        .attr("height", height)
        .attr("fill-opacity",0.0)
        .call(d3.drag()
        .on("start.interrupt", function() { slider.interrupt(); })
        .on("start drag", function() { hue(x.invert(d3.event.x)); }))

            //.attr("class", "track")
            //.attr("y1", height)
            //.attr("y2", height)
            //.attr("x1", x.range()[0])
            //.attr("x2", x.range()[1])
            ////.select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
            ////.attr("class", "track-inset")
            //.select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
            //.attr("class", "track-overlay")
            

    var handle = slider.insert("line", ".track-overlay")
        .attr("class", "handle")
        .attr("y1", 0)
        .attr("y2", height)
        .attr("x1", 0)
        .attr("x2",0);
    
    /* USE FOR PLAY FUNCTION
    slider.transition() // Gratuitous intro!
        .duration(750)
        .tween("hue", function() {
        var i = d3.interpolate(0, 70);
        return function(t) { hue(i(t)); };
    });
*/

    // summary data
    var line = d3.line()
    	.curve(d3.curveBasis)
    	.x(function(d) { return x(d.time); })
    	.y(function(d) { return y(d.ncars); });

   	var summary = data.columns.slice(1).map(function(id) {
    	return {
      	id: id,
      	values: data.map(function(d) {
        	return {time: d.time, ncars: d[id]};
      	})
    	}
    });

    console.log(summary);
    y.domain([
    	d3.min(summary, function(c) { return d3.min(c.values, function(d) { return +d.ncars; }); }),
    	d3.max(summary, function(c) {  
    		return d3.max(c.values, function(d) {
    			return +d.ncars; }); })
  	]);

  	z.domain(summary.map(function(c) { return c.id; }));

  	g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    yaxisGen = d3.axisLeft(y).ticks(6);
   g.append("g")
       .attr("class", "axis axis--y y-axis-label")
       .call(yaxisGen)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("fill", "#000")
      .text("Number of Cars");

    var status = g.selectAll(".status")
    	.data(summary)
    	.enter().append("g")
      	.attr("class", "status");

    status.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { 
      	var hex;
      	switch (d.id){
     			case "idle":
     				hex = "FFFFFF";
        	        break;
        	    case "passenger":
        	        hex = "000080" ;
        	        break;
        	    case "rebalancing":
        	        hex = "800000";
        	        break;
        	}
      	return hex; 
      });

  	status.append("text")
      .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.time) + "," + y(d.value.ncars) + ")"; })
      .attr("x", 3)
      .attr("dy", "0.35em")
      .style("font", "10px sans-serif")
      .text(function(d) { return d.id; });

    function hue(h) {
        handle.attr("x1", x(h));
        handle.attr("x2", x(h));
        renderFunc(Math.round(h));
    }
}