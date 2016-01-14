var blessed = require('blessed')
  , contrib = require('blessed-contrib')
  , screen = blessed.screen()
  , grid = new contrib.grid({rows: 1, cols: 2, screen: screen})

var geoip = require('geoip-lite')
var fs = require('fs')

var map = grid.set(0, 0, 1, 1, contrib.map, {label: 'Visitors Location'})
var log = grid.set(0, 1, 1, 1, contrib.log, {
    fg: "green"
    , selectedFg: "green"
    , label: "Server Log"
    });

function markVisitors(file) {
  fs.readFile(file, 'utf8', function (err, data) {
      if (err) throw err;
      var ips = data.split("\n")
      for (var i=0; i < ips.length; i++) {
          var gdat = geoip.lookup(ips[i]);
          if (gdat == null) continue;
          log.log(gdat.country);
          map.addMarker({"lon": gdat.ll[1], "lat": gdat.ll[0], color: "red", char: "X"})
      }
  });
  screen.render()
}

setInterval(function() { markVisitors('iplist') }, 1000)

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
});
screen.render()
