angular.module('ngBloom', ['ngRoute'])

 .controller('MainController', function($scope, $route, $routeParams, $location) {
     $scope.$route = $route;
     $scope.$location = $location;
     $scope.$routeParams = $routeParams;

     $scope.number = 4;
     $scope.getNumber = function(num) {
        return new Array(num);
     }
 })

 .controller('QueryController', function($scope, $routeParams) {
     $scope.name = "QueryController";
     $scope.params = $routeParams;
 })

 .controller('FetchController', function($scope, $routeParams) {
    $scope.query = '';
    $scope.data = [];
    $scope.submit = function() {
      $scope.query = this.query;
      $http.post('/fetch', {query: $scope.query}).
        then(function(response) {
          // $scope.data
        }, function(response) {
          // if error occur
        });
    };
    $scope.name = "FetchController";
    $scope.params = $routeParams;
  })

  .controller('ChartController', function ($scope) {

  $scope.chartTypes = [
    {"id": "line", "title": "Line"},
    {"id": "spline", "title": "Smooth line"},
    {"id": "area", "title": "Area"},
    {"id": "areaspline", "title": "Smooth area"},
    {"id": "column", "title": "Column"},
    {"id": "bar", "title": "Bar"},
    {"id": "pie", "title": "Pie"},
    {"id": "scatter", "title": "Scatter"}
  ];

  $scope.dashStyles = [
    {"id": "Solid", "title": "Solid"},
    {"id": "ShortDash", "title": "ShortDash"},
    {"id": "ShortDot", "title": "ShortDot"},
    {"id": "ShortDashDot", "title": "ShortDashDot"},
    {"id": "ShortDashDotDot", "title": "ShortDashDotDot"},
    {"id": "Dot", "title": "Dot"},
    {"id": "Dash", "title": "Dash"},
    {"id": "LongDash", "title": "LongDash"},
    {"id": "DashDot", "title": "DashDot"},
    {"id": "LongDashDot", "title": "LongDashDot"},
    {"id": "LongDashDotDot", "title": "LongDashDotDot"}
  ];

  $scope.chartSeries = [
    {"name": "Some data", "data": [1, 2, 4, 7, 3]},
    {"name": "Some data 3", "data": [3, 1, null, 5, 2], connectNulls: true},
    {"name": "Some data 2", "data": [5, 2, 2, 3, 5], type: "column"},
    {"name": "My Super Column", "data": [1, 1, 2, 3, 2], type: "column"}
  ];

  $scope.chartStack = [
    {"id": '', "title": "No"},
    {"id": "normal", "title": "Normal"},
    {"id": "percent", "title": "Percent"}
  ];

  $scope.addPoints = function () {
    var seriesArray = $scope.chartConfig.series;
    var rndIdx = Math.floor(Math.random() * seriesArray.length);
    seriesArray[rndIdx].data = seriesArray[rndIdx].data.concat([1, 10, 20])
  };

  $scope.addSeries = function () {
    var rnd = []
    for (var i = 0; i < 10; i++) {
      rnd.push(Math.floor(Math.random() * 20) + 1)
    }
    $scope.chartConfig.series.push({
      data: rnd
    })
  }

  $scope.removeRandomSeries = function () {
    var seriesArray = $scope.chartConfig.series;
    var rndIdx = Math.floor(Math.random() * seriesArray.length);
    seriesArray.splice(rndIdx, 1)
  }

  $scope.removeSeries = function (id) {
    var seriesArray = $scope.chartConfig.series;
    seriesArray.splice(id, 1)
  }

  $scope.toggleHighCharts = function () {
    this.chartConfig.useHighStocks = !this.chartConfig.useHighStocks
  }

  $scope.replaceAllSeries = function () {
    var data = [
      { name: "first", data: [10] },
      { name: "second", data: [3] },
      { name: "third", data: [13] }
    ];
    $scope.chartConfig.series = data;
  };

  $scope.chartConfig = {
      //Main highcharts options.
      options: {
          chart: {
              type: 'bar'
          }
      },
      //Series object - a list of series using normal highcharts series options.
      series: [{
          data: [10, 15, 12, 8, 7]
      }],
      //Title configuration
      title: {
          text: 'Hello'
      },
      //Boolean to control showng loading status on chart
      loading: false,
      //Configuration for the xAxis. Currently only one x axis can be dynamically controlled.
      //properties currentMin and currentMax provied 2-way binding to the chart's maximimum and minimum
      xAxis: {
       currentMin: 0,
       currentMax: 20,
       title: {text: 'values'}
      }
  }

  $scope.reflow = function () {
    $scope.$broadcast('highchartsng.reflow');
  };

})

.config(function($routeProvider, $locationProvider) {
  $routeProvider
  .when('/', {
    controller: 'MainController',
    templateUrl: 'template/query.html'
  })
  .when('/query', {
    controller: 'QueryController',
    templateUrl: 'template/query.html'
  })

});