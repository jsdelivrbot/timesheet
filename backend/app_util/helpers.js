'use strict';
var bcrypt = require('bcrypt');

// public
var utility = {};

utility['daysInMonth'] = function(year, month) {
  return new Date(year, month, 0).getDate();
};

utility['getDate'] = function(userDay) {
  var todayDate = new Date();
  var todayDay = todayDate.getDay();
  if (userDay > todayDay) {
    todayDate.setDate(todayDate.getDate() + (userDay - todayDay));
  } else if (userDay < todayDay) {
    todayDate.setDate(todayDate.getDate() - (todayDay - userDay));
  }
  var date = todayDate.getDate();
  if (date < 10) {
    date = '0' + date;
  }
  var month = 1 + todayDate.getMonth();
  if (month < 10) {
    month = '0' + month;
  }
  var year = todayDate.getFullYear();
  var newDate = date + '-' + month + '-' + year;
  return newDate;
};

utility['getDateByNumber'] = function(number) {
  var todayDate = new Date();
  var date = number;
  if (date < 10) {
    date = '0' + date;
  }
  var month = 1 + todayDate.getMonth();
  if (month < 10) {
    month = '0' + month;
  }
  var year = todayDate.getFullYear();
  var newDate = date + '-' + month + '-' + year;
  return newDate;
};

utility['prepareMonthlyStartEndDate'] = function(reqData) {
  var date = new Date();
  var year = date.getFullYear();
  if (reqData.year) {
    year = reqData.year;
  }
  var month = date.getMonth() + 1;
  if (reqData.month) {
    month = reqData.month;
  }
  if (month < 10) {
    month = '0' + month;
  }
  var startDate = '01' + '-' + month + '-' + year;
  var endDate = utility.daysInMonth(year, month) + '-' + month + '-' + year;
  reqData['startDate'] = startDate;
  reqData['endDate'] = endDate;
  return reqData;
};

utility['getMonthStartDate'] = function() {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  if (month < 10) {
    month = '0' + month;
  }
  var startDate = '01' + '-' + month + '-' + year;
  return startDate;
};

utility['getTodayDate'] = function() {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  if (month < 10) {
    month = '0' + month;
  }
  var day = date.getDate();
  if (day < 10) {
    day = '0' + day;
  }
  var todayDate = day + '-' + month + '-' + year;
  return todayDate;
};

utility['prepareFormattedStartEndDate'] = function(reqData) {
  var reverseStartDate = reqData.startDate.split('-').reverse().join('-');
  var reverseEndDate = reqData.endDate.split('-').reverse().join('-');
  reqData['formattedStartDate'] = new Date(reverseStartDate);
  reqData['formattedEndDate'] = new Date(reverseEndDate);
  return reqData;
};

utility['convertMinToHour'] = function(totalMin) {
  var totalHours = '00:00';
  if (totalMin > 0) {
    var hours = (totalMin / 60);
    var hr = Math.floor(hours);
    var minutes = (hours - hr) * 60;
    var min = Math.round(minutes);
    if (hr < 10) {
      totalHours = '0' + hr + ':';
    } else {
      totalHours = hr + ':';
    }
    if (min < 10) {
      totalHours += '0' + min;
    } else {
      totalHours += min;
    }
  }
  return totalHours;
};

utility['getCurrentYear'] = function() {
  var date = new Date();
  return date.getFullYear();
};

utility['getCurrentMonthName'] = function() {
  var monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  var date = new Date();
  return monthNames[date.getMonth()];
};

utility['prepareTimesheetData'] = function(reqData) {
  var responseData = [];
  // create blank space array
  for(var i=1; i<32; i++) {
    var defaultObject = {
      officeIn: '',
      officeOut: '',
      homeIn: '',
      homeOut: '',
      dateString: utility.getDateByNumber(i),
      dayTotal: '',
      status: ''
    }
    responseData.push(defaultObject);
  }
  // now fill the blank space
  for(var i=0; i<reqData.length; i++) {
    var data = reqData[i];
    var dateValue = parseInt(data.dateString.substring(0, 2));
    responseData[dateValue - 1] = data;
  }

  return responseData;
};

utility['getEncryptedPassword'] = function(plainPassword) {
  var encryptedPassword = bcrypt.hashSync(plainPassword, 12);
  return encryptedPassword;
};

utility['calculateTotalHours'] = function(resArray) {
  var totalMin = 0;
  var totalHours = '00:00';
  resArray.forEach(function(sheet) {
    var a = sheet.dayTotal.split(':');
    totalMin = totalMin + (a[0]*60 + a[1]*1);
  });
  totalHours = utility.convertMinToHour(totalMin);
  return totalHours;
};

module.exports = utility;
