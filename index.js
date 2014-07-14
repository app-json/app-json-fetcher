"use strict";

var path = require("path")
var http = require("http")
var url = require("url")
var pkg = require(path.join(__dirname, "./package.json"))
var cors = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS"
}
var route = require("router")()
var app = module.exports = http.createServer(route)

app.fetch = require("./lib/fetch")

route.get('/', function(req, res) {
  var query = url.parse(req.url, true).query
  var repository = query.repository

  // Redirect to README if query param is missing
  if (!repository) {
    res.writeHead(302, {"Location": pkg.repository.url})
    return res.end()
  }

  app.fetch(repository, function (err, manifest) {
    if (err) {
      var status = err.match(/^(\d+).*/)[1]
      if (!status) status = 500
      res.writeHead(status, cors)
      res.write(JSON.stringify({error: err}))
      return res.end()
    }

    res.writeHead(200, cors)
    res.write(JSON.stringify(manifest))
    return res.end()
  })
})

app.listen(process.env.PORT || 5000)
