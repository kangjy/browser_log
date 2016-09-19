if(typeof window.console == "undefined"){
	window.console={}
}
/**
 * @private
 * @ignore
 */
if (!Array.prototype.forEach) {

  Array.prototype.forEach = function(callback, thisArg) {

    var T, k;

    if (this == null) {
      throw new TypeError(' this is null or not defined');
    }

    // 1. Let O be the result of calling toObject() passing the
    // |this| value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get() internal
    // method of O with the argument "length".
    // 3. Let len be toUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If isCallable(callback) is false, throw a TypeError exception. 
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== "function") {
      throw new TypeError(callback + ' is not a function');
    }

    // 5. If thisArg was supplied, let T be thisArg; else let
    // T be undefined.
    if (arguments.length > 1) {
      T = thisArg;
    }

    // 6. Let k be 0
    k = 0;

    // 7. Repeat, while k < len
    while (k < len) {

      var kValue;

      // a. Let Pk be ToString(k).
      //    This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty
      //    internal method of O with argument Pk.
      //    This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal
        // method of O with argument Pk.
        kValue = O[k];

        // ii. Call the Call internal method of callback with T as
        // the this value and argument list containing kValue, k, and O.
        callback.call(T, kValue, k, O);
      }
      // d. Increase k by 1.
      k++;
    }
    // 8. return undefined
  };
}

/**
 * @private
 * @ignore
 */
if (!Array.prototype.push) {
	/**
	 * Functions taken from Prototype library, didn't want to require for just few 
	 * functions.
	 * More info at {@link http://prototype.conio.net/}
	 * @private
	 */
	Array.prototype.push = function() {
		var startLength = this.length;
		for (var i = 0; i < arguments.length; i++) {
			this[startLength + i] = arguments[i];
		}
		return this.length;
	};
}
var Log4js = {
	
	/** 
	 * Current version of log4js. 
	 * @static
	 * @final
	 */
  	version: "1.0.0",

	/**  
	 * Date of logger initialized.
	 * @static
	 * @final
	 */
	applicationStartDate: new Date(),
		
	/**  
	 * Hashtable of loggers.
	 * @static
	 * @final
	 * @private  
	 */
	loggers: {},
	
	/**
	 * Get a logger instance. Instance is cached on categoryName level.
	 * @param  {String} categoryName name of category to log to.
	 * @return {Logger} instance of logger for the category
	 * @static
	 */
	getLogger: function(categoryName) {
		
		// Use default logger if categoryName is not specified or invalid
		if (typeof categoryName != "string") {
			categoryName = "[default]";
		}

		if (!Log4js.loggers[categoryName]) {
			// Create the logger for this name if it doesn't already exist
			Log4js.loggers[categoryName] = new Log4js.Logger(categoryName);
		}
		
		return Log4js.loggers[categoryName];
	},
	
	/**
	 * Get the default logger instance.
	 * @return {Logger} instance of default logger
	 * @static
	 */
	getDefaultLogger: function() {
		return Log4js.getLogger("[default]"); 
	},
	/**
	 * replace browser default console
	 * @return {Logger} instance of default logger
	 * @static
	 */
	replaceConsole: function (logger) {
	  function replaceWith(fn) {
	    return function() {
	      fn.apply(logger, arguments);
	    };
	  }
	  if(!logger){
	  	logger = new Log4js.getLogger("console");
	  	logger.addAppender(new Log4js.BrowserAppender());
	  	logger.setLevel(Log4js.Level.ALL);
	  }
	  // logger.setLevel(Log4js.Level.ALL)
	  if(!window.console){
	  	console={}
	  }
	  ['debug','info','warn','error'].forEach(function (item) {
	    console[item] = replaceWith(logger[item]);
	  });
	},
	
  	/**
  	 * Atatch an observer function to an elements event browser independent.
  	 * 
  	 * @param element element to attach event
  	 * @param name name of event
  	 * @param observer observer method to be called
  	 * @private
  	 */
  	attachEvent: function (element, name, observer) {
		if (element.addEventListener) { //DOM event model
			element.addEventListener(name, observer, false);
    	} else if (element.attachEvent) { //M$ event model
			element.attachEvent('on' + name, observer);
    	}
	}
	
	/**
	 * Load a JS-script dynamically.
	 * @param {String} src
	 */
/*	$import: function (src) {
		var documentScripts = document.getElementsByTagName("script");
	
		for (index = 0; index < documentScripts.length; ++index)
		{
			var documentScript = documentScripts[index];
			if (documentScript.src == src) {
				return false;
			}
		}
		
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = src;
		document.getElementsByTagName('head')[0].appendChild(script); 
		
		return true;
	}
	*/
};

/**
 * Internal object extension (OO) methods.
 * 
 * @private
 */
Log4js.extend = function(destination, source) {
  for (var property in source) {
    destination[property] = source[property];
  }
  return destination;
};
    
/**
 * Functions taken from Prototype library,  
 * didn't want to require for just few functions.
 * More info at {@link http://prototype.conio.net/}
 * @private
 */	
Log4js.bind = function(fn, object) {
  return function() {
        return fn.apply(object, arguments);
  };
};
/**
 * FIFO buffer
 * @constructor
 * @private
 */
Log4js.FifoBuffer = function()
{
  this.array = [];
};

Log4js.FifoBuffer.prototype = {

	/**
	 * @param {Object} obj any object added to buffer
	 */
	push : function(obj) {
        this.array[this.array.length] = obj;
        return this.array.length;
	},
	
	/**
	 * @return first putted in Object
	 */
	pull : function() {
		if (this.array.length > 0) {
			var firstItem = this.array[0];
			for (var i = 0; i < this.array.length - 1; i++) {
				this.array[i] = this.array[i + 1];
			}
			this.array.length = this.array.length - 1;
			return firstItem;
		}
		return null;
	},
	
	length : function() {
		return this.array.length;
	}
};
/**
 * Log4js.Level Enumeration. Do not use directly. Use static objects instead.
 * @constructor
 * @param {Number} level number of level
 * @param {String} levelString String representation of level
 * @private
 */
Log4js.Level = function(level, levelStr) {
	this.level = level;
	this.levelStr = levelStr;
};

Log4js.Level.prototype =  {
	/** 
	 * converts given String to corresponding Level
	 * @param {String} sArg String value of Level
	 * @param {Log4js.Level} defaultLevel default Level, if no String representation
	 * @return Level object
	 * @type Log4js.Level
	 */
	toLevel: function(sArg, defaultLevel) {
		if(sArg === null) {
			return defaultLevel;
		}

		if(typeof sArg == "string") {
			var s = sArg.toUpperCase();

			switch(s) {
				case "ALL": return Log4js.Level.ALL;
				case "DEBUG": return Log4js.Level.DEBUG;
				case "INFO": return Log4js.Level.INFO;
				case "WARN": return Log4js.Level.WARN;
				case "ERROR": return Log4js.Level.ERROR;
				case "FATAL": return Log4js.Level.FATAL;
				case "OFF": return Log4js.Level.OFF;
				case "TRACE": return Log4js.Level.TRACE;
				default: return defaultLevel;
			}
		} else if(typeof sArg == "number") {
			switch(sArg) {
				case ALL_INT: return Log4js.Level.ALL;
				case DEBUG_INT: return Log4js.Level.DEBUG;
				case INFO_INT: return Log4js.Level.INFO;
				case WARN_INT: return Log4js.Level.WARN;
				case ERROR_INT: return Log4js.Level.ERROR;
				case FATAL_INT: return Log4js.Level.FATAL;
				case OFF_INT: return Log4js.Level.OFF;
				case TRACE_INT: return Log4js.Level.TRACE;
				default: return defaultLevel;
			}
		} else {
			return defaultLevel;
		}
	},
	/**
	 * @return  converted Level to String
	 * @type String
	 */
	toString: function() {
		return this.levelStr;
	},
	/**
	 * @return internal Number value of Level
	 * @type Number
	 */
	valueOf: function() {
		return this.level;
	}
};

// Static variables
/**
 * @private
 */
Log4js.Level.OFF_INT = Number.MAX_VALUE;
/** 
 * @private
 */
Log4js.Level.FATAL_INT = 50000;
/** 
 * @private
 */
Log4js.Level.ERROR_INT = 40000;
/** 
 * @private
 */
Log4js.Level.WARN_INT = 30000;
/** 
 * @private
 */
Log4js.Level.INFO_INT = 20000;
/** 
 * @private
 */
Log4js.Level.DEBUG_INT = 10000;
/** 
 * @private
 */
Log4js.Level.TRACE_INT = 5000;
/** 
 * @private
 */
Log4js.Level.ALL_INT = Number.MIN_VALUE;

/** 
 * Logging Level OFF - all disabled
 * @type Log4js.Level
 * @static
 */
Log4js.Level.OFF = new Log4js.Level(Log4js.Level.OFF_INT, "OFF");
/** 
 * Logging Level Fatal
 * @type Log4js.Level
 * @static
 */
Log4js.Level.FATAL = new Log4js.Level(Log4js.Level.FATAL_INT, "FATAL");
/** 
 * Logging Level Error
 * @type Log4js.Level
 * @static
 */
Log4js.Level.ERROR = new Log4js.Level(Log4js.Level.ERROR_INT, "ERROR"); 
/** 
 * Logging Level Warn
 * @type Log4js.Level
 * @static
 */
Log4js.Level.WARN = new Log4js.Level(Log4js.Level.WARN_INT, "WARN");
/** 
 * Logging Level Info
 * @type Log4js.Level
 * @static
 */
Log4js.Level.INFO = new Log4js.Level(Log4js.Level.INFO_INT, "INFO");
/** 
 * Logging Level Debug
 * @type Log4js.Level
 * @static
 */
Log4js.Level.DEBUG = new Log4js.Level(Log4js.Level.DEBUG_INT, "DEBUG");
/** 
 * Logging Level Trace
 * @type Log4js.Level
 * @static
 */
Log4js.Level.TRACE = new Log4js.Level(Log4js.Level.TRACE_INT, "TRACE");
/** 
 * Logging Level All - All traces are enabled
 * @type Log4js.Level
 * @static
 */
Log4js.Level.ALL = new Log4js.Level(Log4js.Level.ALL_INT, "ALL");

/**
 * Date Formatter
 * addZero() and formatDate() are courtesy of Mike Golding:
 * http://www.mikezilla.com/exp0015.html
 * @constructor
 */ 
Log4js.DateFormatter = function() {
	return;
};
/**
 * default format of date (ISO-8601)
 * @static
 * @final
 */
Log4js.DateFormatter.DEFAULT_DATE_FORMAT = "yyyy-MM-ddThh:mm:ssO";


Log4js.DateFormatter.prototype = {
	/**
	 * Formats the given date by the given pattern.<br />
	 * Following switches are supported:
	 * <ul>
	 * <li>yyyy: The year</li>
	 * <li>MM: the month</li>
	 * <li>dd: the day of month<li>
	 * <li>hh: the hour<li>
	 * <li>mm: minutes</li>
	 * <li>O: timezone offset</li>
	 * </ul>
	 * @param {Date} vDate the date to format
	 * @param {String} vFormat the format pattern
	 * @return {String} formatted date string
	 * @static
	 */
	formatDate : function(vDate, vFormat) {
	  var vDay = this.addZero(vDate.getDate());
	  var vMonth = this.addZero(vDate.getMonth()+1);
	  var vYearLong = this.addZero(vDate.getFullYear());
	  var vYearShort = this.addZero(vDate.getFullYear().toString().substring(3,4));
	  var vYear = (vFormat.indexOf("yyyy")>-1?vYearLong:vYearShort);
	  var vHour  = this.addZero(vDate.getHours());
	  var vMinute = this.addZero(vDate.getMinutes());
	  var vSecond = this.addZero(vDate.getSeconds());
	  var vTimeZone = this.O(vDate);
	  var vDateString = vFormat.replace(/dd/g, vDay).replace(/MM/g, vMonth).replace(/y{1,4}/g, vYear);
	  vDateString = vDateString.replace(/hh/g, vHour).replace(/mm/g, vMinute).replace(/ss/g, vSecond);
	  vDateString = vDateString.replace(/O/g, vTimeZone);
	  return vDateString;
	},
	/**
	 * Formats the given date by the given pattern in UTC without timezone specific information.<br />
	 * Following switches are supported:
	 * <ul>
	 * <li>yyyy: The year</li>
	 * <li>MM: the month</li>
	 * <li>dd: the day of month<li>
	 * <li>hh: the hour<li>
	 * <li>mm: minutes</li>
	 * </ul>
	 * @param {Date} vDate the date to format
	 * @param {String} vFormat the format pattern
	 * @return {String} formatted date string
	 * @static
	 */
	formatUTCDate : function(vDate, vFormat) {
		var vDay = this.addZero(vDate.getUTCDate());
		var vMonth = this.addZero(vDate.getUTCMonth()+1);
		var vYearLong = this.addZero(vDate.getUTCFullYear());
		var vYearShort = this.addZero(vDate.getUTCFullYear().toString().substring(3,4));
		var vYear = (vFormat.indexOf("yyyy")>-1?vYearLong:vYearShort);
		var vHour	 = this.addZero(vDate.getUTCHours());
		var vMinute = this.addZero(vDate.getUTCMinutes());
		var vSecond = this.addZero(vDate.getUTCSeconds());
		var vDateString = vFormat.replace(/dd/g, vDay).replace(/MM/g, vMonth).replace(/y{1,4}/g, vYear);
		vDateString = vDateString.replace(/hh/g, vHour).replace(/mm/g, vMinute).replace(/ss/g, vSecond);
		return vDateString;
	},

	/**
	 * @private
	 * @static
	 */
	addZero : function(vNumber) {
	  return ((vNumber < 10) ? "0" : "") + vNumber;
	},

	/**
	 * Formates the TimeOffest
	 * Thanks to http://www.svendtofte.com/code/date_format/
	 * @private
	 */
	O : function (date) {
		// Difference to Greenwich time (GMT) in hours
		var os = Math.abs(date.getTimezoneOffset());
		var h = String(Math.floor(os/60));
		var m = String(os%60);
		if(h.length == 1) h = "0" + h;
		if(m.length == 1) m = "0" + m;
		return date.getTimezoneOffset() < 0 ? "+"+h+m : "-"+h+m;
	}
};


/**
 * Log4js CustomEvent
 * @constructor
 * @author Corey Johnson - original code in Lumberjack (http://gleepglop.com/javascripts/logger/)
 * @author Seth Chisamore - adapted for Log4js
 * @private
 */
Log4js.CustomEvent = function() {
	this.listeners = [];
};

Log4js.CustomEvent.prototype = {
 
 	/**
 	 * @param method method to be added
 	 */ 
	addListener : function(method) {
		this.listeners.push(method);
	},

 	/**
 	 * @param method method to be removed
 	 */ 
	removeListener : function(method) {
		var foundIndexes = this.findListenerIndexes(method);

		for(var i = 0; i < foundIndexes.length; i++) {
			this.listeners.splice(foundIndexes[i], 1);
		}
	},

 	/**
 	 * @param handler
 	 */ 
	dispatch : function(handler) {
		for(var i = 0; i < this.listeners.length; i++) {
			try {
				this.listeners[i](handler);
			}
			catch (e) {
				console.log(e)
				if(log4jsLogger) log4jsLogger.warn("Could not run the listener " + this.listeners[i] + ". \n" + e);
			}
		}
	},

	/**
	 * @private
	 * @param method
	 */
	findListenerIndexes : function(method) {
		var indexes = [];
		for(var i = 0; i < this.listeners.length; i++) {			
			if (this.listeners[i] == method) {
				indexes.push(i);
			}
		}

		return indexes;
	}
};



/**
 * Models a logging event.
 * @constructor
 * @param {String} categoryName name of category
 * @param {Log4js.Level} level level of message
 * @param {String} message message to log
 * @param {Log4js.Logger} logger the associated logger
 * @author Seth Chisamore
 */
Log4js.LoggingEvent = function(categoryName, level, message, exception, logger) {
	/**
	 * the timestamp of the Logging Event
	 * @type Date
	 * @private
	 */
	this.startTime = new Date();
	/**
	 * category of event
	 * @type String
	 * @private
	 */
	this.categoryName = categoryName;
	/**
	 * the logging message
	 * @type String
	 * @private
	 */
	this.message = message;
	/**
	 * the logging exception
	 * @type Exception
	 * @private
	 */
	this.exception = exception;
	/**
	 * level of log
	 * @type Log4js.Level
	 * @private
	 */
	this.level = level;
	/**
	 * reference to logger
	 * @type Log4js.Logger
	 * @private
	 */
	this.logger = logger;
};

Log4js.LoggingEvent.prototype = {	
	/**
	 * get the timestamp formatted as String.
	 * @return {String} formatted timestamp
	 * @see Log4js#setDateFormat()
	 */
	getFormattedTimestamp: function() {
		if(this.logger) {
			return this.logger.getFormattedTimestamp(this.startTime);
		} else {
			return this.startTime.toGMTString();
		}
	}
};

/**
 * Logger to log messages to the defined appender.</p>
 * Default appender is Appender, which is ignoring all messages. Please
 * use setAppender() to set a specific appender (e.g. WindowAppender).
 * use {@see Log4js#getLogger(String)} to get an instance.
 * @constructor
 * @param name name of category to log to
 * @author Stephan Strittmatter
 */
Log4js.Logger = function(name) {
	this.loggingEvents = [];
	this.appenders = [];
	/** category of logger */
	this.category = name || "";
	/** level to be logged */
	this.level = Log4js.Level.FATAL;
	
	this.dateformat = Log4js.DateFormatter.DEFAULT_DATE_FORMAT;
	this.dateformatter = new Log4js.DateFormatter();
	
	this.onlog = new Log4js.CustomEvent();
	this.onclear = new Log4js.CustomEvent();
	
	/** appender to write in */
	this.appenders.push(new Log4js.Appender(this));
	
	// if multiple log objects are instantiated this will only log to the log 
	// object that is declared last can't seem to get the attachEvent method to 
	// work correctly
	try {
		//window.onerror = this.windowError.bind(this);
	} catch (e) {
		//log4jsLogger.fatal(e);
	}
};

Log4js.Logger.prototype = {

	/**
	 * add additional appender. DefaultAppender always is there.
	 * @param appender additional wanted appender
	 */
	addAppender: function(appender) {
		if (appender instanceof Log4js.Appender) {
			appender.setLogger(this);
			this.appenders.push(appender);			
		} else {
			throw "Not instance of an Appender: " + appender;
		}
	},

	/**
	 * set Array of appenders. Previous Appenders are cleared and removed.
	 * @param {Array} appenders Array of Appenders
	 */
	setAppenders: function(appenders) {
		//clear first all existing appenders
		for(var i = 0; i < this.appenders.length; i++) {
			this.appenders[i].doClear();
		}
		
		this.appenders = appenders;
		
		for(var j = 0; j < this.appenders.length; j++) {
			this.appenders[j].setLogger(this);
		}
	},
	
	/**
	 * Set the Loglevel default is LogLEvel.TRACE
	 * @param level wanted logging level
	 */
	setLevel: function(level) {
		this.level = level;
	},
	
	/** 
	 * main log method logging to all available appenders 
	 * @private
	 */
	log: function(logLevel, message, exception) {
		var loggingEvent = new Log4js.LoggingEvent(this.category, logLevel, 
			message, exception, this);
		this.loggingEvents.push(loggingEvent);
		this.onlog.dispatch(loggingEvent);
	},
	
	/** clear logging */
	clear : function () {
		try{
			this.loggingEvents = [];
			this.onclear.dispatch();
		} catch(e){}
	},
	/** checks if Level Trace is enabled */
	isTraceEnabled: function() {
		if (this.level.valueOf() <= Log4js.Level.TRACE.valueOf()) {
			return true;
		}
		return false;
	},
	/** 
	 * Trace messages 
	 * @param message {Object} message to be logged
	 */
	trace: function(message) {
		if (this.isTraceEnabled()) {
			this.log(Log4js.Level.TRACE, message, null);
		}
	},
	/** checks if Level Debug is enabled */
	isDebugEnabled: function() {
		if (this.level.valueOf() <= Log4js.Level.DEBUG.valueOf()) {
			return true;
		}
		return false;
	},
	/**
	 * Debug messages 
	 * @param {Object} message  message to be logged
	 * @param {Throwable} throwable 
	 */
	debug: function(message, throwable) {
		if (this.isDebugEnabled()) {
			this.log(Log4js.Level.DEBUG, message, throwable);
		}
	},	
	/** checks if Level Info is enabled */
	isInfoEnabled: function() {
		if (this.level.valueOf() <= Log4js.Level.INFO.valueOf()) {
			return true;
		}
		return false;
	},
	/** 
	 * logging info messages 
	 * @param {Object} message  message to be logged
	 * @param {Throwable} throwable  
	 */
	info: function(message, throwable) {
		if (this.isInfoEnabled()) {
			this.log(Log4js.Level.INFO, message, throwable);
		}
	},
	/** checks if Level Warn is enabled */
	isWarnEnabled: function() {
		if (this.level.valueOf() <= Log4js.Level.WARN.valueOf()) {
			return true;
		}
		return false;
	},

	/** logging warn messages */
	warn: function(message, throwable) {
		if (this.isWarnEnabled()) {
			this.log(Log4js.Level.WARN, message, throwable);
		}
	},
	/** checks if Level Error is enabled */
	isErrorEnabled: function() {
		if (this.level.valueOf() <= Log4js.Level.ERROR.valueOf()) {
			return true;
		}
		return false;
	},
	/** logging error messages */
	error: function(message, throwable) {
		if (this.isErrorEnabled()) {
			this.log(Log4js.Level.ERROR, message, throwable);
		}
	},
	/** checks if Level Fatal is enabled */
	isFatalEnabled: function() {
		if (this.level.valueOf() <= Log4js.Level.FATAL.valueOf()) {
			return true;
		}
		return false;
	},
	/** logging fatal messages */
	fatal: function(message, throwable) {
		if (this.isFatalEnabled()) {
			this.log(Log4js.Level.FATAL, message, throwable);
		}
	},	
	/** 
	 * Capture main window errors and log as fatal.
	 * @private
	 */
	windowError: function(msg, url, line){
		var message = "Error in (" + (url || window.location) + ") on line "+ line +" with message (" + msg + ")";
		this.log(Log4js.Level.FATAL, message, null);	
	},
	
	/**
	 * Set the date format of logger. Following switches are supported:
	 * <ul>
	 * <li>yyyy - The year</li>
	 * <li>MM - the month</li>
	 * <li>dd - the day of month<li>
	 * <li>hh - the hour<li>
	 * <li>mm - minutes</li>
	 * <li>O - timezone offset</li>
	 * </ul>
	 * @param {String} format format String for the date
	 * @see {@getTimestamp}
	 */
	setDateFormat: function(format) {
	 	this.dateformat = format;
	},
	 
	/**
	 * Generates a timestamp using the format set in {Log4js.DateFormatter.formatDate}.
	 * @param {Date} date the date to format
	 * @see {@setDateFormat}
	 * @return A formatted timestamp with the current date and time.
	 */
	getFormattedTimestamp: function(date) {
	  return this.dateformatter.formatDate(date, this.dateformat);
	}
};

/**
 * Interface for Layouts.
 * Use this Layout as "interface" for other Layouts. It is doing nothing.
 *
 * @constructor
 * @author Stephan Strittmatter
 */
Log4js.Layout = function(){};
Log4js.Layout.prototype = {
	/** 
	 * Implement this method to create your own layout format.
	 * @param {Log4js.LoggingEvent} loggingEvent loggingEvent to format
	 * @return formatted String
	 * @type String
	 */
	format: function(loggingEvent) {
		return "";
	},
	/** 
	 * Returns the content type output by this layout. 
	 * @return The base class returns "text/plain".
	 * @type String
	 */
	getContentType: function() {
		return "text/plain";
	},
	/** 
	 * @return Returns the header for the layout format. The base class returns null.
	 * @type String
	 */
	getHeader: function() {
		return null;
	},
	/** 
	 * @return Returns the footer for the layout format. The base class returns null.
	 * @type String
	 */
	getFooter: function() {
		return null;
	},
	
	/**
	 * @return Separator between events
	 * @type String
	 */
	getSeparator: function() {
		return "";
	}
};


/**
 * Abstract base class for other appenders. 
 * It is doing nothing.
 *
 * @constructor
 * @param {Log4js.Logger} logger log4js instance this appender is attached to
 * @author Stephan Strittmatter
 */
Log4js.Appender = function () {
	/**
	 * Reference to calling logger
	 * @type Log4js.Logger
	 * @private
	 */
	 this.logger = null;
};

Log4js.Appender.prototype = {
	/** 
	 * appends the given loggingEvent appender specific
	 * @param {Log4js.LoggingEvent} loggingEvent loggingEvent to append
	 */
	doAppend: function(loggingEvent) {
		return;
	},
	/** 
	 * clears the Appender
	 */
	doClear: function() {
		return;
	},
	
	/**
	 * Set the Layout for this appender.
	 * @param {Log4js.Layout} layout Layout for formatting loggingEvent
	 */
	setLayout: function(layout){
		this.layout = layout;
	},
	/**
	 * Set reference to the logger.
	 * @param {Log4js.Logger} the invoking logger
	 */
	setLogger: function(logger){
		// add listener to the logger methods
		logger.onlog.addListener(Log4js.bind(this.doAppend, this));
		logger.onclear.addListener(Log4js.bind(this.doClear, this));
	
		this.logger = logger;
	}
};
/**
 * BasicLayout is a simple layout for storing the loggs. The loggs are stored
 * in following format:
 * <pre>
 * categoryName~startTime [logLevel] message\n
 * </pre>
 *
 * @constructor
 * @extends Log4js.Layout
 * @author Stephan Strittmatter
 */
Log4js.BasicLayout = function() {
	this.LINE_SEP  = "\n";
};

Log4js.BasicLayout.prototype = Log4js.extend(new Log4js.Layout(), /** @lends Log4js.BasicLayout# */ {
	/** 
	 * Implement this method to create your own layout format.
	 * @param {Log4js.LoggingEvent} loggingEvent loggingEvent to format
	 * @return formatted String
	 * @type String
	 */
	format: function(loggingEvent) {
		return loggingEvent.categoryName + "~" + loggingEvent.startTime.toLocaleString() + " [" + loggingEvent.level.toString() + "] " + loggingEvent.message + this.LINE_SEP;
	},
	/** 
	 * Returns the content type output by this layout. 
	 * @return The base class returns "text/plain".
	 * @type String
	 */
	getContentType: function() {
		return "text/plain";
	},
	/** 
	 * @return Returns the header for the layout format. The base class returns null.
	 * @type String
	 */
	getHeader: function() {
		return "";
	},
	/** 
	 * @return Returns the footer for the layout format. The base class returns null.
	 * @type String
	 */
	getFooter: function() {
		return "";
	}
});
Log4js.BrowserAppender = function(flag) {
	/**
	 * Delegate for browser specific implementation
	 * @type Log4js.Appender
	 * @private
	 */
	this.consoleDelegate = null;
	if (window.console.log&&arguments.length==0) {
		this.consoleDelegate = Log4js.extend(this,new Log4js.BrowserConsoleAppender()); 
	}
    else{
 		this.consoleDelegate = Log4js.extend(this,new Log4js.DivConsoleAppender(flag)); 
		
	}
};
Log4js.BrowserAppender.prototype = Log4js.extend(new Log4js.Appender(), /** @lends Log4js.BrowserConsoleAppender# */ {
	/** 
	 * @see Log4js.Appender#doAppend
	 */
	doAppend: function(loggingEvent) {
		this.consoleDelegate.doAppend(loggingEvent);
	},
	/** 
	 * @see Log4js.Appender#doClear
	 */
	doClear: function() {
		this.consoleDelegate.doClear();
	},
	/**
	 * @see Log4js.Appender#setLayout
	 */
	setLayout: function(layout){
		this.consoleDelegate.setLayout(layout);
	},
	
	/** 
	 * toString
	 */
	 toString: function() {
	 	return "Log4js.BrowserAppender: " + this.consoleDelegate.toString(); 
	 }
});
Log4js.BrowserConsoleAppender = function() {

	this.layout = new Log4js.BasicLayout();
};

Log4js.BrowserConsoleAppender.prototype = Log4js.extend(new Log4js.Appender(), /** @lends Log4js.JSAlertAppender# */ {
	/** 
	 * @see Log4js.Appender#doAppend
	 */
	doAppend: function(loggingEvent) {
		window.console.log(this.layout.format(loggingEvent));
	},
	
	/** 
	 * toString
	 */
	 toString: function() {
	 	return "Log4js.BrowserConsole"; 
	 }	
});
/**
 * Console Appender writes the logs to a console.  If "inline" is
 * set to "false" the console launches in another window otherwise
 * the window is inline on the page and toggled on and off with "Alt-D".
 * Note: At FireFox &gb; 2.0 the keystroke is little different now: "SHIFT+ALT+D".
 *
 * @constructor
 * @extends Log4js.Appender
 * @param {boolean} isInline boolean value that indicates whether the console be placed inline, default is to launch in new window
 *
 * @author Corey Johnson - original console code in Lumberjack (http://gleepglop.com/javascripts/logger/)
 * @author Seth Chisamore - adapted for use as a log4js appender
 */
Log4js.DivConsoleAppender = function(isInline,that) {
	
	/**
	 * @type Log4js.Layout
	 * @private
	 */
	this.layout = new Log4js.BasicLayout();
	/**
	 * @type boolean
	 * @private
	 */
	this.inline = !isInline;

	/**
	 * @type String
	 * @private
	 */
	this.accesskey = "d";
	
	/**
	 * @private
	 */
	this.tagPattern = null;
	
	this.commandHistory = [];
  	this.commandIndex = 0;
  	this.initializeflag = false;
  	/**
  	 * true if popup is blocked.
  	 */
  	this.popupBlocker = false;
  	
  	/**
  	 * current output div-element.
  	 */
  	this.outputElement = null;
  	
  	this.docReference = null;
	this.winReference = null;	

	this.loggingEventMap = new Log4js.FifoBuffer();	
	if(this.inline) {
		//Log4js.attachEvent(window, 'load', Log4js.bind(this.initialize,this));
	}
};

Log4js.DivConsoleAppender.prototype = Log4js.extend(new Log4js.Appender(), /** @lends Log4js.ConsoleAppender# */ {

	/**
	 * Set the access key to show/hide the inline console (default &quote;d&quote;)
	 * @param key access key to show/hide the inline console
	 */	
	setAccessKey : function(key) {
		this.accesskey = key;
	},

	/**
	 * @private
	 */
  	initialize : function() {
  		this.initializeflag = true;
		if(!this.inline) {

			var winName = this.makeWinName(this.logger.category);

			window.top.consoleWindow = window.open("", winName, 
				"left=0,top=0,width=700,height=700,scrollbars=no,status=no,resizable=yes;toolbar=no");            
			window.top.consoleWindow.opener = self;
			var win = window.top.consoleWindow;
								
			if (!win) { 
				this.popupBlocker=true; 
				alert("Popup window manager blocking the Log4js popup window to bedisplayed.\n\n" 
					+ "Please disabled this to properly see logged events.");  
			} else {	
				var doc = win.document;
				doc.open();
				doc.write("<!DOCTYPE html PUBLIC -//W3C//DTD XHTML 1.0 Transitional//EN ");
				doc.write("  http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd>\n\n");
				doc.write("<html><head><title>Log4js - " + this.logger.category + "</title>\n");
				doc.write("</head><body style=\"background-color:darkgray\"></body>\n");
				win.blur();
				win.focus();
			}
			
			this.docReference = doc;
			this.winReference = win;
		} else {
			this.docReference = document;
			this.winReference = window;			
		}
				
		this.outputCount = 0;
		this.tagPattern = ".*";
	  
		// I hate writing javascript in HTML... but what's a better alternative
		this.logElement = this.docReference.createElement('div');
		this.docReference.body.appendChild(this.logElement);
		// this.logElement.style.display = 'none';
		this.logElement.id = "log4js_elid"
		this.logElement.style.position = "absolute";
		this.logElement.style.left = '0px';
		this.logElement.style.width = '100%';
	
		this.logElement.style.textAlign = "left";
		this.logElement.style.fontFamily = "lucida console";
		this.logElement.style.fontSize = "100%";
		this.logElement.style.backgroundColor = 'darkgray';      
		this.logElement.style.opacity = 0.9;
		this.logElement.style.zIndex = 2000; 
	
		// Add toolbarElement
		this.toolbarElement = this.docReference.createElement('div');
		this.logElement.appendChild(this.toolbarElement);     
		this.toolbarElement.style.padding = "0 0 0 2px";
	
		// Add buttons        
		this.buttonsContainerElement = this.docReference.createElement('span');
		this.toolbarElement.appendChild(this.buttonsContainerElement); 
	
		if(this.inline) {
			var closeButton = this.docReference.createElement('button');
			closeButton.style.cssFloat = "right";
			closeButton.style.styleFloat = "right"; // IE dom bug...doesn't understand cssFloat
			closeButton.style.color = "black";
			closeButton.innerHTML = "close";
			closeButton.onclick = Log4js.bind(this.toggle, this);
			this.buttonsContainerElement.appendChild(closeButton);
		}
		
		var clearButton = this.docReference.createElement('button');
		clearButton.style.cssFloat = "right";
		clearButton.style.styleFloat = "right"; // IE dom bug...doesn't understand cssFloat
		clearButton.style.color = "black";
		clearButton.innerHTML = "clear";
		clearButton.onclick = Log4js.bind(this.logger.clear, this.logger);
		this.buttonsContainerElement.appendChild(clearButton);
	

		//Add CategoryName and  Level Filter
		this.tagFilterContainerElement = this.docReference.createElement('span');
		this.toolbarElement.appendChild(this.tagFilterContainerElement);
		this.tagFilterContainerElement.style.cssFloat = 'left';
		
		this.tagFilterContainerElement.appendChild(this.docReference.createTextNode("Log4js - " + this.logger.category));
		this.tagFilterContainerElement.appendChild(this.docReference.createTextNode(" | Level Filter: "));
		
		this.tagFilterElement = this.docReference.createElement('input');
		this.tagFilterContainerElement.appendChild(this.tagFilterElement);
		this.tagFilterElement.style.width = '200px';                    
		this.tagFilterElement.value = this.tagPattern;    
		this.tagFilterElement.setAttribute('autocomplete', 'off'); // So Firefox doesn't flip out
		
		Log4js.attachEvent(this.tagFilterElement, 'keyup', Log4js.bind(this.updateTags, this));
		Log4js.attachEvent(this.tagFilterElement, 'click', Log4js.bind( function() {this.tagFilterElement.select();}, this));
		
		// Add outputElement
		this.outputElement = this.docReference.createElement('div');
		this.logElement.appendChild(this.outputElement);  
		this.outputElement.style.overflow = "auto";              
		this.outputElement.style.clear = "both";
		this.outputElement.style.height = (this.inline) ? ("200px"):("650px");
		this.outputElement.style.width = "100%";
		this.outputElement.style.backgroundColor = 'black'; 
			  
		this.inputContainerElement = this.docReference.createElement('div');
		this.inputContainerElement.style.width = "100%";
		this.logElement.appendChild(this.inputContainerElement);      
		
		this.inputElement = this.docReference.createElement('input');
		this.inputContainerElement.appendChild(this.inputElement);  
		this.inputElement.style.width = '100%';
		this.inputElement.style.borderWidth = '0px'; // Inputs with 100% width always seem to be too large (I HATE THEM) they only work if the border, margin and padding are 0
		this.inputElement.style.margin = '0px';
		this.inputElement.style.padding = '0px';
		this.inputElement.value = 'Type command here'; 
		this.inputElement.setAttribute('autocomplete', 'off'); // So Firefox doesn't flip out
	
		Log4js.attachEvent(this.inputElement, 'keyup', Log4js.bind(this.handleInput, this));
		Log4js.attachEvent(this.inputElement, 'click', Log4js.bind( function() {this.inputElement.select();}, this));
		
		if(this.inline){
			window.setInterval(Log4js.bind(this.repositionWindow, this), 500);
				this.repositionWindow();	
			// Allow acess key link          
			var accessElement = this.docReference.createElement('button');
			accessElement.style.position = "absolute";
			accessElement.style.top = "-100px";
			accessElement.accessKey = this.accesskey;
			accessElement.onclick = Log4js.bind(this.toggle, this);
			this.docReference.body.appendChild(accessElement);
			
		} else {
			this.show();
		}
	},
	/**
	 * shows/hide an element
	 * @private
	 * @return true if shown
	 */
	toggle : function() {
		if (this.logElement.style.display == 'none') {
		 	this.show();
		 	return true;
		} else {
			this.hide();
			return false;
		}
	}, 
	/**
	 * @private
	 */
	show : function() {
		this.logElement.style.display = '';
	  	this.outputElement.scrollTop = this.outputElement.scrollHeight; // Scroll to bottom when toggled
 	  	this.inputElement.select();
	}, 
	/**
	 * @private
	 */	
	hide : function() {
		this.logElement.style.display = 'none';
	},  
	/**
	 * @private
	 * @param message
	 * @style
	 */	
	output : function(message, style) {

		// If we are at the bottom of the window, then keep scrolling with the output			
		var shouldScroll = (this.outputElement.scrollTop + (2 * this.outputElement.clientHeight)) >= this.outputElement.scrollHeight;
                
		this.outputCount++;
	  	style = (style ? style += ';' : '');	  	
	  	style += 'padding:1px;margin:0 0 5px 0';	     
		  
		if (this.outputCount % 2 === 0) {
			style += ";background-color:#101010";
		}
	  	
	  	message = message || "undefined";
	  	message = message.toString();
                
	  	this.outputElement.innerHTML += "<pre style='" + style + "'>" + message + "</pre>";
                
	  	if (shouldScroll) {				
			this.outputElement.scrollTop = this.outputElement.scrollHeight;
		}
	},
	
	/**
	 * @private
	 */
	updateTags : function() {
		
		var pattern = this.tagFilterElement.value;
	
		if (this.tagPattern == pattern) {
			return;
		}
		
		try {
			new RegExp(pattern);
		} catch (e) {
			return;
		}
		
		this.tagPattern = pattern;

		this.outputElement.innerHTML = "";
		
		// Go through each log entry again
		this.outputCount = 0;
		for (var i = 0; i < this.logger.loggingEvents.length; i++) {
  			this.doAppend(this.logger.loggingEvents[i]);
		}  
	},

	/**
	 * @private
	 */	
	repositionWindow : function() {
		var offset = window.pageYOffset || this.docReference.documentElement.scrollTop || this.docReference.body.scrollTop;
		var pageHeight = self.innerHeight || this.docReference.documentElement.clientHeight || this.docReference.body.clientHeight;
		this.logElement.style.top = (offset + pageHeight - this.logElement.offsetHeight) + "px";
	},

	/**
	 * @param loggingEvent event to be logged
	 * @see Log4js.Appender#doAppend
	 */
	doAppend : function(loggingEvent) {
		
		if(this.popupBlocker) {
			//popup blocked, we return in this case
			return;
		}
		
		if ((!this.inline) && (!this.winReference || this.winReference.closed)) {
			this.initialize();
		}
		
		if (this.tagPattern !== null && 
			loggingEvent.level.toString().search(new RegExp(this.tagPattern, 'igm')) == -1) {
			return;
		}
		
		var style = '';
	  	
		if (loggingEvent.level.toString().search(/ERROR/) != -1) { 
			style += 'color:red';
		} else if (loggingEvent.level.toString().search(/FATAL/) != -1) { 
			style += 'color:red';
		} else if (loggingEvent.level.toString().search(/WARN/) != -1) { 
			style += 'color:orange';
		} else if (loggingEvent.level.toString().search(/DEBUG/) != -1) {
			style += 'color:green';
		} else if (loggingEvent.level.toString().search(/INFO/) != -1) {
			style += 'color:white';
		} else {
			style += 'color:yellow';
		}
		if(!!document&&!!document.body&&!this.initializeflag){
			this.initialize();
		}
		this.output(this.layout.format(loggingEvent), style);
	},

	/**
	 * @see Log4js.Appender#doClear
	 */
	doClear : function() {
		this.outputElement.innerHTML = "";
	},
	/**
	 * @private
	 * @param e
	 */
	handleInput : function(e) {
		if (e.keyCode == 13 ) {      
			var command = this.inputElement.value;
			
			switch(command) {
				case "clear":
					this.logger.clear();  
					break;
					
				default:        
					var consoleOutput = "";
				
					try {
						consoleOutput = eval(this.inputElement.value);
					} catch (e) {  
						this.logger.error("Problem parsing input <" + command + ">" + e.message);
						break;
					}
						
					this.logger.trace(consoleOutput);
					break;
			}        
		
			if (this.inputElement.value !== "" && this.inputElement.value !== this.commandHistory[0]) {
				this.commandHistory.unshift(this.inputElement.value);
			}
		  
			this.commandIndex = 0;
			this.inputElement.value = "";                                                     
		} else if (e.keyCode == 38 && this.commandHistory.length > 0) {
    		this.inputElement.value = this.commandHistory[this.commandIndex];

			if (this.commandIndex < this.commandHistory.length - 1) {
      			this.commandIndex += 1;
      		}
    	} else if (e.keyCode == 40 && this.commandHistory.length > 0) {
    		if (this.commandIndex > 0) {                                      
      			this.commandIndex -= 1;
	    	}                       

			this.inputElement.value = this.commandHistory[this.commandIndex];
	  	} else {
    		this.commandIndex = 0;
    	}
	},

	/**
	 * @private
	 */
	makeWinName: function(category) {
		return category.replace(/[^\d\w]/g, "_");
	},
                
	/** 
	 * toString
	 */
	 toString: function() {
	 	return "Log4js.ConsoleAppender[inline=" + this.inline + "]"; 
	 }
}); 
var log4jsLogger = Log4js.getLogger("Log4js");
log4jsLogger.setLevel(Log4js.Level.INFO);

