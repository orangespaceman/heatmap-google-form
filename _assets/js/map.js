(function(config) {

  var map;
  var tiles;
  var heat;
  var hotspotCount = 0;

  var options = {
    minOpacity: config.map.minOpacity,
    radius: config.map.radius,
    max: config.map.max,
  };

  function init() {
    createMap();
    loadData();

    // uncomment to test random heatmap population
    // setTimeout(addRandomPoint, 1000);
  }

  function createMap() {
    map = L.map('map').setView([config.map.lat, config.map.lon], config.map.zoom);

    tiles = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    heat = L.heatLayer([], options).addTo(map);
  }

  function loadData() {
    var url = 'https://sheets.googleapis.com/v4/spreadsheets/' + config.spreadsheet.id + '/values/' + config.spreadsheet.sheet + '!' + config.spreadsheet.range + '?key=' + config.spreadsheet.apiKey;

    request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.send();
    request.onreadystatechange = updateMapData;
  }

  function updateMapData() {
    if (this.readyState === 4) {
      if (this.status === 200 || this.status === 0) {
        try {
          var response = JSON.parse(this.response);
          if (response.values) {

            // extract just the new responses to update the map
            if (response.values.length > hotspotCount) {
              var hotspots = response.values.slice(hotspotCount);
              hotspotCount = response.values.length;
              updateMap(hotspots);
            }
          }
        } catch (e) {
          console.log(e);
        }
      }

      // update every minute
      setTimeout(loadData, 1000 * 30);
    }
  }

  function updateMap(hotspots) {
    console.log(hotspots);
    hotspots.forEach(function(hotspot) {
      heat.addLatLng(hotspot);
    });
  }

  // test heatmap
  function addRandomPoint() {
    var lat = generateRandom(config.map.lat - 0.2, config.map.lat + 0.2, 8);
    var lng = generateRandom(config.map.lon - 0.2, config.map.lon + 0.2, 8);
    heat.addLatLng([lat, lng]);
    setTimeout(addRandomPoint, 1000);
  }

  function generateRandom(min, max, decimals) {
    var precision = '1' + '0'.repeat(decimals);
    return Math.floor(Math.random() * (max * precision - min * precision) + min * precision) / (1 * precision);
  }

  init();
})(window.CONFIG);
