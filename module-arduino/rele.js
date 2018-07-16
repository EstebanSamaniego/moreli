var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {

  var relay = new five.Relay(10);

  setInterval(function() {
    relay.close();
  }, 1000);
});