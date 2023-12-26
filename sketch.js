var magnitudes;
var depths;
var latitudes, longitudes;
var magnitudeMin, magnitudeMax;
var depthMin, depthMax;

var circles = [];

var table;
var mymap;

const categories = [
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Guam",
  "Hawaii",
  "Idaho",
  "Kentucky",
  "Maine",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Mexico",
  "North Carolina",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Puerto Rico",
  "Tennessee",
  "Texas",
  "U.S. Virgin Islands",
  "Utah",
  "Washington",
  "Wyoming",
];

function preload() {
  table = loadTable("assets/FinalData.csv", "csv", "header");
  //   console.log(table);
}

function setup() {
  noLoop();
  // create own map
  var mapContainer = L.DomUtil.get("quake-map");
  mapContainer.style.width = "100%";
  mapContainer.style.height = "100vh"; // 100% of the viewport height
  mymap = L.map("quake-map", {
    minZoom: 3, // Set the minimum zoom level to 3 or any other suitable value
    maxZoom: 18, // Set the maximum zoom level if needed
  }).setView([51.505, -0.09], 3);

  // load map
  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
    {
      subdomains: "abcd",
      maxZoom: 18,
    }
  ).addTo(mymap);

  // call our function (defined below) that populates the maps with markers based on the table contents
  drawDataPoints();
  //   drawKey();
}

function drawDataPoints() {
  strokeWeight(5);
  stroke(255, 0, 0);

  // get the two arrays of interest: depth and magnitude
  depths = table.getColumn("depth");
  magnitudes = table.getColumn("mag");
  latitudes = table.getColumn("latitude");
  longitudes = table.getColumn("longitude");
  places = table.getColumn("placeCondensed");

  // get minimum and maximum values for both
  magnitudeMin = 0.0;
  magnitudeMax = getColumnMax("mag");
  console.log("magnitude range:", [magnitudeMin, magnitudeMax]);

  depthMin = 0.0;
  depthMax = getColumnMax("depth");
  console.log("depth range:", [depthMin, depthMax]);

  // cycle through the parallel arrays and add a dot for each event
  for (var i = 0; i < depths.length; i++) {
    let color = getColorForLocation(places[i]);
    // create a new dot
    var circle = L.circle([latitudes[i], longitudes[i]], {
      color: color, // the dot stroke color
      fillColor: color, // the dot fill color
      fillOpacity: 0.02, // use some transparency so we can see overlaps
      radius: magnitudes[i] * 10000,
    });

    // place it on the map
    circle.addTo(mymap);

    // save a reference to the circle for later
    circles.push(circle);
  }
}

function removeAllCircles() {
  // remove each circle from the map and empty our array of references
  circles.forEach(function (circle, i) {
    mymap.removeLayer(circle);
  });
  circles = [];
}

// get the maximum value within a column
function getColumnMax(columnName) {
  // get the array of strings in the specified column
  var colStrings = table.getColumn(columnName);

  // convert to a list of numbers by running each element through the `float` function
  var colValues = _.map(colStrings, float);

  // find the max value by manually stepping through the list and replacing `m` each time we
  // encounter a value larger than the biggest we've seen so far
  var m = 0.0;
  for (var i = 0; i < colValues.length; i++) {
    if (colValues[i] > m) {
      m = colValues[i];
    }
  }
  return m;

  // or do it the 'easy way' by using lodash:
  // return _.max(colValues);
}

function getColorForLocation(placeCondensed) {
  // Assign colors based on location
  // You can customize this based on your specific requirements
  let colors = {
    Alaska: color(169, 250, 110),
    Arizona: color(185, 243, 95),
    Arkansas: color(200, 236, 81),
    California: color(214, 228, 69),
    Colorado: color(227, 220, 60),
    Guam: color(239, 211, 53),
    Hawaii: color(250, 202, 50),
    Idaho: color(255, 193, 51),
    Kentucky: color(255, 183, 55),
    Maine: color(255, 173, 61),
    Missouri: color(255, 163, 69),
    Montana: color(255, 153, 79),
    Nebraska: color(255, 143, 89),
    Nevada: color(255, 132, 100),
    "New Mexico": color(255, 123, 111),
    "North Carolina": color(255, 114, 123),
    Ohio: color(255, 106, 136),
    Oklahoma: color(255, 99, 148),
    Oregon: color(255, 94, 161),
    "Puerto Rico": color(255, 91, 174),
    Tennessee: color(255, 91, 187),
    Texas: color(255, 92, 199),
    "U.S. Virgin Islands": color(246, 95, 211),
    Utah: color(230, 99, 222),
    Washington: color(245, 95, 212),
    Wyoming: color(245, 95, 212),
  };

  return colors[placeCondensed] || "gray"; // Default to gray if not found
}
