var Stats = function(data) {
  this.data = data;
};

Stats.prototype.getDates = function() {
  return this.data.dates;
};

Stats.prototype.getSeries = function() {
  return this.data.series;
};

Stats.prototype.renderColumnGraphTo = function(element) {
  var driverNames = [];
  var counts = { name: 'Driver', data: [] };

  $(this.data.series).each(function(i, e) {
    driverNames.push(e.name);
    counts.data.push(e.data[e.data.length - 1]);
  });

  new Highcharts.Chart({
    chart: {
       renderTo: element,
       defaultSeriesType: 'column',
    },
    title: {
       text: 'Ignored tests by driver'
    },
    xAxis: {
       categories: driverNames
    },
    yAxis: {
       min: 0,
       title: {
          text: 'Ignored tests'
       }
    },
    tooltip: {
       formatter: function() {
          return ''+
             this.x +': '+ this.y +' tests ignored';
       }
    },
    credits: { enabled: false },
    plotOptions: {
       column: {
          pointPadding: 0.2,
          borderWidth: 0
       }
    },
    series: [counts]
  });
};


Stats.prototype.renderLineGraphTo = function(element) {
  new Highcharts.Chart({
    chart: {
       renderTo: element,
       defaultSeriesType: 'line',
       marginRight: 130,
       marginBottom: 25
    },
    title: {
       text: 'History',
    },
    xAxis: {
       categories: this.getDates()
    },
    yAxis: {
       title: {
          text: '# of ignores'
       },
       plotLines: [{
          value: 0,
          width: 1,
          color: '#808080'
       }]
    },
    credits: { enabled: false },
    tooltip: {
       formatter: function() {
                 return '<b>'+ this.series.name +'</b><br/>'+
             this.x +': '+ this.y +' ignored tests';
       }
    },
    legend: {
       layout: 'vertical',
       align: 'right',
       verticalAlign: 'top',
       x: -10,
       y: 100,
       borderWidth: 0
    },
    series: this.getSeries()
  });
};