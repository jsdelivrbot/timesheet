'use strict';
var response = require('../services/api_response');
var timesheetService = require('../services/timesheet_service');
var appException = require('../app_util/exceptions');
var helper = require('../app_util/helpers');


// public
var api = {};

api['getMonthlyTimeSheet'] = function(req, res) {
  try {
    // var reqData = req.body;
    var reqData = helper.prepareMonthlyStartEndDate(req.query);
    reqData['userId'] = req.session.user_id;
    var updatedHash = helper.prepareFormattedStartEndDate(reqData);
    timesheetService.getTimesheetByDate(updatedHash, function(err, empRes) {
      if (err) {
        response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
      } else {
        response.successResponse(req, res, empRes);
      }
    });
  } catch (err) {
    response.errorResponse(req, res, appException.INTERNAL_SERVER_ERROR(), err.stack);
  }
};

module.exports = api;
