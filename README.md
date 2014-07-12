# app-json-fetcher [![Build Status](https://travis-ci.org/app-json/app-json-fetcher.png?branch=master)](https://travis-ci.org/app-json/app-json-fetcher)

A CORS-friendly webservice (and node module) for fetching app.json file content from GitHub and Bitbucket repos

## Installation

Download node at [nodejs.org](http://nodejs.org) and install it, if you haven't already.

```sh
npm install app-json-fetcher --save
```

## Run it as a service

```sh
git clone https://github.com/app-json/app-json-fetcher
npm install
npm start
```

## Use it programatically

```sh
npm install app-json-fetcher --save
```

```js
require("app-json-fetcher")(repository, function(err, manifest) {
  console.log(err, manifest)
})
```

## Sample endpoints

- https://app-json-fetcher.herokuapp.com/?repository=github:zeke/slideshow
- https://app-json-fetcher.herokuapp.com/?repository=bitbucket:sikelianos/web-starter-kit
- https://app-json-fetcher.herokuapp.com/?repository=https://github.com/zeke/slideshow/tree/master/app.json

## Tests

```sh
npm install
npm test
```

## License

MIT
