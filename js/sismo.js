$(document).ready(function(){


d3.json("data/tweets_per_hour.json", function(error, data) {
  var values = data.values;
  var profile = data.profile;
  var opts = profile.opts;
  var tformat = opts.format;
  var tformatter = d3.timeFormat(tformat);
  var timezone = opts.timezone;
  var template = opts.template;
  var intervalStr = opts.intervalStr;
  var intervalLabel = opts.intervalLabel;

  function type(d) { 
    var parseTime = d3.timeParse(tformat);
    d.name = parseTime(d.name); // Tue Jun 30 2015 00:00:00 GMT-0700 (PDT)
    // d.name = d3.timeParse(tformat).parse(d.name);
  }

  var vlen = values.length;
  for (var i = 0; i < vlen; i++) {
      type(values[i]);
  }

  var margin = {top: 20, right: 5, bottom: 60, left: 60},
      width = parseInt(d3.select("#tweets_per_hour").style("width")) - margin.left - margin.right,
      height = parseInt(d3.select("#tweets_per_hour").style("height")) - margin.top - margin.bottom;

  var svg = d3.select("#tweets_per_hour")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scaleTime()
      .domain([
          d3.min(values, function(d) {return d.name}), 
          d3.max(values, function(d) {return d.name})
       ])
      .nice(d3.timeHour)
      .range([0, width]);

  var y = d3.scaleLinear()
      .domain([0, d3.max(values, function(d) { return d.value; })])
      .range([height, 0])
      .nice(5);

  var timespan = x.invert(width) - x.invert(0) // time span of x, in milliseconds
  var interval = opts.interval; // interval of datapoints, in milliseconds
  var intervalCount = timespan / interval; // how many intervals in x
  var barWidth = width / intervalCount; // width of one interval, in pixels

  // x-axis
  var xAxis = svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom().scale(x))
  .selectAll("text")
    .attr("y", 20)
    .attr("x", 9)
    .attr("dy", ".35em")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end");
  // .append("text")
  //   .attr("class", "label")
  //   .attr("x", width / 2)
  //   .attr("y", 30)
  //   .style("text-anchor", "middle")
  //   .text("Date");
      
  // y-axis
  var yAxis = svg.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft().scale(y).tickSizeOuter(0).ticks(6))
  .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", -70)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Tweets");

  var bar = svg.selectAll(".bar")
    .data(values)
  .enter().append("g")
    .append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d.name); })
    .attr("width", barWidth)
    .attr("y", function(d) { return y(d.value); })
    .attr("height", function(d) { return height - y(d.value); })
    .append("svg:title")
    .text(function(d) { return tformatter(d.name) + ": " + d.value + " tweets"; });
});


// Hashtags

d3.json("data/wordcloud_hashtags.json", function(error, dataset) {

    var width = 720,
        height = 500;


    var svg = d3.select("#wordcloud_hashtags")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("class", "bubble");

    var diameter = 400;
    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var bubble = d3.pack(dataset)
            .size([width, height])
            .padding(1.5);

    var nodes = d3.hierarchy(dataset)
            .sum(function(d) { return d.tweetCount; });

    var node = svg.selectAll(".node")
            .data(bubble(nodes).descendants())
            .enter()
            .filter(function(d){
                return  !d.children
            })
            .append("g")
            .attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

    node.append("title")
            .text(function(d) {
                return d.data.hashtag;
            });

    node.append("circle")
            .attr("r", function(d) {
                return d.r;
            })
            .style("fill", function(d) {
                return color(d.data.hashtag);
            });

    node.append("text")
            .attr("dy", ".3em")
            .style("text-anchor", "middle")
            .text(function(d) {
                return d.data.hashtag;
            });

    d3.select(self.frameElement)
            .style("height", diameter + "px");
});

// Geo data
var max, scale,
    classes = 9,
    scheme = colorbrewer["YlOrRd"][classes],
    container = L.DomUtil.get('map'),
    map = L.map(container).setView([19.4326,-99.1332], 4);

L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy;<a href="https://carto.com/attribution">CARTO</a>'
      }).addTo(map);

// Async call for data. Source URL is loaded from container element's
// 'data-source' attribute.
    // When data arrives, create leaflet layer with custom style callback.
d3.json(container.dataset.source, function(error, collection) {
  // hex_layer = L.hexLayer(collection, {
  //     applyStyle: hex_style
  // });

  var hex_layer = L.hexbinLayer();
  hex_layer.addTo(map);
  hex_layer.data(collection);
});

/**
 * Hexbin style callback.
 *
 * Determines a quantize scale (http://bl.ocks.org/4060606) based on the
 * map's initial data density (which is based on the initial zoom level)
 * and applies a colorbrewer (http://colorbrewer2.org/) colour scheme
 * accordingly.
 */
function hex_style(hexagons) {
    // Maintain a density scale relative to initial zoom level.
    if (!(max && scale)) {
        max = d3.max(hexagons.data(), function (d) { return d.length; });
        scale = d3.scale.quantize()
                .domain([0, max])
                .range(d3.range(classes));
    }

    hexagons
        .attr("stroke", scheme[classes - 1])
        .attr("fill", function (d) {
            return scheme[scale(d.length)];
        });
}


// Bigrams
d3.json("data/top_bigrams.json", function(error, data){
    var margin = {top: 20, right: 25, bottom: 50, left: 200},
      width = parseInt(d3.select("#bigrams").style("width")) - margin.left - margin.right,
      height = parseInt(d3.select("#bigrams").style("height")) - margin.top - margin.bottom;

    data.forEach(function(d) {
      d.bigram_count = +d.bigram_count;
    });
    data.sort(function(a, b) { return a.bigram_count - b.bigram_count; });

    var svg = d3.select("#bigrams")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var y = d3.scaleBand()
          .range([height, 0])
          .padding(0.1);
    var x = d3.scaleLinear().range([0, width]);

    x.domain([0, d3.max(data, function(d) { return d.bigram_count; })]).nice();
    y.domain(data.map(function(d) { return d.bigram; }));

    var xAxis = svg.append("g")
      .attr("class", "x axis bigrams")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom().scale(x).tickValues([20000, 40000, 60000, 80000, 100000]));

    var yAxis = svg.append("g")
      .attr("class", "y axis bigrams")
      .call(d3.axisLeft(y));


    svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar hashtags")
      .attr("transform", function(d) { return "translate(0," + y(d.bigram) + ")"; })
      .attr("width", function(d) { return x(d.bigram_count); })
      .attr("height", y.bandwidth());

    svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 30) + ")")
      .style("text-anchor", "middle")
      .attr("class", "axis_title")
      .text("Occurencias de Bigrama");

});


d3.json("data/retweets_by_hour.json", function(error, data) {

  // USER DEFINABLE VARIABLES START

  var numHistBins = 30; // number of bins for the histogram
  var calcHistBinsAutmoatic = false; // if true, the number of bins are calculated automatically and
  // numHistBins is overwritten
  var showKDP = true; // show the kernel density plot?
  var bandwith = 4; // bandwith (smoothing constant) h of the kernel density estimator
  var data_length = data.length;

  // USER DEFINABLE VARIABLES END

  var margin = {top: 40, right: 25, bottom: 60, left: 70},
      width = parseInt(d3.select("#tweets_per_hour").style("width")) - margin.left - margin.right,
      height = parseInt(d3.select("#tweets_per_hour").style("height")) - margin.top - margin.bottom;

  var svg = d3.select("#retweets_per_hour")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scaleLinear()
      .range([0, width]);

  var y = d3.scaleLinear()
      .range([height, 0]);

  var xAxis = d3.axisBottom()
      .scale(x);

  var yAxis = d3.axisLeft()
      .scale(y)
      .ticks(6, "%");

  // x.domain([0, d3.max(data, function(d) { return +d; })]);
  x.domain([0, 36]);

  var line = d3.line()
    .x(function(d) { return x(d[0]); })
    .y(function(d) { return y(d[1]); });

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  var histogram;

  // calculate the number of histogram bins
  if( calcHistBinsAutmoatic == true) {
     numHistBins = Math.ceil(Math.sqrt(faithful.length));  // global variable
  }
  // the histogram function
  histogram = d3.histogram()
    .thresholds(numHistBins);

  var plotted = histogram(data);
  var kde = kernelDensityEstimator(epanechnikovKernel(bandwith), x.ticks(100));

  y.domain([0, d3.max(plotted, function(d) { return d.length; }) / data_length]).nice();
  svg.append("g")
      .attr("class", "y axis retweets")
      .call(yAxis);


  svg.selectAll(".bar")
      .data(plotted)
    .enter().append("rect")
      .attr("class", "bar retweets")
      .attr("x", 1)
      .attr("transform", function(d) {
          return "translate(" + x(d.x0) + "," + y(d.length / data_length) + ")"; })
      .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
      .attr("height", function(d) { return height - y(d.length / data_length); });

      // .attr("x", function(d) { return x(d.x0) + 1; })
      // .attr("y", function(d) { return y(d.y); })
      // .attr("width", x(plotted[0].dx + plotted[0].x) - x(plotted[0].x) - 1)
      // .attr("height", function(d) { return height - y(d.y); });
  
  // show the kernel density plot
  if(showKDP == true) {
    svg.append("path")
      .datum(kde(data))
      .attr("class", "line")
      .attr("d", line);
    }

  svg.append("text")
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 10) + ")")
      .style("text-anchor", "middle")
      .attr("class", "axis_title")
      .text("Número de Horas Después de Tweet Inicial");

  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axis_title")
      .style("text-anchor", "middle")
      .text("% de Retweets");  


});


function kernelDensityEstimator(kernel, x) {
  return function(sample) {
    return x.map(function(x) {
    //console.log(x + " ... " + d3.mean(sample, function(v) { return kernel(x - v); }));    
    return [x, d3.mean(sample, function(v) { return kernel(x - v); })];
    });
  };
}

function epanechnikovKernel(bandwith) {
  return function(u) {
    //return Math.abs(u /= bandwith) <= 1 ? .75 * (1 - u * u) / bandwith : 0;
  if(Math.abs(u = u /  bandwith) <= 1) {
   return 0.75 * (1 - u * u) / bandwith;
  } else return 0;
  };
}


});