'use strict';
var Timesheet = require('../models/timesheet');
// var Session = require('../models/session');
var helper = require('../app_util/helpers');

// public
var service = {};

service['getMonthlyData'] = function(reqData, callback) {
  try {
    Timesheet.find({userId: reqData.userId, date: { $gte: reqData.startDate, $lte: reqData.endDate }}, function(err, feedRes) {
      if (err) return callback(err);
      if (feedRes) {
        return callback(null, feedRes);
      } else {
        return callback(null, null);
      }
    });
  } catch (err) {
    return callback(err);
  }
};

service['getWeeklyData'] = function(reqData, callback) {
  try {
    Timesheet.find({userId: reqData.userId, date: { $gte: reqData.startDate, $lte: reqData.endDate }}, function(err, feedRes) {
      if (err) return callback(err);
      if (feedRes) {
        return callback(null, feedRes);
      } else {
        return callback(null, null);
      }
    });
  } catch (err) {
    return callback(err);
  }
};


module.exports = service;