'use strict';
var sendGrid = require('@sendgrid/mail');
var path = require('path');
var handlebars = require('handlebars');
var fs = require('fs');
var log = require('../app_util/logger');
var config = require('../app_util/config');
var helper = require('../app_util/helpers');

// private
function readHTMLFile(path, callback) {
  fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, html);
    }
  });
};

function sendMailTransporter(mailOptions, callback) {
  sendGrid.setApiKey(config.SENDGRID_KEY);

  sendGrid.send(mailOptions, function(error, mailRes){
    if (error) {
      console.log(error);
      log.error(error);
      return callback(error);
    } else {
      log.info('Email sent: ', mailRes[0].statusCode);
      return callback(null, mailRes);
    }
  });
}

handlebars.registerHelper('inc', function(value, options) {
  return parseInt(value) + 1;
});


// public
var service = {};

service['sendHourSheet'] = function(reqData, callback) {
  var filePath = path.join(__dirname, '..', 'template/') + reqData.fileName;

  readHTMLFile(filePath, function(err, html) {
    if (err) return callback(err);
    var template = handlebars.compile(html);

    var htmlToSend = template({
      empData: reqData.hourSheetData,
      startDate: reqData.startDate,
      endDate: reqData.endDate
    });

    var emailIds = config.EMAIL_IDS.split(',');
    var mailOptions = {
      from: 'Newput Hoursheet <timesheet@newput.com>',
      to: emailIds,
      subject: 'Employee Working Hours Sheet Date : ' + helper.getTodayDate(),
      html: htmlToSend
    };

    sendMailTransporter(mailOptions, callback);
  });
}

service['sendTimeSheet'] = function(reqData, callback) {
  var filePath = path.join(__dirname, '..', 'template/') + reqData.fileName;

  readHTMLFile(filePath, function(err, html) {
    if (err) return callback(err);
    var template = handlebars.compile(html);

    var htmlToSend = template({
      sheetData: reqData.timeSheetData,
      empName: reqData.empName,
      empEmail: reqData.empEmail,
      month: reqData.month,
      year: reqData.year,
      totalHours: reqData.totalHours
    });

    var emailIds = config.EMAIL_IDS.split(',');
    var mailOptions = {
      from: 'Newput Timesheet <timesheet@newput.com>',
      to: emailIds,
      subject: 'Employee Timesheet Date : ' + helper.getTodayDate(),
      html: htmlToSend
    };

    sendMailTransporter(mailOptions, callback);
  });
}

module.exports = service;
