(function(window) {

  window.dateDiff = function(startDate, endDate) {
		return Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
  };
  
  window.MonthlyCalendar = function(divId, data) {

  //clean up parameters
  divId = (divId[0] == '#') ? divId : '#' + divId;
  
  var title = "Predicted Demand",
      color = d3.scale.quantile(),
      counts = new Array(),
      startingDate = new Date(data[0].utc * 1000),
      z = $(divId).width() / 7 - 5;      
      console.log("z: " + z);
      
  var startingMidnight = new Date(startingDate.getTime() - (startingDate.getTime() % (1000 * 3600 * 24)));
  
  var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  $.each(data, function(ind, json) {
  	counts.push(json.count)
  });
  
  // d3.select("#footer span")
      // .text(title);
  
  color.domain(counts)
      .range(d3.range(9));
      
  var daysOfWeekSvg = d3.select(divId).selectAll(".dayOfWeek")
  			.data(daysOfWeek)
  		.enter().append("div")
		    .style("display", "inline-block")
		    .style("vertical-align", "top")
		    .style("width", z + "px")
		    .style("height", .15 *z + "px")
  		.append("svg:svg")
  		.append("svg:g");

  daysOfWeekSvg.append("svg:text")
	    	.attr('font-size',function() {return 0.1 * z;})
	    	.attr('fill',"black")
		    .attr("x", function() {return 0.5 * z ;})
		    .attr("y", function() {return 0.1 * z ;})
				.attr("text-anchor", "middle")
	 			.text(function(d) { return d; });

	var svg = d3.select(divId).selectAll(".day")
	    .data(function() { return d3.time.days(startingMidnight, new Date(data[data.length - 1].utc * 1000 + 1)); })//Test for Paris
	  .enter().append("div")
	    .attr("class", "day")
	    .attr("id", function(d) {
	    	return "date" + d.getTime();
	    })
	    .style("display", "inline-block")
	    .style("vertical-align", "top")
	    .style("width", z + "px")
	    .style("height", z * ($(window).width() < 768 ? 1.0 : 0.4) + "px")
	    .style("top", -7)
		.append("svg:svg")
	    .attr("class", "RdYlGn")
		.append("svg:g");
	
	console.log("creating svg:rect");
    console.log("z: " + z);
    console.log("z: " + z);
	svg.append("svg:rect")
	    .attr("width", z)
	    .attr("height", z * ($(window).width() < 768 ? 1.0 : 0.4) + "px")
      .attr("class", function(d) { return "q" + color(data[dateDiff(startingDate, d)].count) + "-9"; });
		
  svg.append("svg:text")
    	.attr('font-size',function() {return z / 10;} )
    	.attr('fill',"black")
	    .attr("x", function() {return z / 12;})
	    .attr("y", function() {return z / 8;})
    	.text(function(d) {return d3.time.format("%B")(d)});
    	
	svg.append("svg:text")
    	.attr('font-size',function() {return z / 5;})
    	.attr('fill',"black")
	    .attr("x", function() {return z / 12;})
	    .attr("y", function() {return .28 * z ;})
    	.text(function(d) {return d.getDate()});
    	
  };
})(window)