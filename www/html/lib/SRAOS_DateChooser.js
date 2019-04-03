/*
DateChooser 1.8
http://yellow5.us/projects/datechooser/
October 2, 2006

Copyright (c) 2006 John Hansen

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial
portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.
*/

var objPrototypes =
{
	aSuffix: ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'st'],
	sTimezoneOffset: '',

	GetTimezoneOffset: function()
	{
		var objLocal = new Date();
		objLocal.setHours(0);
		objLocal.setMinutes(0);
		objLocal.setSeconds(0);
		objLocal.setMilliseconds(0);

		var objUTC = new Date();
		objUTC.setFullYear(objLocal.getUTCFullYear());
		objUTC.setMonth(objLocal.getUTCMonth());
		objUTC.setDate(objLocal.getUTCDate());
		objUTC.setHours(objLocal.getUTCHours());
		objUTC.setMinutes(objLocal.getUTCMinutes());
		objUTC.setSeconds(objLocal.getUTCSeconds());
		objUTC.setMilliseconds(objLocal.getUTCMilliseconds());

		this.sTimezoneOffset = ((objLocal.getTime() - objUTC.getTime()) / (1000 * 3600));
		var bNegative = (this.sTimezoneOffset < 0);
		objLocal = null;
		objUTC = null;

		this.sTimezoneOffset  = bNegative ? (this.sTimezoneOffset + '').substring(1) : this.sTimezoneOffset + '';
		this.sTimezoneOffset  = this.sTimezoneOffset.replace(/\.5/, (parseInt('$1', 10) * 60) + '');
		this.sTimezoneOffset += (this.sTimezoneOffset.substring(this.sTimezoneOffset.length - 3) != ':30') ? ':00' : '';
		this.sTimezoneOffset  = (this.sTimezoneOffset.substr(0, this.sTimezoneOffset.indexOf(':')).length == 1) ? '0' + this.sTimezoneOffset : this.sTimezoneOffset;
		this.sTimezoneOffset  = bNegative ? '-' + this.sTimezoneOffset : '+' + this.sTimezoneOffset;

		return true;
	},

	Array_push: function()
	{
		for (var nCount = 0; nCount < arguments.length; nCount++)
		{
			this[this.length] = arguments[nCount];
		}

		return this.length;
	},

	Date_PHPDate: function()
	{
		var sFormat = (arguments.length > 0) ? arguments[0] : '';

		var nYear = this.getFullYear();
		var sYear = nYear + '';

		var nMonth = this.getMonth();
		var sMonth = (nMonth + 1) + '';
		var sPaddedMonth = (sMonth.length == 1) ? '0' + sMonth : sMonth;

		var nDate = this.getDate();
		var sDate = nDate + '';
		var sPaddedDate = (sDate.length == 1) ? '0' + sDate : sDate;

		var nDay = this.getDay();
		var sDay = nDay + '';
    
    var nHours = this.getHours();
    var sHours = nHours + '';
    var sPaddedHours = (sHours.length == 1) ? '0' + sHours : sHours;
    
    var nHours12 = nHours == 0 ? 12 : (nHours > 12 ? nHours - 12 : nHours);
    var sHours12 = nHours12 + '';
    var sPaddedHours12 = (sHours12.length == 1) ? '0' + sHours12 : sHours12;
    
    var nMinutes = this.getMinutes();
    var sMinutes = nMinutes + '';
    var sPaddedMinutes = (sMinutes.length == 1) ? '0' + sMinutes : sMinutes;
    
    var nSeconds = this.getSeconds();
    var sSeconds = nSeconds + '';
    var sPaddedSeconds = (sSeconds.length == 1) ? '0' + sSeconds : sSeconds;

		sFormat = sFormat.replace(/([cDdFjlMmNnrSUwYyaAgGhHis])/g, 'y5-cal-regexp:$1');
		sFormat = sFormat.replace(/y5-cal-regexp:c/, sYear + '-' + sPaddedMonth + '-' + sPaddedDate + 'T00:00:00' + objPrototypes.sTimezoneOffset);
		sFormat = sFormat.replace(/y5-cal-regexp:D/, OS.getString('form.date.day.' + nDay));
		sFormat = sFormat.replace(/y5-cal-regexp:d/, sPaddedDate);
		sFormat = sFormat.replace(/y5-cal-regexp:F/, OS.getString('form.date.monthFull.' + (nMonth + 1)));
		sFormat = sFormat.replace(/y5-cal-regexp:j/, nDate);
		sFormat = sFormat.replace(/y5-cal-regexp:l/, OS.getString('form.date.dayFull.' + nDay));
		sFormat = sFormat.replace(/y5-cal-regexp:M/, OS.getString('form.date.month.' + (nMonth + 1)));
		sFormat = sFormat.replace(/y5-cal-regexp:m/, sPaddedMonth);
		sFormat = sFormat.replace(/y5-cal-regexp:N/, (nDay == 0) ? 7 : nDay);
		sFormat = sFormat.replace(/y5-cal-regexp:n/, sMonth);
		sFormat = sFormat.replace(/y5-cal-regexp:r/, OS.getString('form.date.day.' + nDay) + ', ' + sPaddedDate + ' ' + OS.getString('form.date.month.' + (nMonth + 1)) + ' ' + sYear + ' 00:00:00 ' + objPrototypes.sTimezoneOffset.replace(/:/, ''));
		sFormat = sFormat.replace(/y5-cal-regexp:S/, objPrototypes.aSuffix[nDate]);
		sFormat = sFormat.replace(/y5-cal-regexp:U/, parseInt((this.getTime() / 1000), 10));
		sFormat = sFormat.replace(/y5-cal-regexp:w/, nDay);
		sFormat = sFormat.replace(/y5-cal-regexp:Y/, sYear);
		sFormat = sFormat.replace(/y5-cal-regexp:y/, sYear.substring(2));
    
    // time
    sFormat = sFormat.replace(/y5-cal-regexp:a/, this.getHours() < 12 ? OS.getString('form.date.am') : OS.getString('form.date.pm'));
    sFormat = sFormat.replace(/y5-cal-regexp:A/, this.getHours() < 12 ? OS.getString('form.date.am').toUpperCase() : OS.getString('form.date.pm').toUpperCase());
    sFormat = sFormat.replace(/y5-cal-regexp:g/, sHours12);
    sFormat = sFormat.replace(/y5-cal-regexp:G/, sHours);
    sFormat = sFormat.replace(/y5-cal-regexp:h/, sPaddedHours12);
    sFormat = sFormat.replace(/y5-cal-regexp:H/, sPaddedHours);
    sFormat = sFormat.replace(/y5-cal-regexp:i/, sPaddedMinutes);
    sFormat = sFormat.replace(/y5-cal-regexp:s/, sPaddedSeconds);

		return sFormat;
	},
  
  /**
   * compares this date with another date. returns -1 if this date is prior to 
   * date, 0 if they are equal, and 1 if this date is after date. returns false 
   * if 'date' is not a Date object
   * @param Date date the date to compare
   * @params boolean skipTime whether or not to skip the time comparison
   * @access public
   * @return int
   */
  Date_compare: function(date, skipTime) {
    if (Date.isValid(date)) {
      var ymd = this.getPHPDate('Ymd') * 1;
      var ymd1 = date.getPHPDate('Ymd') * 1;
      var hms = this.getPHPDate('His') * 1;
      var hms1 = date.getPHPDate('His') * 1;
      return ymd < ymd1 ? -1 : (ymd > ymd1 ? 1 : (!skipTime ? (hms < hms1 ? -1 : (hms > hms1 ? 1 : 0)) : 0));
    }
    else {
      return false;
    }
  },
  
  Date_decrementDay: function(num) {
    this.setTime(this.getTime() - (86400000 * (num ? num : 1)));
  },
  
  Date_decrementMonth: function(num) {
    if (num) { 
      for(var i=0; i<num; i++) { this.decrementMonth(); }
    }
    else {
      var newMonth = this.getMonth() - 1;
      if (newMonth < 0) { this.setFullYear(this.getFullYear() - 1); }
      newMonth = newMonth < 0 ? 11 : newMonth;
      this.setMonth(newMonth);
    }
  },
  
  /**
   * returns true if this date is the same as date
   * @param Date date the date to compare
   * @params boolean skipTime whether or not to skip the time comparison
   * @access public
   * @return boolean
   */
  Date_equals: function(date, skipTime) {
    return this.compare(date, skipTime) === 0;
  },
  
  /**
   * attempts to parse the month string str and return the corresponding month 
   * number (1-12) for that month. str can be either a full month name, or an 
   * abbreviation (with or without trainling period). the search is also not 
   * case-sensitive. returns NULL if not successful
   * @param string str the month string to parse. example: September, sept, jun
   * sept.
   * @access public static
   * @return int
   */
  Date_getMonthFromStr: function(str) {
    if (str) {
      if (SRAOS_Util.endsWith(str, '.')) { str = str.substr(0, str.length-1); }
      
      for(var i=1; i<=12; i++) {
        if (SRAOS_Util.beginsWith(OS.getString('date.month.' + i), str, false)) {
          return i;
        }
      }
    }
    return null;
  },
  
  Date_incrementDay: function(num) {
    this.setTime(this.getTime() + (86400000 * (num ? num : 1)));
  },
  
  Date_incrementMonth: function(num) {
    if (num) { 
      for(var i=0; i<num; i++) { this.incrementMonth(); }
    }
    else {
      var newMonth = this.getMonth() + 1;
      if (newMonth > 11) { this.setFullYear(this.getFullYear() + 1); }
      newMonth = newMonth > 11 ? 0 : newMonth;
      this.setMonth(newMonth);
    }
  },
  
  /**
   * returns true if obj is a Date object
   * @param mixed obj the object to evaluate
   * @access public static
   * @return boolean
   */
  Date_isValid: function(obj) {
    return obj && obj.getYear ? true : false;
  },
  
  Date_jumpToEndOfDay: function() {
    this.setHours(23);
    this.setMinutes(59);
    this.setSeconds(59);
    this.setMilliseconds(999);
  },
  
  Date_jumpToEndOfMonth: function() {
    var month = this.getMonth();
    while(month == this.getMonth()) {
      this.incrementDay();
    }
    this.decrementDay();
    this.jumpToEndOfDay();
  },
  
  Date_jumpToEndOfWeek: function() {
    while(this.getDay() != 6) {
      this.incrementDay();
    }
    this.jumpToEndOfDay();
  },
  
  Date_jumpToStartOfDay: function() {
    this.setHours(0);
    this.setMinutes(0);
    this.setSeconds(0);
    this.setMilliseconds(0);
  },
  
  Date_jumpToStartOfMonth: function() {
    this.setDate(1);
    this.jumpToStartOfDay();
  },
  
  Date_jumpToStartOfWeek: function() {
    while(this.getDay() != 0) {
      this.decrementDay();
    }
    this.jumpToStartOfDay();
  },
  
  Date_jumpMonths: function(months) {
    for(var i=0; i<Math.abs(months); i++) {
      this[months < 0 ? 'decrementMonth' : 'incrementMonth']();
    }
  }, 
  
  Date_strToDate: function(str) {
    if (!SRAOS_Util.isString(str)) { return null; }
    
    // converts a date that is adheres to one of the formats described at 
    // http://www.gnu.org/software/tar/manual/html_node/tar_111.html#SEC111 and
    // http://www.gnu.org/software/tar/manual/html_node/tar_112.html#SEC112 into 
    // a new Date object and returns that object
    var year, month, day, hour, minute, second, found;
    var date = new Date();
    year = date.getFullYear();
    month = date.getMonth();
    day = date.getDate();
    
    // TIME
    // ISO 8601 (HH:MM:SS or HH:MM or HH)
    var matches;
    if (matches = str.match(new RegExp("([0-9]{1,2}):([0-9]{1,2})?:?([0-9]{1,2})? ?([a|A|p|P])?.*"))) {
      hour = matches[4] && matches[4].toLowerCase() == 'a' && matches[1] == 12 ? 0 : (matches[4] && matches[4].toLowerCase() == 'p' && matches[1] < 12 ? matches[1] + 12 : matches[1]);
      if (matches[2]) { minute = matches[2]; }
      if (matches[3]) { second = matches[3]; }
      str = str.replace(matches[0], '');
    }
    
    // DATE
    // 24 sep 1972 or 24-sept-72 or 24sep97
    if ((matches = str.match(new RegExp("([0-9]{1,2})-? *([a-zA-Z\.]+)-? *([0-9]{1,4})?.*"))) && (matches[2] = Date.getMonthFromStr(matches[2]))) {
      day = matches[1];
      month = matches[2];
      year = matches[3] ? matches[3] : year;
      found = true;
    }
    // sep 24, 1997 or september 24
    else if ((matches = str.match(new RegExp("([a-zA-Z\.]+)-? *([0-9]{1,2}),?-? *([0-9]{1,4})?.*"))) && (matches[1] = Date.getMonthFromStr(matches[1]))) {
      month = matches[1];
      day = matches[2];
      year = matches[3] ? matches[3] : year;
      found = true;
    }
    // ISO 8601 (YYYY-MM-DD or YY-MM-DD)
    else if (matches = str.match(new RegExp("([0-9]{1,4})?-?([0-9]{1,2})-([0-9]{1,2})*"))) {
      year = matches[1] ? matches[1] : year;
      month = matches[2];
      day = matches[3];
      found = true;
    }
    // Common U.S. format: MM/DD/YY or MM/DD/YYYY
    else if (matches = str.match(new RegExp("([0-9]{1,2})\/([0-9]{1,2})\/?([0-9]{1,4})?.*"))) {
      month = matches[1];
      day = matches[2];
      year = matches[3] ? matches[3] : year;
      found = true;
    }
    // convert values to numbers (will be strings)
    year *= 1;
    month *= 1;
    day *= 1;
    if (hour) { hour *= 1; }
    if (minute) { minute *= 1; }
    if (second) { second *= 1; }
    
    // convert 2-digit year (less than 68 = 2000, otherwise 1900)
    if (year < 100) { year += year < 68 ? 2000 : 1900; }
    
    if (found) {
      var date = new Date();
      date.setYear(year);
      date.setDate(day);
      date.setMonth(month-1);
      if (hour) { date.setHour(hour); }
      if (minute) { date.setMinute(minute); }
      if (second) { date.setSecond(second); }
      return date;
    }
    else {
      return null;
    }
  }
};

objPrototypes.GetTimezoneOffset();
Date.prototype.getPHPDate = objPrototypes.Date_PHPDate;
Date.prototype.compare = objPrototypes.Date_compare;
Date.prototype.decrementDay = objPrototypes.Date_decrementDay;
Date.prototype.decrementMonth = objPrototypes.Date_decrementMonth;
Date.prototype.equals = objPrototypes.Date_equals;
Date.prototype.incrementDay = objPrototypes.Date_incrementDay;
Date.prototype.incrementMonth = objPrototypes.Date_incrementMonth;
Date.prototype.jumpToEndOfDay = objPrototypes.Date_jumpToEndOfDay;
Date.prototype.jumpToEndOfMonth = objPrototypes.Date_jumpToEndOfMonth;
Date.prototype.jumpToEndOfWeek = objPrototypes.Date_jumpToEndOfWeek;
Date.prototype.jumpToStartOfDay = objPrototypes.Date_jumpToStartOfDay;
Date.prototype.jumpToStartOfMonth = objPrototypes.Date_jumpToStartOfMonth;
Date.prototype.jumpToStartOfWeek = objPrototypes.Date_jumpToStartOfWeek;
Date.prototype.jumpMonths = objPrototypes.Date_jumpMonths;

Date.getMonthFromStr = objPrototypes.Date_getMonthFromStr;
Date.isValid = objPrototypes.Date_isValid;
Date.strToDate = objPrototypes.Date_strToDate;

if (typeof(Array.prototype.push) == 'undefined')
{
	Array.prototype.push = objPrototypes.Array_push;
}

function SRAOS_DateChooser()
{
	if (!arguments
	|| !document.getElementById
	|| !document.getElementsByTagName
	|| (!document.createElement && !document.createElementNS))
	{
		return null;
	}

	var createElement = function(sElement)
	{
		if (typeof(document.createElement) != 'undefined')
		{
			return document.createElement(sElement);
		}

		return (typeof(document.createElementNS) != 'undefined') ? document.createElementNS('http://www.w3.org/1999/xhtml', sElement) : false;
	};

	var objUpdateFields = {};
	var objAllowedDays = {'0':true, '1':true, '2':true, '3':true, '4':true, '5':true, '6':true};
	var nXOffset = 0;
	var nYOffset = 0;
	var nTimeout = 0;
	var objTimeout = null;
	var fnUpdate = null;
  var fnUpdateObj = null;
	var objEarliestDate = null;
	var objLatestDate = null;
	var ndBodyElement = (document.getElementsByTagName('body').length > 0) ? document.getElementsByTagName('body')[0] : document;

	var ndFrame = null;
	/*@cc_on@*/
	/*@if(@_jscript_version < 6)
		if (document.getElementById('iframehack'))
		{
			ndFrame = document.getElementById('iframehack');
		}
		else
		{
			ndFrame = createElement('iframe');
			ndFrame.id = 'iframehack';
			ndFrame.setAttribute('src', 'about:blank');
			ndFrame.setAttribute('scrolling', 'no');
			ndFrame.style.display = 'none';
			ndFrame.style.position = 'absolute';
			ndFrame.style.zIndex = '5000';
			ndFrame.style.padding = '0';
			ndFrame.style.border = '0';
			ndBodyElement.appendChild(ndFrame);
		}
	/*@end@*/

	var nDateChooserID = 0;
	while (document.getElementById('calendar' + nDateChooserID)) ++nDateChooserID;
	var sDateChooserID = 'calendar' + nDateChooserID;
  
	var objSelectedDate;
  
	var objStartDate = new Date();
  objStartDate.jumpToStartOfDay();

	var objMonthYear = new Date();
	objMonthYear.jumpToStartOfMonth();

	var ndDateChooser = document.createElement('div');
	ndDateChooser.id = sDateChooserID;
	ndDateChooser.className = 'calendar';
	ndDateChooser.style.visibility = 'hidden';
	ndDateChooser.style.position = 'absolute';
	ndDateChooser.style.zIndex = '5001';
	ndDateChooser.style.top = '0';
	ndDateChooser.style.left = '0';
	ndBodyElement.appendChild(ndDateChooser);

	var AddClickEvents = function()
	{
		var aNavLinks = ndDateChooser.getElementsByTagName('thead')[0].getElementsByTagName('a');
		for (var nNavLink = 0; nNavLink < aNavLinks.length; ++nNavLink)
		{
			aNavLinks[nNavLink].onclick = function(e)
			{
				e = e || window.event;
				var ndClicked = e.target || e.srcElement;
				var navAction = ndClicked.nodeValue;
        var sClass = ndClicked.className;

				if (sClass == 'previousyear' || navAction == String.fromCharCode(171))
				{
					objMonthYear.setFullYear(objMonthYear.getFullYear() - 1);
					if (objEarliestDate && objEarliestDate.getTime() > objMonthYear.getTime())
					{
						objMonthYear.setFullYear(objEarliestDate.getFullYear());
						objMonthYear.setMonth(objEarliestDate.getMonth());
					}
				}
				else if (sClass == 'previousmonth' || navAction == String.fromCharCode(60))
				{
					objMonthYear.setMonth(objMonthYear.getMonth() - 1);
					if (objEarliestDate && objEarliestDate.getTime() > objMonthYear.getTime())
					{
						objMonthYear.setFullYear(objEarliestDate.getFullYear());
						objMonthYear.setMonth(objEarliestDate.getMonth());
					}
				}
				else if (sClass == 'nextmonth' || navAction == String.fromCharCode(62))
				{
					objMonthYear.setMonth(objMonthYear.getMonth() + 1);
					if (objLatestDate && objLatestDate.getTime() < objMonthYear.getTime())
					{
						objMonthYear.setFullYear(objLatestDate.getFullYear());
						objMonthYear.setMonth(objLatestDate.getMonth());
					}
				}
				else if (sClass == 'nextyear' || navAction == String.fromCharCode(187))
				{
					objMonthYear.setFullYear(objMonthYear.getFullYear() + 1);
					if (objLatestDate && objLatestDate.getTime() < objMonthYear.getTime())
					{
						objMonthYear.setFullYear(objLatestDate.getFullYear());
						objMonthYear.setMonth(objLatestDate.getMonth());
					}
				}
				else
				{
					objMonthYear.setFullYear(objStartDate.getFullYear());
					objMonthYear.setMonth(objStartDate.getMonth());
				}

				RefreshDisplay();
				return false;
			}
		}

		var aDateLinks = ndDateChooser.getElementsByTagName('tbody')[0].getElementsByTagName('a');
		for (var nDateLink = 0; nDateLink < aDateLinks.length; ++nDateLink)
		{
			aDateLinks[nDateLink].onclick = function(e)
			{
				e = e || window.event;
				var ndClicked = e.target || e.srcElement;

				for (var nLink = 0; nLink < aDateLinks.length; ++nLink)
				{
					if (aDateLinks[nLink].className == 'selecteddate') aDateLinks[nLink].removeAttribute('class');
				}

				var objTempDate = new Date(objMonthYear);
				objTempDate.setDate(parseInt(ndClicked.innerHTML ? ndClicked.innerHTML : ndClicked.nodeValue, 10));

				var nTime = objTempDate.getTime();
				var sWeekday = objTempDate.getPHPDate('w');
				objTempDate = null;

				if (objEarliestDate && objEarliestDate.getTime() > nTime) return false;
				if (objLatestDate && objLatestDate.getTime() < nTime) return false;
				if (!objAllowedDays[sWeekday]) return false;

				objMonthYear.setTime(nTime);
				objMonthYear.setDate(1);
				if (!objSelectedDate) objSelectedDate = new Date(nTime);
				objSelectedDate.setTime(nTime);
				ndClicked.className = 'selecteddate';

				if (ndFrame) ndFrame.style.display = 'none';
				ndDateChooser.style.visibility = 'hidden';

				if (objTimeout) clearTimeout(objTimeout);

				for (var sFieldName in objUpdateFields)
				{
					var ndField = document.getElementById(sFieldName);
					if (ndField) ndField.value = objSelectedDate.getPHPDate(objUpdateFields[sFieldName]);
				}
        
				if (fnUpdate) fnUpdateObj ? fnUpdateObj[fnUpdate](objSelectedDate) : fnUpdate(objSelectedDate);
				return false;
			};
		}

		return true;
	};

	var RefreshDisplay = function()
	{
		var ndTable, ndTHead, ndTR, ndTH, ndA, ndTBody, ndTD;
		var sClass = '';
    
		var objTempDate = new Date(objMonthYear);

		var objToday = new Date();
		objToday.jumpToStartOfDay();

		ndTable = createElement('table');
		ndTable.setAttribute('summary', 'SRAOS_DateChooser');

		ndTHead = createElement('thead');
		ndTable.appendChild(ndTHead);

		ndTR = createElement('tr');
		ndTHead.appendChild(ndTR);

		ndTH = createElement('th');
		ndTR.appendChild(ndTH);
		ndA = createElement('a');
		ndA.className = 'previousyear';
		ndA.setAttribute('href', '#');
		ndA.setAttribute('title', OS.getString('text.previousYear'));
		ndTH.appendChild(ndA);
		ndA.appendChild(document.createTextNode(String.fromCharCode(171)));

		ndTH = createElement('th');
		ndTR.appendChild(ndTH);
		ndA = createElement('a');
		ndA.className = 'previousmonth';
		ndA.setAttribute('href', '#');
		ndA.setAttribute('title', OS.getString('text.previousMonth'));
		ndTH.appendChild(ndA);
		ndA.appendChild(document.createTextNode(String.fromCharCode(60)));

		ndTH = createElement('th');
		ndTH.setAttribute('colspan', '3');
		/*@cc_on@*/
		/*@if(@_jscript_version < 6)
			ndTH.colSpan = '3';
		/*@end@*/
		ndTR.appendChild(ndTH);
		ndA = createElement('a');
		ndA.className = 'currentdate';
		ndA.setAttribute('href', '#');
		ndA.setAttribute('title', OS.getString('text.currentMonth'));
		ndTH.appendChild(ndA);
		ndA.appendChild(document.createTextNode(objMonthYear.getPHPDate("M Y")));

		ndTH = createElement('th');
		ndTR.appendChild(ndTH);
		ndA = createElement('a');
		ndA.className = 'nextmonth';
		ndA.setAttribute('href', '#');
		ndA.setAttribute('title', OS.getString('text.nextMonth'));
		ndTH.appendChild(ndA);
		ndA.appendChild(document.createTextNode(String.fromCharCode(62)));

		ndTH = createElement('th');
		ndTR.appendChild(ndTH);
		ndA = createElement('a');
		ndA.className = 'nextyear';
		ndA.setAttribute('href', '#');
		ndA.setAttribute('title', OS.getString('text.nextYear'));
		ndTH.appendChild(ndA);
		ndA.appendChild(document.createTextNode(String.fromCharCode(187)));

		ndTR = createElement('tr');
		ndTHead.appendChild(ndTR);

		ndTD = createElement('td');
		ndTR.appendChild(ndTD);
		ndTD.appendChild(document.createTextNode(OS.getString('form.date.dayChar.0')));

		ndTD = createElement('td');
		ndTR.appendChild(ndTD);
		ndTD.appendChild(document.createTextNode(OS.getString('form.date.dayChar.1')));

		ndTD = createElement('td');
		ndTR.appendChild(ndTD);
		ndTD.appendChild(document.createTextNode(OS.getString('form.date.dayChar.2')));

		ndTD = createElement('td');
		ndTR.appendChild(ndTD);
		ndTD.appendChild(document.createTextNode(OS.getString('form.date.dayChar.3')));

		ndTD = createElement('td');
		ndTR.appendChild(ndTD);
		ndTD.appendChild(document.createTextNode(OS.getString('form.date.dayChar.4')));

		ndTD = createElement('td');
		ndTR.appendChild(ndTD);
		ndTD.appendChild(document.createTextNode(OS.getString('form.date.dayChar.5')));

		ndTD = createElement('td');
		ndTR.appendChild(ndTD);
		ndTD.appendChild(document.createTextNode(OS.getString('form.date.dayChar.6')));

		ndTBody = createElement('tbody');
		ndTable.appendChild(ndTBody);

		while (objTempDate.getMonth() == objMonthYear.getMonth())
		{
			ndTR = createElement('tr');
			ndTBody.appendChild(ndTR);

			for (var nWeek = 0; nWeek < 7; ++nWeek)
			{
				if ((objTempDate.getDay() == nWeek) && (objTempDate.getMonth() == objMonthYear.getMonth()))
				{
					sClass  = (objTempDate.equals(objSelectedDate, true)) ? 'selectedday' : '';
					sClass += (objTempDate.equals(objToday, true)) ? ' today' : '';
					sClass  = ((sClass.length > 0) && (sClass[1] == ' ')) ? sClass.substr(1, sClass.length - 1) : sClass;

					ndTD = createElement('td');
					ndTR.appendChild(ndTD);

					ndA = createElement('a');
					if (sClass.length > 0) ndA.className = sClass;
					ndA.setAttribute('href', '#');
					ndTD.appendChild(ndA);
					ndA.appendChild(document.createTextNode(objTempDate.getDate()));

					objTempDate.setDate(objTempDate.getDate() + 1);
				}
				else
				{
					ndTD = createElement('td');
					ndTR.appendChild(ndTD);
				}
			}
		}

		while (ndDateChooser.hasChildNodes()) ndDateChooser.removeChild(ndDateChooser.firstChild);
		ndDateChooser.appendChild(ndTable);

		if (ndFrame)
		{
			ndFrame.style.display = 'block';
			ndFrame.style.top = ndDateChooser.style.top;
			ndFrame.style.left = ndDateChooser.style.left;
			ndFrame.style.width = (ndTable.clientWidth + 2) + 'px';
			ndFrame.style.height = (ndTable.clientHeight + 4) + 'px';
		}

		objTempDate = null;
		objToday = null;

		AddClickEvents();
		return true;
	};

	var DisplayDateChooser = function()
	{
		var sPositionX = (arguments.length > 0) ? arguments[0] : 'auto';
		var sPositionY = (arguments.length > 1) ? arguments[1] : 'auto';

		var ndStyle = ndDateChooser.style;
		ndStyle.top = sPositionY + '';
		ndStyle.left = sPositionX + '';

		ndDateChooser.style.visibility = 'visible';
		if (objTimeout) clearTimeout(objTimeout);
    
    updateSelectedDate();
		RefreshDisplay();
		return true;
	};
  
  var updateSelectedDate = function() {
    if (SRAOS_Util.getLength(objUpdateFields) == 1) {
      var sFieldName, field;
      for (sFieldName in objUpdateFields) { break; }
      if (sFieldName && (field = document.getElementById(sFieldName))) {
        if (objSelectedDate = Date.strToDate(field.value)) {
          objMonthYear = new Date(objSelectedDate);
          objMonthYear.jumpToStartOfMonth();
        }
      }
    }
  };

	this.displayPosition = function()
	{
		var sPositionX = (arguments.length > 0) ? arguments[0] : 'auto';
		var sPositionY = (arguments.length > 1) ? arguments[1] : 'auto';

		return DisplayDateChooser(sPositionX, sPositionY);
	};

	this.display = function(e)
	{
		e = e || window.event;

		var sPositionX = 'auto';
		var sPositionY = 'auto';
		if (e)
		{
			if (e.pageX || e.pageY)
			{
				sPositionX = e.pageX + nXOffset + 'px';
				sPositionY = e.pageY + nYOffset + 'px';
			}
			else if (e.clientX || e.clientY)
			{
				sPositionX = e.clientX + ndBodyElement.scrollLeft + nXOffset + 'px';
				sPositionY = e.clientY + ndBodyElement.scrollTop + nYOffset + 'px';
			}

			if (e.preventDefault) e.preventDefault();
			if (e.stopPropagation) e.stopPropagation();
			e.returnValue = false;
			e.cancelBubble = true;
		}

		DisplayDateChooser(sPositionX, sPositionY);
		return false;
	};

	this.setXOffset = function()
	{
		nXOffset = ((arguments.length > 0) && (typeof(arguments[0]) == 'number')) ? parseInt(arguments[0], 10) : nXOffset;
		return true;
	};

	this.setYOffset = function()
	{
		nYOffset = ((arguments.length > 0) && (typeof(arguments[0]) == 'number')) ? parseInt(arguments[0], 10) : nYOffset;
		return true;
	};

	this.setCloseTime = function()
	{
		nTimeout = ((arguments.length > 0) && (typeof(arguments[0]) == 'number') && (arguments[0] >= 0)) ? arguments[0] : nTimeout;
		return true;
	};
  
  // 1st parameter can be a function reference or a function name. in the case 
  // of the latter, the second parameter must also be specified which is a 
  // reference to an object containing that function
	this.setUpdateFunction = function()
	{
		if (arguments.length > 0 && (typeof(arguments[0]) == 'function' || (typeof(arguments[0]) == 'string' && arguments[1] && typeof(arguments[1]) == 'object' && arguments[1][arguments[0]]))) {
      fnUpdate = arguments[0];
      fnUpdateObj = arguments[1];
    }
		return true;
	};

	this.setUpdateField = function()
	{
		objUpdateFields = {};
		if ((typeof(arguments[0]) == 'string') && (typeof(arguments[1]) == 'string') && document.getElementById(arguments[0]))
		{
			objUpdateFields[arguments[0]] = arguments[1];
		}
		else if ((typeof(arguments[0]) == 'object') && (typeof(arguments[1]) == 'object'))
		{
			for (var nField = 0; nField < arguments[0].length; ++nField)
			{
				if (nField >= arguments[1].length) break;
				objUpdateFields[arguments[0][nField]] = arguments[1][nField];
			}
		}
		else if (typeof(arguments[0]) == 'object')
		{
			objUpdateFields = arguments[0];
		}
    // add onblur conversion
    for (var sFieldName in objUpdateFields)
    {
      var ndField = document.getElementById(sFieldName);
      ndField._format = objUpdateFields[sFieldName];
      if (ndField.onblur) { ndField.onblurdc = ndField.onblur; }
      ndField.onblur = function(evt) {
        var date = Date.strToDate(this.value);
        this.value = date ? date.getPHPDate(this._format) : '';
        if (ndField.onblurdc) { ndField.onblurdc(evt); }
      };
    }
		return true;
	};

	this.setLink = function()
	{
		var sLinkText = ((arguments.length > 0) && (typeof(arguments[0]) == 'string')) ? arguments[0] : 'Choose a date';
		var ndNode = ((arguments.length > 1) && (typeof(arguments[1]) == 'string')) ? document.getElementById(arguments[1]) : null;
		var bPlaceRight = ((arguments.length > 2) && !arguments[2]) ? false : true;
		var sTitleText = ((arguments.length > 3) && (typeof(arguments[3]) == 'string')) ? arguments[3] : 'Click to choose a date';

		if (!ndNode) return false;

		var ndAnchor = document.createElement('a');
		ndAnchor.className = 'calendarlink';
		ndAnchor.href = '#';

		if (sTitleText.length > 0) ndAnchor.setAttribute('title', sTitleText);
		ndAnchor.appendChild(document.createTextNode(sLinkText));

		if (bPlaceRight)
		{
			if (ndNode.nextSibling)
			{
				ndNode.parentNode.insertBefore(ndAnchor, ndNode.nextSibling);
			}
			else
			{
				ndNode.parentNode.appendChild(ndAnchor);
			}
		}
		else
		{
			ndNode.parentNode.insertBefore(ndAnchor, ndNode);
		}

		ndAnchor.onclick = this.display;
		return true;
	};

	this.setIcon = function()
	{
		var sIconFile = ((arguments.length > 0) && (typeof(arguments[0]) == 'string')) ? arguments[0] : false;
		var ndNode = ((arguments.length > 1) && (typeof(arguments[1]) == 'string')) ? document.getElementById(arguments[1]) : null;
		var bPlaceRight = ((arguments.length > 2) && !arguments[2]) ? false : true;
		var sTitleText = ((arguments.length > 3) && (typeof(arguments[3]) == 'string')) ? arguments[3] : 'Click to choose a date';

		if (!ndNode || !sIconFile) return false;

		var ndIcon = document.createElement('img');
		ndIcon.className = 'calendaricon';
		ndIcon.src = sIconFile;
		ndIcon.setAttribute('alt', 'SRAOS_DateChooser Icon ' + (nDateChooserID + 1));
		if (sTitleText.length > 0) ndIcon.setAttribute('title', sTitleText);

		if (bPlaceRight)
		{
			if (ndNode.nextSibling)
			{
				ndNode.parentNode.insertBefore(ndIcon, ndNode.nextSibling);
			}
			else
			{
				ndNode.parentNode.appendChild(ndIcon);
			}
		}
		else
		{
			ndNode.parentNode.insertBefore(ndIcon, ndNode);
		}

		ndIcon.onclick = this.display;
		return true;
	};

	this.setStartDate = function()
	{
    // convert string date
    if (arguments.length && typeof(arguments[0]) == 'string') { arguments[0] = Date.strToDate(arguments[0]); }
		if (!arguments.length || !(typeof(arguments[0]) == 'object') || !arguments[0].getTime) return false;

		objStartDate.setTime(arguments[0].getTime());
    objStartDate.jumpToStartOfDay();

		if (objEarliestDate && objEarliestDate.getTime() > objStartDate.getTime())
		{
			objStartDate.setTime(objEarliestDate.getTime());
		}
		else if (objLatestDate && objLatestDate.getTime() < objStartDate.getTime())
		{
			objStartDate.setTime(objLatestDate.getTime());
		}

		objMonthYear.setMonth(objStartDate.getMonth());
		objMonthYear.setFullYear(objStartDate.getFullYear());

		if (!objSelectedDate) objSelectedDate = new Date(objStartDate);
		objSelectedDate.setTime(objStartDate);

		return true;
	};

	this.setEarliestDate = function()
	{
    // convert string date
    if (arguments.length && typeof(arguments[0]) == 'string') { arguments[0] = Date.strToDate(arguments[0]); }
		if (!arguments.length || !(typeof(arguments[0]) == 'object') || !arguments[0].getTime) return false;

		objEarliestDate = arguments[0];
		objStartDate.jumpToStartOfDay();

		if (objEarliestDate.getTime() > objStartDate.getTime())
		{
			objStartDate.setTime(objEarliestDate.getTime());
			objMonthYear.setMonth(objEarliestDate.getMonth());
			objMonthYear.setFullYear(objEarliestDate.getFullYear());
		}

		return true;
	};

	this.setLatestDate = function()
	{
    // convert string date
    if (arguments.length && typeof(arguments[0]) == 'string') { arguments[0] = Date.strToDate(arguments[0]); }
		if (!arguments.length || !(typeof(arguments[0]) == 'object') || !arguments[0].getTime) return false;

		objLatestDate = arguments[0];
		objLatestDate.jumpToStartOfDay();

		if (objLatestDate.getTime() < objStartDate.getTime())
		{
			objStartDate.setTime(objLatestDate.getTime());
			objMonthYear.setMonth(objLatestDate.getMonth());
			objMonthYear.setFullYear(objLatestDate.getFullYear());
		}

		return true;
	};

	this.setAllowedDays = function()
	{
		if (!arguments.length || !(typeof(arguments[0]) == 'object')) return false;

		var nCount;
		for (nCount = 0; nCount < 7; ++nCount)
		{
			objAllowedDays[nCount] = false;
		}

		for (nCount = 0; nCount < arguments[0].length; ++nCount)
		{
			objAllowedDays[arguments[0][nCount] + ''] = true;
		}

		return true;
	};

	this.getSelectedDate = function()
	{
		return objSelectedDate;
	};

	var clickWindow = function(e)
	{
		e = e || window.event;
		var ndTarget = e.target || e.srcElement;

		while (ndTarget && (ndTarget != document))
		{
			if (ndTarget.className == 'calendar')
			{
				return true;
			}
			ndTarget = ndTarget.parentNode;
		}

		for (var nCount = 0; nCount <= nDateChooserID; ++nCount)
		{
			if (ndFrame) ndFrame.style.display = 'none';
			document.getElementById('calendar' + nCount).style.visibility = 'hidden';
		}

		return true;
	};

	var mouseoverDateChooser = function()
	{
		if (objTimeout) clearTimeout(objTimeout);
		return true;
	};

	var mouseoutDateChooser = function()
	{
		if (nTimeout > 0) objTimeout = setTimeout('document.getElementById("' + sDateChooserID + '").style.visibility = "hidden"; if (document.getElementById("iframehack")) document.getElementById("iframehack").style.display = "none";', nTimeout);
		return true;
	};

	// This is the addEvent script written by Dean Edwards (dean.edwards.name)
	// It has been edited for better readability.

	var addEvent = function(ndElement, sType, fnHandler)
	{
		if (!fnHandler.$$nEventID) fnHandler.$$nEventID = addEvent.nEventID++;
		if (typeof(ndElement.aEvents) == 'undefined') ndElement.aEvents = {};

		var aHandlers = ndElement.aEvents[sType];
		if (!aHandlers)
		{
			aHandlers = ndElement.aEvents[sType] = {};
			if (ndElement['on' + sType]) aHandlers[0] = ndElement['on' + sType];
		}

		aHandlers[fnHandler.$$nEventID] = fnHandler;
		ndElement['on' + sType] = handleEvent;
	};

	var handleEvent = function(e)
	{
		var bReturn = true;
		e = e || window.event;
		var aHandlers = this.aEvents[e.type];
		for (var nIndex in aHandlers)
		{
			this.$$handleEvent = aHandlers[nIndex];
			if (this.$$handleEvent(e) === false) bReturn = false;
		}
		return bReturn;
	};

	addEvent.nEventID = 1;

	addEvent(ndDateChooser, 'mouseover', mouseoverDateChooser);
	addEvent(ndDateChooser, 'mouseout', mouseoutDateChooser);
	addEvent(document, 'mousedown', clickWindow);

	return true;
};


SRAOS_DateChooser.createElement = function(sElement) {
  if (typeof(document.createElement) != 'undefined') {
    return document.createElement(sElement);
  }
  
  return (typeof(document.createElementNS) != 'undefined') ? document.createElementNS('http://www.w3.org/1999/xhtml', sElement) : false;
};


SRAOS_DateChooser.getIcon = function() {
  return OS.getThemeUri() + 'datechooser.gif';
};


/**
 * renders a calendar into the container specified
 * @param Object container where the calendar should be rendered
 * @param Date start the start date for the calendar. if not specified, the 
 * current date will be used instead
 * @param Object callbackObj a callback object that may be used to modify the 
 * calendar day cells using the following callback methods (only the methods 
 * that exist will be invoked):
 *   renderCalendarStart(start : Date, container : Object) : void
 *   renderCalendarCell(cellDate : Date, tdElement : Object, aElement : Object, container : Object) : void
 *   renderCalendarEnd(start : Date, tdElements : Array, aElements : Array, container : Object) : void
 * where tdElement is the td cell element containing the day, aElement is the a 
 * link element surrounding the day (within the cell), tdElements/aElements are 
 * hashes of the latter indexed by the day, and container is a reference to the 
 * container parameter. when calendars are chained, the callback object will be 
 * invoked for each calendar in the chain
 * @param boolean noYearNav when true, no year nav links will be rendered
 * @param boolean noMonthNav when true, no month nav links will be rendered
 * @param Array chainedCalendars optional chained calendar containers. when the 
 * navigation is utilized for this calendar, the same navigation change will 
 * occur in all chained calendars
 * @return void
 */
SRAOS_DateChooser.renderCalendar = function(container, start, callbackObj, noYearNav, noMonthNav, chainedCalendars) {
  var ndTable, ndTHead, ndTR, ndTH, ndA, ndTBody, ndTD;
  var sClass = '';
  
  start = start ? start : new Date();
  start.jumpToStartOfMonth();
  container._start = start;
  container._callbackObj = callbackObj;
  container._noYearNav = noYearNav;
  container._noMonthNav = noMonthNav;
  container._chainedCalendars = chainedCalendars;
  container._renderId = container._renderId ? container._renderId : SRAOS_DateChooser._renderCounter++;
  container.getEndDate = function() {
    var endDate = new Date(this._start);
    endDate.jumpToEndOfMonth();
    return endDate;
  };
  container.getStartDate = function() {
    return this._start;
  };
  container.navigate = function(months) {
    if (!SRAOS_Util.inArray(this._renderId, SRAOS_DateChooser._navigateStack)) {
      SRAOS_DateChooser._navigateStack.push(this._renderId);
      var newStart = months ? new Date(this._start) : new Date();
      if (months) {
        newStart.jumpMonths(months);
      }
      else {
        var tmpDate = new Date(this._start);
        var increment = tmpDate.getTime() < newStart.getTime();
        months = 0;
        while(tmpDate.getMonth() != newStart.getMonth() || tmpDate.getFullYear() != newStart.getFullYear()) {
          months = months + (increment ? 1 : -1);
          tmpDate[increment ? 'incrementMonth' : 'decrementMonth']();
        }
      }
      SRAOS_DateChooser.renderCalendar(this, newStart, this._callbackObj, this._noYearNav, this._noMonthNav, this._chainedCalendars);
      if (this._chainedCalendars) {
        for(var i in this._chainedCalendars) {
          this._chainedCalendars[i].navigate(months);
        }
      }
      SRAOS_DateChooser._navigateStack = SRAOS_Util.removeFromArray(this._renderId, SRAOS_DateChooser._navigateStack);
    }
  };
  
  var objTempDate = new Date(start);
  objTempDate.setDate(1);
  
  var currentDate = new Date();
  
  if (callbackObj && callbackObj['renderCalendarStart']) { callbackObj['renderCalendarStart'](start, container); }
  
  container.className = 'calendar';
  ndTable = SRAOS_DateChooser.createElement('table');
  ndTable.setAttribute('summary', 'SRAOS_DateChooser');

  ndTHead = SRAOS_DateChooser.createElement('thead');
  ndTable.appendChild(ndTHead);

  ndTR = SRAOS_DateChooser.createElement('tr');
  ndTHead.appendChild(ndTR);
  
  if (!noYearNav) {
    ndTH = SRAOS_DateChooser.createElement('th');
    ndTR.appendChild(ndTH);
    ndA = SRAOS_DateChooser.createElement('a');
    ndA._container = container;
    ndA.className = 'previousyear';
    ndA.setAttribute('onclick', 'this._container.navigate(-12)');
    ndA.setAttribute('href', '#');
    ndA.setAttribute('title', OS.getString('text.previousYear'));
    ndTH.appendChild(ndA);
    ndA.appendChild(document.createTextNode(String.fromCharCode(171)));
  }
  
  if (!noMonthNav) {
    ndTH = SRAOS_DateChooser.createElement('th');
    ndTR.appendChild(ndTH);
    ndA = SRAOS_DateChooser.createElement('a');
    ndA._container = container;
    ndA.className = 'previousmonth';
    ndA.setAttribute('onclick', 'this._container.navigate(-1)');
    ndA.setAttribute('href', '#');
    ndA.setAttribute('title', OS.getString('text.previousMonth'));
    ndTH.appendChild(ndA);
    ndA.appendChild(document.createTextNode(String.fromCharCode(60)));
  }

  ndTH = SRAOS_DateChooser.createElement('th');
  ndTH.setAttribute('colspan', !noYearNav && !noMonthNav ? '3' : (!noYearNav || !noMonthNav ? '5' : '7'));
  /*@cc_on@*/
  /*@if(@_jscript_version < 6)
    ndTH.colSpan = '3';
  /*@end@*/
  ndTR.appendChild(ndTH);
  if (!noMonthNav) {
    ndA = SRAOS_DateChooser.createElement('a');
    ndA._container = container;
    ndA.className = 'currentdate';
    ndA.setAttribute('onclick', 'this._container.navigate()');
    ndA.setAttribute('href', '#');
    ndA.setAttribute('title', OS.getString('text.currentMonth'));
    ndA.appendChild(document.createTextNode(start.getPHPDate("M Y")));
  }
  ndTH.appendChild(!noMonthNav ? ndA : document.createTextNode(start.getPHPDate("M Y")));
  
  if (!noMonthNav) {
    ndTH = SRAOS_DateChooser.createElement('th');
    ndTR.appendChild(ndTH);
    ndA = SRAOS_DateChooser.createElement('a');
    ndA._container = container;
    ndA.className = 'nextmonth';
    ndA.setAttribute('onclick', 'this._container.navigate(1)');
    ndA.setAttribute('href', '#');
    ndA.setAttribute('title', OS.getString('text.nextMonth'));
    ndTH.appendChild(ndA);
    ndA.appendChild(document.createTextNode(String.fromCharCode(62)));
  }
  
  if (!noYearNav) {
    ndTH = SRAOS_DateChooser.createElement('th');
    ndTR.appendChild(ndTH);
    ndA = SRAOS_DateChooser.createElement('a');
    ndA._container = container;
    ndA.className = 'nextyear';
    ndA.setAttribute('onclick', 'this._container.navigate(12)');
    ndA.setAttribute('href', '#');
    ndA.setAttribute('title', OS.getString('text.nextYear'));
    ndTH.appendChild(ndA);
    ndA.appendChild(document.createTextNode(String.fromCharCode(187)));
  }

  ndTR = SRAOS_DateChooser.createElement('tr');
  ndTHead.appendChild(ndTR);

  ndTD = SRAOS_DateChooser.createElement('td');
  ndTR.appendChild(ndTD);
  ndTD.appendChild(document.createTextNode(OS.getString('form.date.dayChar.0')));

  ndTD = SRAOS_DateChooser.createElement('td');
  ndTR.appendChild(ndTD);
  ndTD.appendChild(document.createTextNode(OS.getString('form.date.dayChar.1')));

  ndTD = SRAOS_DateChooser.createElement('td');
  ndTR.appendChild(ndTD);
  ndTD.appendChild(document.createTextNode(OS.getString('form.date.dayChar.2')));

  ndTD = SRAOS_DateChooser.createElement('td');
  ndTR.appendChild(ndTD);
  ndTD.appendChild(document.createTextNode(OS.getString('form.date.dayChar.3')));

  ndTD = SRAOS_DateChooser.createElement('td');
  ndTR.appendChild(ndTD);
  ndTD.appendChild(document.createTextNode(OS.getString('form.date.dayChar.4')));

  ndTD = SRAOS_DateChooser.createElement('td');
  ndTR.appendChild(ndTD);
  ndTD.appendChild(document.createTextNode(OS.getString('form.date.dayChar.5')));

  ndTD = SRAOS_DateChooser.createElement('td');
  ndTR.appendChild(ndTD);
  ndTD.appendChild(document.createTextNode(OS.getString('form.date.dayChar.6')));

  ndTBody = SRAOS_DateChooser.createElement('tbody');
  ndTable.appendChild(ndTBody);
  
  var tdElements = new Array();
  var aElements = new Array();

  while (objTempDate.getMonth() == start.getMonth())
  {
    ndTR = SRAOS_DateChooser.createElement('tr');
    ndTBody.appendChild(ndTR);

    for (var nWeek = 0; nWeek < 7; ++nWeek)
    {
      if ((objTempDate.getDay() == nWeek) && (objTempDate.getMonth() == start.getMonth()))
      {
        sClass  = '';
        sClass += objTempDate.equals(currentDate, true) ? ' today' : '';
        sClass  = ((sClass.length > 0) && (sClass[1] == ' ')) ? sClass.substr(1, sClass.length - 1) : sClass;

        ndTD = SRAOS_DateChooser.createElement('td');
        ndTR.appendChild(ndTD);

        ndA = SRAOS_DateChooser.createElement('a');
        if (sClass.length > 0) ndA.className = sClass;
        ndA.setAttribute('href', '#');
        ndTD.appendChild(ndA);
        ndA.appendChild(document.createTextNode(objTempDate.getDate()));
        if (callbackObj && callbackObj['renderCalendarCell']) { callbackObj['renderCalendarCell'](objTempDate, ndTD, ndA, container); }
        if (callbackObj && callbackObj['renderCalendarEnd']) {
          tdElements[objTempDate.getDate()] = ndTD;
          aElements[objTempDate.getDate()] = ndA;
        }
        objTempDate.setDate(objTempDate.getDate() + 1);
      }
      else
      {
        ndTD = SRAOS_DateChooser.createElement('td');
        ndTR.appendChild(ndTD);
      }
    }
  }
  
  while (container.hasChildNodes()) container.removeChild(container.firstChild);
  container.appendChild(ndTable);
  
  if (callbackObj && callbackObj['renderCalendarEnd']) { callbackObj['renderCalendarEnd'](start, tdElements, aElements, container); }
  tdElements = null;
  aElements = null;
};
SRAOS_DateChooser._navigateStack = new Array();
SRAOS_DateChooser._renderCounter = 1;