var Stats = function(data) {
  this.data = data;
};

Stats.prototype.getDriverNames = function() {
  if(!this._driverNames) {
    this._driverNames = $(this.data.counts).map(function(i, e) { return e.name; });
  }

  return this._driverNames;
};

Stats.prototype.getSeries = function() {
  var series = {name: "Driver", data: []}
  var self = this;

  $(this.data.counts).each(function(i, e) {
    series.data.push(e.count)
  });

  return [series];
};

Stats.prototype.renderTo = function(element) {
  chart = new Highcharts.Chart({
      chart: {
         renderTo: element,
         defaultSeriesType: 'column',
         backgroundColor: "#F6F6F6"
      },
      title: {
         text: 'Ignored tests by driver'
      },
      xAxis: {
         categories: this.getDriverNames()
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
      series: this.getSeries()
   });
};