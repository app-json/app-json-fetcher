"use strict"

process.env.NODE_ENV = "test"

// var assert = require("assert")
var supertest = require("supertest")
var app = require("..")


describe('GET /', function(){
  it('fetches app.json content from GitHub', function(done){
    supertest(app)
      .get('/')
      .query({repository: "github:zeke/slideshow"})
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res){
        if (err) throw err
        done()
      })
  })

  it('fetches app.json content from Bitbucket', function(done){
    supertest(app)
      .get('/')
      .query({repository: "bitbucket:sikelianos/web-starter-kit"})
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res){
        if (err) throw err
        done()
      })
  })

  it('accepts deep URLs', function(done){
    supertest(app)
      .get('/')
      .query({repository: "https://github.com/zeke/slideshow/blob/master/app.json"})
      .expect('Content-Type', /json/)
      .expect(200, done)
  })

  it('returns a 404 if bitbucket file is not found', function(done){
    supertest(app)
      .get('/')
      .query({repository: "bitbucket:sikelianos/nonexistent"})
      .expect('Content-Type', /json/)
      .expect(404, done)
  })

  it('returns a 404 if gitub file is not found', function(done){
    supertest(app)
      .get('/')
      .query({repository: "github:zeke/nonexistent"})
      .expect('Content-Type', /json/)
      .expect(404, done)
  })

  it('redirects if `repository` query param is absent', function(done){
    supertest(app)
      .get('/')
      .query({})
      .expect(302, done)
  })

})
