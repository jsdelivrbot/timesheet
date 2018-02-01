'use strict';
var crontab = require('node-cron');
var request = require('request');
var log = require('./logger');
var config = require('./config');
var mailcountService = require('../services/mailcount_service');

function startCronJobs() {

  // 08:05 PM
  var weekHoursheet = crontab.schedule("35 14 * * 0", function() {
    request(config.ROOT_PATH + 'email/hoursheet', function (error, response, body) {
      log.info('Cron weekly hoursheet running.');
     });
  });

  // 08:00 PM
  var weekTimesheet = crontab.schedule("30 14 * * 0", function() {
    request(config.ROOT_PATH + 'email/timesheet', function (error, response, body) {
      log.info('Cron weekly timesheet running.');
     });
  });

  // 11:55 PM
  var monthHoursheet31Day = crontab.schedule("25 18 31 1,3,5,7,8,10,12 *", function() {
    request(config.ROOT_PATH + 'email/hoursheet', function (error, response, body) {
      log.info('Cron monthly 31Day hoursheet running.');
     });
  });

  // 11:59 PM
  var monthTimesheet31Day = crontab.schedule("29 18 31 1,3,5,7,8,10,12 *", function() {
    request(config.ROOT_PATH + 'email/timesheet', function (error, response, body) {
      log.info('Cron monthly 31Day timesheet running.');
     });
  });

  // 11:55 PM
  var monthHoursheet30Day = crontab.schedule("25 18 30 4,6,9,11 *", function() {
    request(config.ROOT_PATH + 'email/hoursheet', function (error, response, body) {
      log.info('Cron monthly 30Day hoursheet running.');
     });
  });

  // 11:59 PM
  var monthTimesheet30Day = crontab.schedule("29 18 30 4,6,9,11 *", function() {
    request(config.ROOT_PATH + 'email/timesheet', function (error, response, body) {
      log.info('Cron monthly 30Day timesheet running.');
     });
  });

  // 11:55 PM
  var monthHoursheet28Day = crontab.schedule("25 18 28 2 *", function() {
    request(config.ROOT_PATH + 'email/hoursheet', function (error, response, body) {
      log.info('Cron monthly 28Day hoursheet running.');
     });
  });

  // 11:59 PM
  var monthTimesheet28Day = crontab.schedule("59 18 28 2 *", function() {
    request(config.ROOT_PATH + 'email/timesheet', function (error, response, body) {
      log.info('Cron monthly 28Day timesheet running.');
     });
  });

  var healthJob = crontab.schedule("*/5 * * * *", function() {
    log.info('Cron slack bot server health check running.');
    request(config.BOT_ROOT_PATH + 'ping', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // console.log('body');
        console.log(body);
      } else {
        log.info('Send mail to admin Timesheet slack bot server down.');
        mailcountService.getTodayMailCount();
      }
     });
  });
};

module.exports = startCronJobs();
