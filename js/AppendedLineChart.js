/**
 * Copyright Daniel Vizzini. All rights reserved.
 */
function AppendedLineChart(divId, dataJson, backgroundColor, xMin, xMax, yMin, yMax, width, height) {
	
	//format decials
	var decimalFormat = d3.format('2.1f');
	
	//prepend divId, if needed
	divId = (divId[0] == '#') ? divId : '#' + divId;
	
	//add div for jQuery UI
	$(divId).parent().append('<div id="' + divId.slice(1,divId.length) + '-tabs" class="tabs"><ul id="' + divId.slice(1,divId.length) + '-tabNails" class="tabnails"></ul></div>');
	
	//make room for y-axis labels
	var axisWidth = 20, axisMargin = 8;;//$(window).width() < 768 ? 20 : 40
	$(divId).css('marginLeft', -axisWidth);
	width += axisWidth;
	height += axisMargin;

	var y = d3.scale.linear().domain([yMax, yMin]).range([0, height]), x = d3.scale.linear().domain([0, xMax + 0.5]).range([0, width]), domain = d3.range(xMin, xMax + 1);

	var vis = d3.select(divId).append("svg:svg").attr("width", width).attr("height", height).append("svg:g").attr("transform", "translate("+axisWidth+","+ axisMargin + ")");

	var line = d3.svg.line().x(function(d, i) {
		return x(d.x);
	}).y(function(d) {
		return y(d.y);
	});

	// An area generator.
	var backgroundArea = d3.svg.area().x(function(d) {
		return x(d.x);
	})//try max function here
	.y0(function(d) {
		return y(yMin - 1);
	}).y1(0);

	var color = d3.scale.linear().domain([0, 0.5, 1]).range(["red", "green", "violet"]);

	d3.json(dataJson, function(jsonArray) {

		for( i = 0; i < jsonArray.length; i++) {

			var values = jsonArray[i].values;
			var currData = [];

			for( j = 0; j < values.length; j++) {
				if(values[j] != '') {
					currData.push({
						x : domain[j],
						y : values[j]
					});

				}
			}

			//confidence interval
			for( j = 0; j < jsonArray[i].interval.length; j++) {
				vis.append("svg:line").attr("x1", x(0)).attr("y1", y(jsonArray[i].interval[j])).attr("x2", x(xMax + 0.5)).attr("y2", y(jsonArray[i].interval[j])).attr("class", "axis").attr("stroke-dasharray", "4,4");
			}

			vis.append("svg:path").data([currData]).attr("id", jsonArray[i].name).attr("d", line).on("mouseover", onmouseover).on("mouseout", onmouseout).on("click", onclick).style("stroke", color(i / (jsonArray.length - 1)));

			$(divId + '-tabNails').append('<li><a id="' + jsonArray[i].name + 'Link" href="#' + jsonArray[i].name + 'Explanation">' + jsonArray[i].full_name + '</a></li>');
			$(divId + '-tabs').append('<div id="' + jsonArray[i].name + 'Explanation">' + jsonArray[i].html + '</div>');

		}

		$(function() {
			$(divId + '-tabs').tabs();
		});

		//addeventhandler
		$.each(jsonArray, function(i, val) {
			$('#' + val.name + 'Link').click(function() {
				_highlight(val.name);
			});
		});

		$(divId + '-tabs').width((width - axisWidth) * .991)
		.css('border-radius', '0px').css('border-color', backgroundColor).css('marginTop', -8).children().css('font-family', 'font-family: \'Quattrocento\', Georgia, "Times New Roman", Times, serif').css('font-size', '18px');

	});

	vis.append("svg:path").attr("class", "backgroundArea").style("fill", backgroundColor).data([[{
		'x' : 0
	}, {
		'x' : (xMax + 0.5)
	}]]).attr("d", backgroundArea);

	vis.append("svg:line").attr("x1", x(0)).attr("y1", y(-1.0)).attr("x2", x(0.0)).attr("y2", y(1.0)).attr("class", "axis")
	vis.append("svg:line").attr("x1", x(0)).attr("y1", y(0.0)).attr("x2", x(xMax + 0.5)).attr("y2", y(0.0)).attr("class", "axis")

	vis.selectAll(".xLabel").data(x.ticks(6).slice(1, 6)).enter().append("svg:text").attr("class", "xLabel").text(String).attr("x", function(d) {
		return x(d);
	}).attr("y", y(0.0) + 20).attr("text-anchor", "middle");

	vis.selectAll(".yLabel").data(y.ticks(4)).enter().append("svg:text").attr("class", "yLabel").text(function(d) {
		return decimalFormat(d);
	}).attr("x", -axisWidth + 1).attr("y", function(d) {
		return y(d)
	}).attr("text-anchor", "right").attr("dy", 3)

	vis.selectAll(".xTicks").data(x.ticks(5).slice(1, 6)).enter().append("svg:line").attr("class", "xTicks").attr("x1", function(d) {
		return x(d);
	}).attr("y1", y(0.0)).attr("x2", function(d) {
		return x(d);
	}).attr("y2", y(0.0) + 7)

	vis.selectAll(".yTicks").data(y.ticks(4)).enter().append("svg:line").attr("class", "yTicks").attr("y1", function(d) {
		return y(d);
	}).attr("x1", -4).attr("y2", function(d) {
		return y(d);
	}).attr("x2", x(0.0))

	function onclick(d, i) {

		var currClass = d3.select(this).attr("class");

		if(d3.select(this).classed('clicked')) {
			d3.select(this).attr("class", currClass.substring(8, currClass.length));
		} else {
			d3.select(this).attr("class", 'clicked ' + currClass);
		}

		$('#' + $(this).attr('id') + "Link").click();

	}

	function onmouseover(d, i) {
		if(!d3.select(this).classed('clicked')) {
			d3.select(this).attr("class", "current");
		}
	}

	function onmouseout(d, i) {
		if(!d3.select(this).classed('clicked')) {
			d3.select(this).attr("class", "");
		}
	}

	function _highlight(code) {
		$(divId + ' path').each(function() {
			if(d3.select(this).classed('current')) {
				d3.select(this).attr("class", "");
			}
		});
		d3.select('#' + code).attr("class", "clicked current");
	}

	//publically accessible variable
	this.highlight = function(code) {
		_highlight(code);
	}
}