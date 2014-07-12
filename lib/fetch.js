var util = require("util")
var superagent = require("superagent")
var github = require("github-url-to-object")
var bitbucket = require("bitbucket-url-to-object")

module.exports = function(repository, cb) {
  var manifest_url
  var repo

  if (!repository) return cb("repository argument is required")

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
    return cb("Github or Bitbucket URL required")
  }

  superagent.get(manifest_url, function(err, res) {
    var manifest

    if (err)
      return cb(err)

    if (res.status !== 200)
      return cb(res.status + " " + res.text)

    if (res.body.content) {
      // Github
      manifest = new Buffer(res.body.content, 'base64').toString()
    } else {
      // Bitbucket
      manifest = res.text
    }

    return cb(null, JSON.parse(manifest))
  })

}
