var chartSize = {
		width: document.getElementById('charts').clientWidth,
		height: 200,
    	margin: {top: 20, right: 16, bottom: 40, left: 50}
	};

d3.queue()
    .defer(d3.csv, 'testdata/2hr_summary.csv')
    .defer(d3.json, 'testdata/2hr_min.json')
    .await(function(error, summaryData, carData) {
      	if (error) throw error;

        renderMap = plotMap(carData, 'map')
      	plotSummary(summaryData, '#charts', chartSize, renderMap);

    });
