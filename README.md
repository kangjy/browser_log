# browser_log
浏览器下的日志库，方便记录日志和扩展像,像log4j管理后台一样管理前台日志
## 介绍 ##

Log4js是在研究nodejs的日志框架log4js-node的过程中，萌发了增加浏览器适配，由于gitbub上该log4js库不能直接在浏览器中使用。因此自己结合源码并针对我们目前的需求做了部分改进。

主要解决我们目前前端记录日志不规范和日志记录后无法方便的控制日志的显示.该前端日志框架使用和java后台的log4j很相似，开发人员很容易上手,兼容ie6+和其他主流浏览器
## Log4js架构 ##
Log4j系统的三大板块：日志写入器、日志输出终端、日志输出格式。
![架构图](http://kangjy.cn/blog_img/class.png)
## Log4js使用入门 ##
### 日志框架引入 ###
1. 首先将log4js.js放到您的前端工程目录内
2. 在head内部引入log4js.js，如下所示
3. <script type="text/javascript" src="../log4js.js"></script> src为你放置js的相对路径。
4. 示例模板

	    <html lang="en">
    		<head>
    		<meta charset="UTF-8">
    		<title>Document</title>
    		<script type="text/javascript" src="../log4js.js"></script>
    		</head>
    		<body>
    		</body>
    	</html>
### 初始化日志记录器 ###
Log4js提供了一个初始化日志记录器的方法，需传入类别，以便在日志中区分是哪儿输出的日志，Category建议是js文件名或者业务编码,方便后续通过类别维度来控制日志输出。

	var firstLogger = new Log4js.getLogger("myfirstlog");
### 配置日志记录器级别 ###
在日志记录器上调用setLevel方法来设置日志记录级别，从而控制不同日志级别的输出。具体代码如下

	firstLogger .setLevel(Log4js.Level.ERROR);
Log4js.Level是一个枚举类型，以及对应输出的日志级别 
![Level](http://kangjy.cn/blog_img/level.png)
### 定义日志输出器 ###
Log4js中默认实现了浏览器控台的日志输出器，在ie8下不支持控制台的使用自定义的div样式实现了控制台输出的功能。使用代码结构如下

	var append=new Log4js.BrowserAppender();// 创建一个日志输出器
	firstLogger.addAppender(append);//将日志输出去添加到日志记录器中
### 定义日志输出格式 ###
Log4js中默认实现了BasicLayout日志格式，格式如下categoryName~startTime [logLevel] message\n，使用代码结构如下：

	var layout=new Log4js.BasicLayout();//定义一个日志输出格式
	append.setLayout(layout);//将日志格式添加到日志输出去中，控制日志输出格式
### 输出对应的日志 ###
日志级别定义，和对应的应用场景，**建议前端开发人员安装此规范执行**：
![Level](http://kangjy.cn/blog_img/setlevel.png)

具体实现代码如下：
	
	firstLogger.trace("trace me")
	firstLogger.debug("debug me")
	firstLogger.info("info me")
	firstLogger.warn('warn me');
	firstLogger.error("error me" );
### 最终完整代码示例 ###

	<script type="text/javascript">
		var firstLogger = new Log4js.getLogger("myfirstlog");
		firstLogger.setLevel(Log4js.Level.ALL);
		var append = new Log4js.BrowserAppender();// 创建一个日志输出器
		var imgappend = new Log4js.SendImgAppender();// 创建一个大点日志输出去
		firstLogger.addAppender(append);
		firstLogger.addAppender(imgappend);
		var layout = new Log4js.BasicLayout();//定义一个日志输出格式
		append.setLayout(layout);
		var plainLayout = new Log4js.PlainJSONLayout();
		imgappend.setLayout(plainLayout);
		firstLogger.trace("trace me")
		firstLogger.debug("debug me")
		firstLogger.info("info me")
		firstLogger.warn('warn me');
		firstLogger.error("error me");
	</script>
执行结果：
![Level](http://kangjy.cn/blog_img/allrun.png)
## Log4js推荐配置 ##
### 替换原生的console ###
直接继承到log4js，设置方法如下Log4js.replaceConsole(); 运行示例：
![replace](http://kangjy.cn/blog_img/replace.png)
### 采集前端数据场景 ###
配置打点日志输出器配置方法如下，在head中引入下面两个文件：

1. appenders/sendimg.js发送服务器数据

2. layouts/ plainjson.js,用标准的json格式输出打点日志

示例代码

	<script type="text/javascript">
		var firstLogger = new Log4js.getLogger("myfirstlog");
		firstLogger.setLevel(Log4js.Level.ALL);
		var append = new Log4js.BrowserAppender();// 创建一个日志输出器
		var imgappend = new Log4js.SendImgAppender();// 创建一个大点日志输出去
		firstLogger.addAppender(append);
		firstLogger.addAppender(imgappend);
		var layout = new Log4js.BasicLayout();//定义一个日志输出格式
		append.setLayout(layout);
		var plainLayout = new Log4js.PlainJSONLayout();
		imgappend.setLayout(plainLayout);
		firstLogger.trace("trace me")
		firstLogger.debug("debug me")
		firstLogger.info("info me")
		firstLogger.warn('warn me');
		firstLogger.error("error me");
	</script>
运行结果如下，可以清楚的看到打点日志通过img图片发送到服务端
![imgsendresult](http://kangjy.cn/blog_img/imgsendresult.png)
### 兼容低版本ie浏览器 ###
在低版本ie浏览器一下无控制台的情况下，框架可以直接模拟一个控制台，并展示日志信息，在低版本ie下调试非常方便，如下
![iejianrong](http://kangjy.cn/blog_img/iejianrong.png)
### 线上系统配置 ###
线上系统在上线后所有日志记录器的Level的级别均设置成WARN级别。减少控制台的输出.
同时重写console的日志输出去，也统一由log4js来管理。




