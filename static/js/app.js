'use strict';

var myapp = angular.module('myapp', ["highcharts-ng"]);

myapp.controller('myctrl', function ($scope) {

  $scope.data = {"JNSBALLI Index": {"Description": "Japan Small Business Confidence All Industries", "Ticker": "JNSBALLI Index", "Frequency": "Monthly", "values": [{"Date": "2014-01-31", "Ticker": "JNSBALLI Index", "Value": 51.3}, {"Date": "2014-02-28", "Ticker": "JNSBALLI Index", "Value": 50.6}, {"Date": "2014-03-31", "Ticker": "JNSBALLI Index", "Value": 53.5}, {"Date": "2014-04-30", "Ticker": "JNSBALLI Index", "Value": 45.4}, {"Date": "2014-05-31", "Ticker": "JNSBALLI Index", "Value": 46.6}, {"Date": "2014-06-30", "Ticker": "JNSBALLI Index", "Value": 47.3}, {"Date": "2014-07-31", "Ticker": "JNSBALLI Index", "Value": 48.7}, {"Date": "2014-08-31", "Ticker": "JNSBALLI Index", "Value": 47.7}, {"Date": "2014-09-30", "Ticker": "JNSBALLI Index", "Value": 47.6}, {"Date": "2014-10-31", "Ticker": "JNSBALLI Index", "Value": 47.4}, {"Date": "2014-11-30", "Ticker": "JNSBALLI Index", "Value": 47.7}, {"Date": "2014-12-31", "Ticker": "JNSBALLI Index", "Value": 46.7}], "Units": null, "Type": "Indicator"},
                "JNCPT Index": {"Description": "Japan CPI Tokyo YoY", "Ticker": "JNCPT Index", "Frequency": "Monthly", "values": [{"Date": "2014-01-31", "Ticker": "JNCPT Index", "Value": 0.7}, {"Date": "2014-02-28", "Ticker": "JNCPT Index", "Value": 1.1}, {"Date": "2014-03-31", "Ticker": "JNCPT Index", "Value": 1.3}, {"Date": "2014-04-30", "Ticker": "JNCPT Index", "Value": 2.9}, {"Date": "2014-05-31", "Ticker": "JNCPT Index", "Value": 3.1}, {"Date": "2014-06-30", "Ticker": "JNCPT Index", "Value": 3}, {"Date": "2014-07-31", "Ticker": "JNCPT Index", "Value": 2.8}, {"Date": "2014-08-31", "Ticker": "JNCPT Index", "Value": 2.8}, {"Date": "2014-09-30", "Ticker": "JNCPT Index", "Value": 2.8}, {"Date": "2014-10-31", "Ticker": "JNCPT Index", "Value": 2.5}, {"Date": "2014-11-30", "Ticker": "JNCPT Index", "Value": 2.1}, {"Date": "2014-12-31", "Ticker": "JNCPT Index", "Value": 2.2}], "Units": "% CHANGE", "Type": "Indicator"},
                "JNRETMOM Index": {"Description": "Japan Retail Trade MoM SA 2010=100", "Ticker": "JNRETMOM Index", "Frequency": "Monthly", "values": [{"Date": "2014-01-31", "Ticker": "JNRETMOM Index", "Value": 1.6}, {"Date": "2014-02-28", "Ticker": "JNRETMOM Index", "Value": 0.1}, {"Date": "2014-03-31", "Ticker": "JNRETMOM Index", "Value": 6.5}, {"Date": "2014-04-30", "Ticker": "JNRETMOM Index", "Value": -13.4}, {"Date": "2014-05-31", "Ticker": "JNRETMOM Index", "Value": 3.8}, {"Date": "2014-06-30", "Ticker": "JNRETMOM Index", "Value": 0.9}, {"Date": "2014-07-31", "Ticker": "JNRETMOM Index", "Value": 0.6}, {"Date": "2014-08-31", "Ticker": "JNRETMOM Index", "Value": 1.2}, {"Date": "2014-09-30", "Ticker": "JNRETMOM Index", "Value": 1.7}, {"Date": "2014-10-31", "Ticker": "JNRETMOM Index", "Value": -0.6}, {"Date": "2014-11-30", "Ticker": "JNRETMOM Index", "Value": 0}, {"Date": "2014-12-31", "Ticker": "JNRETMOM Index", "Value": 0}], "Units": "% CHANGE", "Type": "Indicator"}};

  $scope.length = new Array(_.size($scope.data));
  $scope.values = {};
  $scope.desc = {};

  _.each($scope.data, function(d, k) {
    $scope.values[k] = _.pluck(d.values, 'Value');
    $scope.desc[k] = d.Description;
  })

  console.log($scope.length);
  console.log($scope.values);
  console.log($scope.desc);
  console.log($scope.data);

  // $scope.chartSeries = [
  //   {"name": "Some data", "data": [1, 2, 4, 7, 3]},
  //   {"name": "Some data 3", "data": [3, 1, null, 5, 2], connectNulls: true},
  //   {"name": "Some data 2", "data": [5, 2, 2, 3, 5], type: "column"},
  //   {"name": "My Super Column", "data": [1, 1, 2, 3, 2], type: "column"}
  // ];

  $scope.chartSeries = _.map($scope.values, function(d,k) {
    return {"name": k, "data": d}
  });

  $scope.chartList = [];

  _.each($scope.chartSeries, function(d, i) {
    console.log(d["name"]);
    console.log(d["data"]);
    $scope.chartConfig = {
      options: {
        chart: {
          type: 'areaspline',
          height: 300
        },
        plotOptions: {
          series: {
            stacking: ''
          }
        }
      },
      series: [{data: d["data"]}],
      title: {
        text: d["name"]
      },
      subtitle: {
        text: _.values($scope.desc)[i]
      },
      credits: {
        enabled: false
      },
      loading: false,
      size: {},
      xAxis: {
       currentMin: 0,
       currentMax: 11,
       categories: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct", "Nov", "Dec"]
      }
    }

    $scope.chartList.push($scope.chartConfig);
  });

  console.log($scope.chartList);

  // $scope.chartSeries = [
  //   {"name": _.keys($scope.values), "data": _.values($scope.values)[0]}
  // ];

  $scope.query = '';
  $scope.submit = function() {
    $scope.query = this.query;
  }

});
