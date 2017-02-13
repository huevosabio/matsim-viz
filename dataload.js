var shapeParser = dataParser(d3.timeParse("%m/%e/%y %H:%M"), ['date'], new Set(["dailySum","avg"])),
	chartSize = {
		width: document.getElementById('charts').clientWidth,
		height: 200,
    	margin: {top: 20, right: 16, bottom: 40, left: 50}
	},
	meterParser = dataParser(d3.timeParse("%m/%e/%y"), ['id','date'], new Set(["dailySum", "avg"]));

var renderEvent = new Event("render")

d3.queue()
    .defer(d3.csv, 'testdata/2hr_summary.csv', meterParser)
    .defer(d3.json, 'testdata/2hr_min.json')
    .await(function(error, summaryData, carData) {
      	if (error) throw error;

        renderMap = plotMap(carData, 'map')
      	plotSummary(summaryData, '#charts', chartSize, renderFunc);

    });
