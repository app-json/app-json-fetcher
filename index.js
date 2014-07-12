"use strict"

var path = require("path")
var pkg = require(path.join(__dirname, "./package.json"))
var cors = require("cors")
var express = require("express")
var app = module.exports = express()
app.fetch = require("./lib/fetch")

app.set('port', (process.env.PORT || 5000))
app.use(cors())

app.get('/', function (req, res) {

  var repository = req.query.repository

  // Redirect to README if query param is missing
  if (!repository) return res.redirect(pkg.repository.url)

  app.fetch(repository, function(err, manifest) {
    if (err) {
      var status = err.match(/^(\d+).*/)[1]
      if (!status) status = 500
      return res.send(status, {error: err})
    }
    return res.json(manifest)
  })

})

if (!process.parent)
  app.listen(app.get('port'))
