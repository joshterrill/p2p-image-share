// this file is meant to be browserified, see README for instructions
var P2P = require("socket.io-p2p");
var io = require("socket.io-client");
var ss = require("socket.io-stream");
var socket = io();
var opts = {autoUpgrade: true, peerOpts: {numClients: 10}};
var p2p = new P2P(socket, opts);
var $ = require("jquery");

p2p.on("peer-num", function(num) {
  console.log("You are peer number " + num);
  $(".peerNum").html("You are connected to " + num + " peers.");
});

p2p.on("file", function(stream) {
  //console.log(stream);
  
  var img = document.createElement("img");
  img.src = (window.URL || window.webkitURL).createObjectURL(new Blob(stream));
  document.getElementById("receivedImages").appendChild(img);
});

$(function() {
  $("#file").change(function(e) {
    ss.forceBase64 = true;
    var file = e.target.files[0];
    var stream = ss.createStream();

    ss(socket).emit("file", stream, {size: file.size,name:file.name});
    var blobStream = ss.createBlobReadStream(file);
    var size = 0;
    blobStream.on("data", function(chunk) {
      size += chunk.length;
      console.log(Math.floor(size / file.size * 100) + "%");
    });
    blobStream.pipe(stream);
  });
});