"use strict";
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

var processed = [];

function markVisitors(file) {

  fs.readFile(file, 'utf8', (err, data) => {
      if (err) throw err;

      var ips = data.split("\n")
      ips.forEach((ip, i, arr) => {
        let gdat = geoip.lookup(ip);

        if (gdat == null) return;
        if (processed.indexOf(ip) != -1) return;

        log.log(ip + ' -- ' + gdat.country);
        map.addMarker({"lon": gdat.ll[1], "lat": gdat.ll[0], color: "red", char: "X"});
        processed.push(ip);
      });
  });
  screen.render()
}

setInterval(() => markVisitors('iplist'), 1000)

screen.key(['escape', 'q', 'C-c'], (ch, key) => { return process.exit(0); })

screen.render()
