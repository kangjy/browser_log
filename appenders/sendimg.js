
/**
 * SendImgAppender {@link Log4js.LoggingEvent}s asynchron via 
 * <code>img</code> get param to server.<br />
 * The {@link Log4js.LoggingEvent} is POSTed as response content and is 
 * formatted by the accociated layout. Default layout is {@link Log4js.BasicLayout}. 
 * The <code>threshold</code> defines when the logs 
 * should be send to the server. By default every event is sent on its
 * own (threshold=1). If it is set to 10, then the events are send in groups of
 * 10 events.
 *
 * @extends Log4js.Appender 
 * @constructor
 * @param {Log4js.Logger} logger log4js instance this appender is attached to
 * @param {imgurl} img url where appender will param log messages to
 * @author kangjy
 */
Log4js.SendImgAppender = function(imgurl) {


	/**
	 * is still esnding data to server
	 * @type boolean
	 * @private
	 */
	this.isInProgress = false;
	
	/**
	 * @type String
	 * @private
	 */
	this.loggingUrl = imgurl || "/appenders/tag.gif";
	
	/**
	 * @type Integer
	 * @private
	 */
	this.threshold =1;
	
	/**
	 * List of LoggingEvents which should be send after threshold is reached.
	 * @type Map
	 * @private
	 */
	this.loggingEventMap = new Log4js.FifoBuffer();

	/**
	 * @type Log4js.Layout
	 * @private
	 */
	this.layout = new Log4js.BasicLayout();
};
Log4js.SendImgAppender.prototype = Log4js.extend(new Log4js.Appender(), /** @lends Log4js.AjaxAppender# */ {
	/**
	 * sends the logs to the server
	 * @param loggingEvent event to be logged
	 * @see Log4js.Appender#doAppend
	 */
	doAppend: function(loggingEvent) {
		if (this.loggingEventMap.length() <= this.threshold || this.isInProgress === true) {
			this.loggingEventMap.push(loggingEvent);
		}
		
		if(this.loggingEventMap.length() >= this.threshold && this.isInProgress === false) {
			//if threshold is reached send the events and reset current threshold
			this.send();
		}
	},
	
	/** @see Appender#doClear */
	doClear: function() {
		if(this.loggingEventMap.length() > 0) {
			this.send();
		}
	},
	
	/**
	 * Set the threshold when logs have to be send. Default threshold is 1.
	 * @praram {int} threshold new threshold
	 */
	setThreshold: function(threshold) {
		this.threshold = threshold;
	},

	/**
	 * send the request.
	 */
	send: function() {
		if(this.loggingEventMap.length() >0) {
			
			log4jsLogger && log4jsLogger.trace("> AjaxAppender.send");
			
			
			this.isInProgress = true;
			var a = [];
	
			for(var i = 0; i < this.loggingEventMap.length() && i < this.threshold; i++) {
				a.push(this.layout.format(this.loggingEventMap.pull()));
			} 
					
			var content = this.layout.getHeader();	
			content += a.join(this.layout.getSeparator());
			content += this.layout.getFooter();
			
			var appender = this;
			 var img = new Image(1,1);
			  img.onload = img.onerror = img.onabort = function(){
			    this.isInProgress = false;
			    if(appender.loggingEventMap.length() > 0) {
						appender.send();
					}
			    img.onload = img.onerror = img.onabort = null;
			    img = null;
			  };

			  img.src = this.loggingUrl+"?data="+content;
		}
	},
	/**
	 * @see Log4js.Appender#setLayout
	 */
	setLayout: function(layout){
		this.layout=layout;
	},
	
	/** 
	 * toString
	 */
	 toString: function() {
	 	return "Log4js.AjaxAppender[loggingUrl=" + this.loggingUrl + ", threshold=" + this.threshold + "]"; 
	 }
});
