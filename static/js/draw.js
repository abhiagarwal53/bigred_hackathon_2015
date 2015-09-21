d3.select(window).on("resize", throttle);

var zoom = d3.behavior.zoom()
    .scaleExtent([1, 9])
    .on("zoom", move);

var width = document.getElementById('container').offsetWidth;
var height = width / 2;

var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width2 = width * .3,
    height2 = width2/2;

var colors = d3.scale.category10();

var x = d3.time.scale()
  .range([0, width2]);

var y = d3.scale.linear()
  .range([height2, 0]);

var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom")
  .tickFormat(d3.time.format("%b"));

var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left")
  .ticks(6);

var line = d3.svg.line()
  .x(function(d) { return x(d.Parsed); })
  .y(function(d) { return y(d.Value); });

var line2 = d3.svg.line()
  .x(function(d) { return x(d.Parsed); })
  .y(function(d) { return y(d.Value); });

var topo,projection,path,svg,g;

var graticule = d3.geo.graticule();

var tooltip = d3.select("#container").append("div").attr("class", "tooltip hidden");

var map, unemploy, unemployKeys;

init(width,height);
// initDetail(DUMMY);

function init(width,height){
  projection = d3.geo.mercator()
    .translate([(width/2), (height/2)])
    .scale( width / 2 / Math.PI);

  path = d3.geo.path().projection(projection);

  svg = d3.select("#container").append("svg")
      .attr("width", width)
      .attr("height", height)
      .call(zoom)
      //.on("click", click)
      .append("g");

  g = svg.append("g")
         .on("click", click);
}

queue()
  .defer(d3.json, "static/data/world-topo-min.json")
  .defer(d3.json, "static/data/unemploy.json")
  .await(ready);

function ready(error, map, data) {
  unemploy = data;
  unemployKeys = _.keys(unemploy);
  drawMap(map);
}

function drawMap(world) {
  var countries = topojson.feature(world, world.objects.countries).features;

  topo = countries;
  draw(topo);
  console.log(topo); 
}

function draw(topo) {

  svg.append("path")
     .datum(graticule)
     .attr("class", "graticule")
     .attr("d", path);

  g.append("path")
   .datum({type: "LineString", coordinates: [[-180, 0], [-90, 0], [0, 0], [90, 0], [180, 0]]})
   .attr("class", "equator")
   .attr("d", path);


  var country = g.selectAll(".country").data(topo);

  country.enter().insert("path")
      .attr("class", "country")
      .attr("d", path)
      .attr("id", function(d,i) { return d.id; })
      .attr("title", function(d,i) { return d.properties.name; })
      .style("fill", function(d, i) { 
        if (unemployKeys.indexOf(d.properties.name) > -1) {
          console.log(unemploy[d.properties.name]);
          return unemploy[d.properties.name][0].indicator > 0 ? "#e34a33" : "#addd8e";   
        } else {
          return "#969696";
        }
    });

  //offsets for tooltips
  var offsetL = document.getElementById('container').offsetLeft+20;
  var offsetT = document.getElementById('container').offsetTop+10;

  //tooltips
  country
    .on("mousemove", function(d,i) {

      var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );

      tooltip.classed("hidden", false)
             .attr("id", d.properties.name.toLowerCase())
             .attr("style", "left:"+(mouse[0]+offsetL)+"px;top:"+(mouse[1]+offsetT)+"px")
             .html(d.properties.name + '<div class="detail"></div>');

      var unemployData;
      unemployData = unemploy[d.properties.name];

      if(unemployKeys.indexOf(d.properties.name) > -1) {
        initDetail(unemployData); 
      }

      })
      .on("mouseout",  function(d,i) {
        tooltip.classed("hidden", true);
      }); 

  drawLegend();

  function drawLegend() {
    svg.append("circle")
      .attr("cx", 12)
      .attr("cy", height - 12)
      .attr("r", 5)
      .style("fill", "#addd8e");

    svg.append("text")
      .attr("class", "legend")
      .attr("x", 20)
      .attr("y", height - 8)
      .text("Decreasing unemployment");

    svg.append("circle")
      .attr("cx", 12)
      .attr("cy", height - 27)
      .attr("r", 5)
      .style("fill", "#e34a33");

    svg.append("text")
      .attr("class", "legend")
      .attr("x", 20)
      .attr("y", height - 23)
      .text("Increasing unemployment");
  }
}

function initDetail(unemployData) {
  var data = _.reduceRight(_.pluck(unemployData, 'values'), function(a,b) { return a.concat(b); });

  console.log(data);

  var parseDate = d3.time.format("%Y-%m-%d").parse;

  var svg2 = d3.select(".detail").append("svg")
    .attr("width", width2 + margin.left + margin.right)
    .attr("height", height2 + margin.top + margin.bottom)
   .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  data.forEach(function(d) {
    d.Parsed = parseDate(d.Date);
  });

  console.log(data);

  x.domain(d3.extent(data, function(d) { return d.Parsed; }));
  y.domain(d3.extent(data, function(d) { return d.Value; }));
  // y.domain([0, d3.max(data, function(d) { return d.Value; })]);

  svg2.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height2 + ")")
    .call(xAxis);

  svg2.append("g")
    .attr("class", "y axis")
    .call(yAxis)
   .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Unemployment ratio (%)");

  svg2.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", line);

  svg2.append("text")
    .datum(data)
    .attr("y", 0)
    .attr("x", width2/2)
    .text("Year 2014")
    .style("text-anchor", "middle");
}

function redraw() {
  width = document.getElementById('container').offsetWidth;
  height = width / 2;
  d3.select('svg').remove();
  init(width,height);
  draw(topo);
}

function move() {
  var t = d3.event.translate;
  var s = d3.event.scale; 
  zscale = s;
  var h = height/4;

  t[0] = Math.min(
    (width/height)  * (s - 1), 
    Math.max( width * (1 - s), t[0] )
  );

  t[1] = Math.min(
    h * (s - 1) + h * s, 
    Math.max(height  * (1 - s) - h * s, t[1])
  );

  zoom.translate(t);
  g.attr("transform", "translate(" + t + ")scale(" + s + ")");

  //adjust the country hover stroke width based on zoom level
  d3.selectAll(".country").style("stroke-width", 1.5 / s);
}

var throttleTimer;
function throttle() {
  window.clearTimeout(throttleTimer);
    throttleTimer = window.setTimeout(function() {
      redraw();
    }, 200);
}


//geo translation on mouse click in map
function click() {
  var latlon = projection.invert(d3.mouse(this));
  console.log(latlon);

  // give query results
  
}


//function to add points and text to the map (used in plotting capitals)
function addpoint(lat,lon,text) {

  var gpoint = g.append("g").attr("class", "gpoint");
  var x = projection([lat,lon])[0];
  var y = projection([lat,lon])[1];

  gpoint.append("svg:circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("class","point")
        .attr("r", 1.5);

  //conditional in case a point has no associated text
  if(text.length>0){

    gpoint.append("text")
          .attr("x", x+2)
          .attr("y", y+2)
          .attr("class","text")
          .text(text);
  }

}