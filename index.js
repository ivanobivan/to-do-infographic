const express = require("express");
const path = require("path");

const server = express();

server.use("/static", express.static("./public"))

server.get("/", function(req, res){
    res.sendFile(path.resolve(__dirname, "index.html"));
});

server.listen(3000, function() {
    console.log("started 3000 port")
});