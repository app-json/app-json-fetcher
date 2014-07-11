"use strict"

var path = require("path")
var pkg = require(path.join(__dirname, "./package.json"))
var util = require("util")
var superagent = require("superagent")
var github = require("github-url-to-object")
var bitbucket = require("bitbucket-url-to-object")
var logfmt  = require("logfmt")
var cors = require("cors")
var express = require("express")
var app = module.exports = express()

app.set('port', (process.env.PORT || 5000))
app.use(logfmt.bodyParserStream())
app.use(cors())

app.get('/', function (req, res) {

  // Redirect to this app's README in the absence of the required
  // repository query param
  if (!req.query.repository)
    return res.redirect(pkg.repository.url)

  var repository = req.query.repository
  var manifest_url
  var repo

  if (github(repository)) {
    repo = github(repository)
    manifest_url = util.format(
      "https://api.github.com/repos/%s/%s/contents/app.json?ref=%s",
      repo.user,
      repo.repo,
      repo.branch
    )

  } else if (bitbucket(repository)) {
    repo = bitbucket(repository)
    manifest_url = util.format(
      "https://bitbucket.org/%s/%s/raw/%s/app.json",
      repo.user,
      repo.repo,
      repo.branch
    )

  } else {
    return res.send(500, {error: "Github or Bitbucket URL required"})
  }

  if (process.env.NODE_ENV !== "test")
    logfmt.log({
      repository: repository,
      manifest_url: manifest_url
    })

  superagent.get(manifest_url, function(err, res2) {
    var manifest

    if (err)
      return res.send(500, {error: err})

    if (res2.status == 404)
      return res.send(res2.status, {error: "Not found: " + manifest_url})

    if (res2.status !== 200)
      return res.send(res2.status, res2.body)

    if (res2.body.content) {
      // Github
      manifest = new Buffer(res2.body.content, 'base64').toString()
    } else {
      // Bitbucket
      manifest = res2.text
    }

    res.json(JSON.parse(manifest))
  })

})


if (!process.parent)
  app.listen(app.get('port'))
