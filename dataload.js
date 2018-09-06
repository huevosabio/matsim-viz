var chartSize = {
		width: document.getElementById('charts').clientWidth,
		height: document.getElementById('charts').clientHeight,
    	margin: {top: 20, right: 16, bottom: 40, left: 50}
	};

d3.queue()
    .defer(d3.csv, 'testdata/1hr_summary_human.csv')
    .defer(d3.json, 'testdata/1hr_loc_human.json')
    .await(function(error, summaryData, carData) {
      	if (error) throw error;

        renderMap = plotMap(carData, 'map')
      	plotSummary(summaryData, '#charts', chartSize, renderMap);

    });
