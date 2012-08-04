// ATLAS and CMS Luminosity SVG proposal for a new dashboard
// Copyright (C) 2012 Daniel Lombraña González
// 
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
var spinner = new Throbber({
    color: 'black',
    size: 90
});

spinner.appendTo (document.getElementById('throbber'));

spinner.Start();

var m=1;
var n=2;
var margin = 20,
    //width = window.innerWidth - margin,
    width = 60*12,
    height = 500 - .5 - margin,
    mx = m,
    my ,
    mz ,
    x, 
    y0, 
    y1, 
    y2; 

d3.csv('data/atlas.csv', function(csv){ 
    var dates = [];
    var format = d3.time.format("%H:%M:%S");
    csv.map(function(d){
        var s = d['Timestamp'].split(" ");
        s = s[1].split(".");
        var date = format.parse(s[0]); 
        dates.push(date);
        d['Timestamp']=date;
    });

m = csv.length/20; 
var data = d3.layout.stack()(stream_layers(n, m)),
    color = d3.interpolateRgb("#aad", "#556");


margin = 20,
    width = $("#he").width(),
    height = 500 - .5 - margin,
    mx = m,
    my = d3.max(data, function(d) {
      return d3.max(d, function(d) {
        return d.y0 + d.y;
      });
    }),
    mz = d3.max(data, function(d) {
      return d3.max(d, function(d) {
        return d.y;
      });
    }),
    x = function(d) { return d.x * width / mx; },
    y0 = function(d) { return height - d.y0 * height / my; },
    y1 = function(d) { return height - (d.y + d.y0) * height / my; },
    y2 = function(d) { return d.y * height / mz; }; // or `my` to not rescale

var vis = d3.select("#chart")
  .append("svg")
    .attr("width", width)
    .attr("height", height + margin);

var layers = vis.selectAll("g.layer")
    .data(data)
  .enter().append("g")
    .style("fill", function(d, i) { return color(i / (n - 1)); })
    .attr("class", "layer");

var bars = layers.selectAll("g.bar")
    .data(function(d) { return d; })
  .enter().append("g")
    .attr("class", "bar")
    .attr("transform", function(d) { return "translate(" + x(d) + ",0)"; });

bars.append("rect")
    .attr("width", x({x: .9}))
    .attr("x", 0)
    .attr("y", height)
    .attr("height", 0)
  .transition()
    .delay(function(d, i) { return i * 10; })
    .attr("y", y1)
    .attr("height", function(d) { return y0(d) - y1(d); });

var labels = vis.selectAll("text.label")
    .data(data[0])
  .enter().append("text")
    .attr("class", "label")
    .attr("x", x)
    .attr("y", height + 6)
    .attr("dx", x({x: .45}))
    .attr("dy", ".71em")
    .attr("text-anchor", "left")
    .text(function(d, i) { 
        if ( ( i %40 )==0 ) return format(csv[i]['Timestamp']);
    });

vis.append("line")
    .attr("x1", 0)
    .attr("x2", width - x({x: .1}))
    .attr("y1", height)
    .attr("y2", height);

function stream_layers(n, m) {
    var j=0;
    var o = d3.range(n).map(function() {
        var a = [], i;
        if (j == 1) {
        for (i = 0; i < m; i++) a[i] = parseFloat(csv[i]['Value']);
        }
        else {
        for (i = 0; i < m; i++) {
            if (Math.random() > 0.5)
                {
                a[i] = parseFloat(csv[i]['Value']) - Math.random()*200;
                }
            else {
                a[i] = parseFloat(csv[i]['Value']) + Math.random()*200;
            }
        
        }
        }
        j = j +1;
        return a.map(stream_index);
      });
    return o;
}

function stream_index(d, i) {
    //console.log(csv[i]['Timestamp']);
  return {x: i, y: Math.max(0, d)};
}

spinner.stop();

});

function transitionGroup() {
  var group = d3.selectAll("#chart");

  $("#group").toggleClass("active");
  $("#stack").toggleClass("active");
  group.select("#group")
      .attr("class", "active");

  group.select("#stack")
      .attr("class", "");

  group.selectAll("g.layer rect")
    .transition()
      .duration(500)
      .delay(function(d, i) { return (i % m) * 10; })
      .attr("x", function(d, i) { return x({x: .9 * ~~(i / m) / n}); })
      .attr("width", x({x: .9 / n}))
      .each("end", transitionEnd);

  function transitionEnd() {
    d3.select(this)
      .transition()
        .duration(500)
        .attr("y", function(d) { return height - y2(d); })
        .attr("height", y2);
  }
}

function transitionStack() {
    console.log(m);
    console.log(m);
  var stack = d3.select("#chart");

  $("#stack").toggleClass("active");
  $("#group").toggleClass("active");

  stack.select("#group")
      .attr("class", "first");

  stack.select("#stack")
      .attr("class", "last active");

  stack.selectAll("g.layer rect")
    .transition()
      .duration(500)
      .delay(function(d, i) { return (i % m) * 10; })
      .attr("y", y1)
      .attr("height", function(d) { return y0(d) - y1(d); })
      .each("end", transitionEnd);

  function transitionEnd() {
    d3.select(this)
      .transition()
        .duration(500)
        .attr("x", 0)
        .attr("width", x({x: .9}));
  }
}
