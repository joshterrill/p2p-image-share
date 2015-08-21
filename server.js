var app = require("express")();
var express = require("express");
var server = require("http").Server(app);
var p2pserver = require("socket.io-p2p-server").Server;
var io = require("socket.io")(server);
var ss = require("socket.io-stream");
var path = require("path");
 
app.use(express.static(__dirname));
io.use(p2pserver);

var peerNum = 0;

io.on("connection", function(socket) {
  
  console.log("Peer " + peerNum + " connected");
  io.emit("peer-num", peerNum);
  peerNum++;
  
  ss(socket).on("file", function(stream, data) {

    var filename = path.basename(data.name);

    var parts = [];

    stream.on("data", function(data) {
      parts.push(data);
    });

    stream.on("end", function() {
      socket.broadcast.emit("file", parts);
    });

  });
});

server.listen(3000, function () {
  console.log("Listening on 3000")
});