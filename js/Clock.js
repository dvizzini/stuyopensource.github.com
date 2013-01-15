/**
 * Copyright Daniel Vizzini. All rights reserved.
 */

/**
 * Creates a radial area plot of demand
 * @param String divId id of HTML element where SVG will go
 * @param int startHour first hour covered, 0 - 11
 * @param int endHour last hour covered, 1 - 12
 * @param int radMin minimum radius for fill, typically 0
 * @param int radMax maxiumum radius for fill
 * @param int size legth and width of svg
 */
var Clock = function(divId, startHour, endHour, radMin, radMax) {		var fontSize = 0.045;//as portion of size

	//clean up parameters
	divId = (divId[0] == '#') ? divId : '#' + divId;
	var size = $(divId).width(),
		outerRadius = size / 2 - fontSize * size;
		
	var angle = d3.scale.linear()
	    .range([2 * Math.PI * startHour / 12, 2 * Math.PI * endHour / 12])
			.domain([startHour, endHour]);
			
	var radius = d3.scale.sqrt()
	    .range([0,outerRadius])
	    .domain([radMin, radMax]);

	var area = d3.svg.area.radial()
	    .interpolate("linear")
	    .innerRadius(0)
			.angle(function(d) { return angle(d.hour % 12); })
	  	.outerRadius(function(d) { return radius(d.count); });
	  	
	var svg = d3.select(divId).append('svg')
	    .attr("width", size)
	    .attr("height", size)
	  .append("g")
	    .attr("transform", "translate(" + size / 2 + "," + size / 2 + ")");
		    
	svg.selectAll(".axis")
	    .data(d3.range(startHour,endHour + 1))
	  .enter().append("g")
	    .attr("class", "axis")
        .attr("transform", function(d) { 
	     		return "rotate(" + angle(d) * 180 / Math.PI + ")"; 
	   	})
	  .call(d3.svg.axis()
	    .scale(radius.copy().range([0,-(outerRadius)]))
	    .orient("left")
	    .tickSize(size * .01, 0)
		)
	  .append("text")
	    .attr("y", -outerRadius - fontSize * size)
	    .attr("dy", ".71em")
	    .attr("text-anchor", "middle")
	    .attr("text-align", "middle")
	    .style("font-size", fontSize * size + "px")
			.text(function(d) { return (d % 12 == 0 ? 12 : d % 12); });
	
	//remove 0 markings from axis 
	svg.selectAll(".axis > g:first-child").remove();
	
	this.loadData = function(data) {
		
		svg.selectAll(".layer").remove();
		
	  //for last step
	  // data.push({"hour": (data[data.length - 1].hour % 12) + 1, "count": data[data.length - 1].count});
	
	  dataAlt = [];
	  
	  for (i=0; i < data.length; i++) {
	
			//end of interval
		  if (i > 0) {
		  	dataAlt.push({"hour": data[i].hour, "count": data[i - 1].count});
		  }
	
			//start of interval
	  	if (i < data.length) {
		  	dataAlt.push({"hour": data[i].hour, "count": data[i].count});
		  }
	
	  }

		//end of last interval	  
	  dataAlt.push({"hour": data[data.length - 1].hour + 1, "count": data[data.length - 1].count});
	  	  
	  svg.selectAll(".layer")
	      .data([dataAlt])
	    .enter().append("path")
	      .attr("class", "layer")
	      .attr("d", function(d) { 
	      	return area(d); 
	      })
	      .style("fill", "blue");
	      
	}
}