//
// Configuration
//

// ms to wait after dragging before auto-rotating
const rotationDelay = 3000;
// scale of the globe (not the canvas element)
const scaleFactor = 0.9;
// autorotation speed
// TODO make a function to speed up the autorotation  for on drag for 3 seconds after mouse up
//TODO stop the rotaion on mouse clidk and display the country info
var degPerSec = 10; //rotation speed of globe
// start angles positions the glob on its proper axis
var angles = { x: -20, y: 40, z: 0 };
// colors
var colorWater = "#fff";
var colorLand = "#111";
var colorGraticule = "#ccc"; //lat and log lines
var colorCountry = "#a00"; //on click or hover

//
// Handler
//

function enter(country) {
  var country = countryList.find(function(c) {
    return c.id === country.id;
  });
  current.text((country && country.name) || ""); //the name of the country get ID from API compare to tsv file and return corresponding name
}

function leave(country) {
  current.text("");
}

//
// Variables
//

var current = d3.select("#current");
var canvas = d3.select("#globe");
var context = canvas.node().getContext("2d");
var water = { type: "Sphere" };
var projection = d3.geoOrthographic().precision(0.1);
var graticule = d3.geoGraticule10();
var path = d3.geoPath(projection).context(context);
var v0; // Mouse position in Cartesian coordinates at start of drag gesture.
var r0; // Projection rotation as Euler angles at start.
var q0; // Projection rotation as versor at start.
var lastTime = d3.now();
// TODO what is this var doing
var degPerMs = degPerSec / 1000;
var width, height;
var land, countries;
var countryList;
var autorotate, now, diff, roation;
var currentCountry;

//
// Functions
//

function setAngles() {
  var rotation = projection.rotate();
  rotation[0] = angles.y;
  rotation[1] = angles.x;
  rotation[2] = angles.z;
  projection.rotate(rotation);
}

function scale() {
  width = document.documentElement.clientWidth;
  height = document.documentElement.clientHeight;
  canvas.attr("width", width).attr("height", height);
  projection
    .scale((scaleFactor * Math.min(width, height)) / 2)
    .translate([width / 2, height / 2]);
  render();
}

function startRotation(delay) {
  autorotate.restart(rotate, delay || 0);
}

function stopRotation() {
  autorotate.stop();
}

function dragstarted() {
  v0 = versor.cartesian(projection.invert(d3.mouse(this)));
  r0 = projection.rotate();
  q0 = versor(r0);
  stopRotation();
}

function dragged() {
  var v1 = versor.cartesian(projection.rotate(r0).invert(d3.mouse(this)));
  var q1 = versor.multiply(q0, versor.delta(v0, v1));
  var r1 = versor.rotation(q1);
  projection.rotate(r1);
  render();
}

function dragended() {
  startRotation(rotationDelay);
}

function render() {
  context.clearRect(0, 0, width, height);
  fill(water, colorWater);
  stroke(graticule, colorGraticule);
  fill(land, colorLand);
  if (currentCountry) {
    fill(currentCountry, colorCountry);

    // console.log(currentCountry.id);
  }
}

function fill(obj, color) {
  context.beginPath();
  path(obj);
  context.fillStyle = color;
  context.fill();
}

function stroke(obj, color) {
  context.beginPath();
  path(obj);
  context.strokeStyle = color;
  context.stroke();
}

function rotate(elapsed) {
  now = d3.now();
  diff = now - lastTime;
  if (diff < elapsed) {
    rotation = projection.rotate();
    rotation[0] += diff * degPerMs;
    projection.rotate(rotation);
    render();
  }
  lastTime = now;
}

function loadData(cb) {
  // looks like this links to this site via unpkg https://www.npmjs.com/package/world-atlas
  // https://github.com/topojson/topojson-specification/blob/master/README.md#21-topology-objects

  d3.json("https://unpkg.com/world-atlas@1.1.4/world/110m.json", function(
    error,
    world
  ) {
    if (error) throw error;
    d3.tsv(
      //link to list of countries as a tab separated value  .tsv
      //TODO there is a miss match with the 2 diget countries somewhere a leading 0 is being generated so not mathcing this list
      //putting the names into file is not working cors error it may work if could grab from backend what about putting into an object array ?
      // "https://gist.githubusercontent.com/mbostock/4090846/raw/07e73f3c2d21558489604a0bc434b3a5cf41a867/world-country-names.tsv",
      //put thte tsv in a repo and this is working until I get back end set up
      "https://ar123456.github.io/world-country-names/world-country-names.tsv",
      function(error, countries) {
        if (error) throw error;
        cb(world, countries);
        console.log("contries  loadData :", countries);
      }
    );
  });
}

// https://github.com/d3/d3-polygon
function polygonContains(polygon, point) {
  var n = polygon.length;
  var p = polygon[n - 1];
  var x = point[0],
    y = point[1];
  var x0 = p[0],
    y0 = p[1];
  var x1, y1;
  var inside = false;
  for (var i = 0; i < n; ++i) {
    (p = polygon[i]), (x1 = p[0]), (y1 = p[1]);
    if (y1 > y !== y0 > y && x < ((x0 - x1) * (y - y1)) / (y0 - y1) + x1)
      inside = !inside;
    (x0 = x1), (y0 = y1);
  }
  return inside;
}

function mousemove() {
  var c = getCountry(this);
  if (!c) {
    if (currentCountry) {
      leave(currentCountry);
      currentCountry = undefined;
      render();
    }
    return;
  }
  if (c === currentCountry) {
    return;
  }
  currentCountry = c;
  // in this console.log the id from the API
  console.log("This is the c value: ", c.id);
  render();
  enter(c);
}

function getCountry(event) {
  var pos = projection.invert(d3.mouse(event));
  return countries.features.find(function(f) {
    return f.geometry.coordinates.find(function(c1) {
      return (
        polygonContains(c1, pos) ||
        c1.find(function(c2) {
          return polygonContains(c2, pos);
        })
      );
    });
  });
}

//
// Initialization
//

setAngles();

canvas
  .call(
    d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended)
  )
  .on("mousemove", mousemove);

loadData(function(world, cList) {
  land = topojson.feature(world, world.objects.land);
  countries = topojson.feature(world, world.objects.countries);
  countryList = cList;

  window.addEventListener("resize", scale);
  scale();
  autorotate = d3.timer(rotate);
});

// ***********For inertia use this package  https://www.npmjs.com/package/d3-inertia***
// the code below  comes from this example https://bl.ocks.org/Fil/63366253a5d2f00640c15b096c29a38c

var inertia = d3.geoInertiaDrag(canvas, render);
d3.timer(function(e) {
  if (inertia.timer) return;
  var rotate = projection.rotate();
  projection.rotate([rotate[0] + 0.12, rotate[1], rotate[2]]);
  render();
  // TODO need a way to stop the inertia rotation on a click or double click . Right now it spins without stopping. Need a way to stop it so country name display and eventual recipe stay on the
});
