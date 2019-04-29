var autopan = null;

mapboxgl.accessToken =
  "pk.eyJ1IjoibXdpbGJlciIsImEiOiJjaWswbW14dmMzOW8zdmdsenhmNm12MzU5In0.vv7SVA4Eau_NrJj_aeZgqQ";
var map = new mapboxgl.Map({
  container: "map", // container id
  style: "mapbox://styles/mwilber/cik0moi6w011690lxbamsqm7h", //hosted style id
  //style: 'mapbox://styles/mapbox/streets-v8',
  center: [-72.38, 39], // starting position
  pitch: 90, // pitch in degrees
  bearing: -5, // bearing in degrees
  zoom: 5 // starting zoom
});
map.scrollZoom.disable();

var geodata = {
  type: "geojson",
  data: {
    type: "FeatureCollection",
    features: []
  }
};

map.on("style.load", function() {
  map.addSource("markers", geodata);

  map.addLayer({
    id: "markers", // An id for this layer
    type: "circle", // As a point layer, we need style a symbol for each point.
    source: "markers", // The source layer we defined above
    paint: {
      "circle-radius": 10,
      "circle-color": "#ff0000"
    }
  });

  DoAutopan();
});

function DoAutopan() {
  autopan = setInterval(function() {
    map.panBy([-20, 0], {
      duration: 1000,
      easing: function(t) {
        return t;
      }
    });
  }, 1000);
}

function StopAutopan() {
  clearInterval(autopan);
}

function fly(pTarget) {
  map.flyTo({
    // These options control the ending camera position: centered at
    // the target, at zoom level 9, and north up.
    center: pTarget,
    zoom: 7,
    pitch: 90, // pitch in degrees
    bearing: -5,

    // These options control the flight curve, making it move
    // slowly and zoom out almost completely before starting
    // to pan.
    speed: 1, // make the flying slow
    curve: 1, // change the speed at which it zooms out

    // This can be any easing function: it takes a number between
    // 0 and 1 and returns another number between 0 and 1.
    easing: function(t) {
      return t;
    }
  });
}
