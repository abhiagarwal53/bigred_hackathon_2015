'use strict';

var API_CALL = '/api/v1.0/data/country/';

var myapp = angular.module('myapp', ["highcharts-ng"]);

myapp.controller('myctrl', ["$scope", "$http", function($scope,  $http) {

  $scope.data = {"JNSBALLI Index": {"Description": "Japan Small Business Confidence All Industries", "Ticker": "JNSBALLI Index", "Frequency": "Monthly", "values": [{"Date": "2014-01-31", "Ticker": "JNSBALLI Index", "Value": 51.3}, {"Date": "2014-02-28", "Ticker": "JNSBALLI Index", "Value": 50.6}, {"Date": "2014-03-31", "Ticker": "JNSBALLI Index", "Value": 53.5}, {"Date": "2014-04-30", "Ticker": "JNSBALLI Index", "Value": 45.4}, {"Date": "2014-05-31", "Ticker": "JNSBALLI Index", "Value": 46.6}, {"Date": "2014-06-30", "Ticker": "JNSBALLI Index", "Value": 47.3}, {"Date": "2014-07-31", "Ticker": "JNSBALLI Index", "Value": 48.7}, {"Date": "2014-08-31", "Ticker": "JNSBALLI Index", "Value": 47.7}, {"Date": "2014-09-30", "Ticker": "JNSBALLI Index", "Value": 47.6}, {"Date": "2014-10-31", "Ticker": "JNSBALLI Index", "Value": 47.4}, {"Date": "2014-11-30", "Ticker": "JNSBALLI Index", "Value": 47.7}, {"Date": "2014-12-31", "Ticker": "JNSBALLI Index", "Value": 46.7}], "Units": null, "Type": "Indicator"},
                "JNCPT Index": {"Description": "Japan CPI Tokyo YoY", "Ticker": "JNCPT Index", "Frequency": "Monthly", "values": [{"Date": "2014-01-31", "Ticker": "JNCPT Index", "Value": 0.7}, {"Date": "2014-02-28", "Ticker": "JNCPT Index", "Value": 1.1}, {"Date": "2014-03-31", "Ticker": "JNCPT Index", "Value": 1.3}, {"Date": "2014-04-30", "Ticker": "JNCPT Index", "Value": 2.9}, {"Date": "2014-05-31", "Ticker": "JNCPT Index", "Value": 3.1}, {"Date": "2014-06-30", "Ticker": "JNCPT Index", "Value": 3}, {"Date": "2014-07-31", "Ticker": "JNCPT Index", "Value": 2.8}, {"Date": "2014-08-31", "Ticker": "JNCPT Index", "Value": 2.8}, {"Date": "2014-09-30", "Ticker": "JNCPT Index", "Value": 2.8}, {"Date": "2014-10-31", "Ticker": "JNCPT Index", "Value": 2.5}, {"Date": "2014-11-30", "Ticker": "JNCPT Index", "Value": 2.1}, {"Date": "2014-12-31", "Ticker": "JNCPT Index", "Value": 2.2}], "Units": "% CHANGE", "Type": "Indicator"},
                "JNRETMOM Index": {"Description": "Japan Retail Trade MoM SA 2010=100", "Ticker": "JNRETMOM Index", "Frequency": "Monthly", "values": [{"Date": "2014-01-31", "Ticker": "JNRETMOM Index", "Value": 1.6}, {"Date": "2014-02-28", "Ticker": "JNRETMOM Index", "Value": 0.1}, {"Date": "2014-03-31", "Ticker": "JNRETMOM Index", "Value": 6.5}, {"Date": "2014-04-30", "Ticker": "JNRETMOM Index", "Value": -13.4}, {"Date": "2014-05-31", "Ticker": "JNRETMOM Index", "Value": 3.8}, {"Date": "2014-06-30", "Ticker": "JNRETMOM Index", "Value": 0.9}, {"Date": "2014-07-31", "Ticker": "JNRETMOM Index", "Value": 0.6}, {"Date": "2014-08-31", "Ticker": "JNRETMOM Index", "Value": 1.2}, {"Date": "2014-09-30", "Ticker": "JNRETMOM Index", "Value": 1.7}, {"Date": "2014-10-31", "Ticker": "JNRETMOM Index", "Value": -0.6}, {"Date": "2014-11-30", "Ticker": "JNRETMOM Index", "Value": 0}, {"Date": "2014-12-31", "Ticker": "JNRETMOM Index", "Value": 0}], "Units": "% CHANGE", "Type": "Indicator"}};

  console.log($scope.data);

  calculate($scope.data);

  function calculate(data) {
      $scope.values = {};
      $scope.desc = {};

    _.each($scope.data, function(d, k) {
      $scope.values[k] = _.pluck(d.values, 'Value');
      $scope.desc[k] = d.Description;
    })

    $scope.chartSeries = [];
    $scope.chartSeries = _.map($scope.values, function(d,k) {
      return {"name": k, "data": d}
    });

    $scope.chartList = [];
    $scope.chartConfig = {};

    _.each($scope.chartSeries, function(d, i) {
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
        series: [{data: d["data"], name: d["name"]}],
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
  }

  $scope.query = '';

  $scope.submit = function() {
    $scope.query = this.query;

    $http.get(API_CALL + $scope.query).
      then(function(response) {
        $scope.data = response.data;
        calculate($scope.data);

        console.log($scope.data);

      }, function(response) {
        // error
    });
  }

}]);
