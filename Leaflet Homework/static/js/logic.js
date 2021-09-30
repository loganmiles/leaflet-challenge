// config map view
var map = L.map("map", {
    center: [40, -100],
    zoom: 5
  });

// create base map
var basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
basemap.addTo(map);

var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson'

d3.json(url).then(data => {

    var features = data['features'];
    var layerGroup = L.layerGroup()

    features.forEach(feature => {
        
      var location = feature['properties']['place'];
      var title = feature['properties']['title'];
      var mag = feature['properties']['mag'];
      var depth = feature['geometry']['coordinates'][2];
      var lon = feature['geometry']['coordinates'][0];
      var lat = feature['geometry']['coordinates'][1];
      var coords = [lat, lon];
      var time = feature['properties']['time']
      var color = "";

      if (mag > 5) {
        color = "red";
      }
      else if (mag > 4) {
        color = "orange";
      }
      else if (mag > 3) {
        color = "yellow";
      }
      else {
      color = "green";
      };
      

      marker = L.circle(coords, {
        fillOpacity: 0.6,
        radius: (Math.sqrt(mag)*40000),
        color: 'white',
        fillColor: color
      });
      marker.bindPopup(`${title}<hr/>Depth: ${depth}`);
      marker.addTo(layerGroup);
      


    })

    layerGroup.addTo(map)

    var legend = L.control({postion: 'bottomright'});
    legend.onAdd = function(map) {
        var div = L.DomUtil.create("div", "legend");
        div.innerHTML += "<h4>Magnitude</h4>";
        div.innerHTML += '<i style="background: red"></i><span> 5.0 - < </span><br>';
        div.innerHTML += '<i style="background: orange"></i><span> 4 - 4.9 </span><br>';
        div.innerHTML += '<i style="background: yellow"></i><span> 3 - 3.9 </span><br>';
        div.innerHTML += '<i style="background: green"></i><span> < 3.0 </span><br>';

        return div;
    };
    legend.addTo(map);


})