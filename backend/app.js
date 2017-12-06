'use strict';
var express = require('express');
var router = express.Router();
var path = require('path');
var session = require('express-session');
var config = require('./app_util/config');
var log = require('./app_util/logger');
var logger = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

// create express app
var app = express();

// middleware
app.use(session({
  secret: config.SECRET_KEY,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: true }
}));
log.format = ':remote-addr :remote-user ":method :url :status :response-time ms :res[content-length] HTTP/:http-version" ":user-agent"';
app.use(logger(log.format, { 'stream': log.stream}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, device_id, device_token');

  // intercept OPTIONS method
  if ('OPTIONS' === req.method) {
    next();
  } else if (req.originalUrl.slice(0, 6) === '/rest/') {
    global.start = new Date().getTime();
    global.timeout = setTimeout(function() {
      global.timeout = null;
      var reqPath = JSON.stringify(req.method + ' ' + req.originalUrl + ' ');
      var reqHeader = JSON.stringify(req.headers);
      var reqInfo = reqPath + reqHeader;
      // response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR());
      var error = new Error('[' + new Date()	 + '] Request did not respond within 20 seconds: ' + reqInfo);
      log.error(error);
      process.exit(0);
      // next();
    }, 20000);
    next();
  } else {
    next();
  }
});

// api routes
require('./routes/routes')(app, router);

// finally ready to listen
app.listen(config.PORT, function() {
  log.info('Listening on port ' + config.PORT);
});

module.exports = app;
