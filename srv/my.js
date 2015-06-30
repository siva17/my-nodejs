var mySrvHost = "http://localhost";
var mySrvPort = 8000;

var MY_LOGMODE_NONE     = 0,
    MY_LOGMODE_ERROR    = 0x01,
    MY_LOGMODE_WARN     = 0x02,
    MY_LOGMODE_IMP_DATA = 0x04,
    MY_LOGMODE_INFO     = 0x08,
    MY_LOGMODE_VERBOSE  = 0x10;
var myLogLevel          = MY_LOGMODE_ERROR | MY_LOGMODE_WARN | MY_LOGMODE_IMP_DATA;

var myTimeDelaySecs_01    = 0;
var myTimeDelaySecs_05    = 0;
var myTimeDelaySecs_10    = 0;
var myTimeDelaySecs_12    = 0;
var myTimeDelaySecs_15    = 0;
var myTimeDelaySecs_18    = 0;
var myTimeDelaySecs_20    = 0;
var myTimeDelaySecs_25    = 0;
var myTimeDelaySecs_30    = 0;
var myTimeDelaySecs_40    = 0;
var myTimeDelaySecs_50    = 0;
var myTimeDelayMins_01_00 = 0;
var myTimeDelayMins_01_30 = 0;
var myTimeDelayMins_02_00 = 0;

// Import required modules
var myExpress    = require('express'),
    mySys        = require('sys'),
    myPath       = require('path'),
    myBodyParser = require('body-parser'),
    winston      = require('winston'),
    myOpen       = require('open'),
    myHTTP       = require('http');

var myUserCmds   = {};
var myConfig     = {};
var myLogger     = {};

function myLogVerbose(msg)      { if(myLogLevel & MY_LOGMODE_VERBOSE)    myLogger.verbose(msg);}
function myLogInfo(msg)         { if(myLogLevel & MY_LOGMODE_INFO)       myLogger.info(msg);}
function myLogImpData(msg)      { if(myLogLevel & MY_LOGMODE_IMP_DATA)   myLogger.data(msg);}
function myLogWarn(msg)         { if(myLogLevel & MY_LOGMODE_WARN)       myLogger.warn(msg);}
function myLogError(msg)        { if(myLogLevel & MY_LOGMODE_ERROR)      myLogger.error(msg);}
function myLogException(e,msg)  { if(myLogLevel & MY_LOGMODE_ERROR)      myLogger.error(msg+"| Exception:"+e);}

function mySetLogLevel(logLevel) {
    if(logLevel) {
        try {
            logLevel = parseInt(logLevel);
            var maxLogMode = MY_LOGMODE_ERROR | MY_LOGMODE_WARN | MY_LOGMODE_INFO | MY_LOGMODE_VERBOSE;
            if(!((logLevel >= 0) && (logLevel <= maxLogMode))) logLevel = myLogLevel;
        } catch(e) {
            logLevel = myLogLevel;
        }
        myLogLevel = logLevel;
    }
    if(myLogLevel & MY_LOGMODE_VERBOSE) myLogImpData("LOGMODE: VERBOSE IS ENABLED");
    if(myLogLevel & MY_LOGMODE_INFO) myLogImpData("LOGMODE: INFO IS ENABLED");
    if(myLogLevel & MY_LOGMODE_WARN) myLogImpData("LOGMODE: WARN IS ENABLED");
    if(myLogLevel & MY_LOGMODE_ERROR) myLogImpData("LOGMODE: ERROR AND EXCEPTION ARE ENABLED");
}

function updateAppMode(mode) {
    var fastMode = ((mode === "slow")?(false):(true));
    myLogImpData("APP MODE: "+((fastMode)?("Fast"):("Slow")));
    if(fastMode) {
        myTimeDelaySecs_01    = 0;
        myTimeDelaySecs_05    = 0;
        myTimeDelaySecs_10    = 0;
        myTimeDelaySecs_12    = 0;
        myTimeDelaySecs_15    = 0;
        myTimeDelaySecs_18    = 0;
        myTimeDelaySecs_20    = 0;
        myTimeDelaySecs_25    = 0;
        myTimeDelaySecs_30    = 0;
        myTimeDelaySecs_40    = 0;
        myTimeDelaySecs_50    = 0;
        myTimeDelayMins_01_00 = 0;
        myTimeDelayMins_01_30 = 0;
        myTimeDelayMins_02_00 = 0;
    } else {
        myTimeDelayNoDelay    = 0;
        myTimeDelaySecs_01    = 1000;
        myTimeDelaySecs_05    = 5000;
        myTimeDelaySecs_10    = 10000;
        myTimeDelaySecs_12    = 12000;
        myTimeDelaySecs_15    = 15000;
        myTimeDelaySecs_18    = 18000;
        myTimeDelaySecs_20    = 20000;
        myTimeDelaySecs_25    = 25000;
        myTimeDelaySecs_30    = 30000;
        myTimeDelaySecs_40    = 40000;
        myTimeDelaySecs_50    = 50000;
        myTimeDelayMins_01_00 = 60000;
        myTimeDelayMins_01_30 = 90000;
        myTimeDelayMins_02_00 = 120000;
    }
}

function preInit() {
    process.argv.forEach(function(value,index,array){
        if(index > 1) {
            var cmd = value.toLowerCase().split('=');
            myUserCmds[cmd[0]] = cmd[1] || '';
        } else if(index == 1) {
            var pathValue = value.lastIndexOf('\\');
            if(pathValue == -1) {
                pathValue = value.lastIndexOf('/');
            }
            myUserCmds["serverPath"] = value.substr(0,pathValue+1);
        }
    });

    try {
        myConfig = require(myUserCmds["serverPath"] + 'config.js');
    } catch(e) {
        myConfig = {};
        console.error("ERROR: NO CONFIG FILE FOUND: SHOULD PRESENT at "+myUserCmds["serverPath"]+"config.js");
    }

    mySrvHost = myUserCmds["host"] || myConfig.serverHost || mySrvHost;
    mySrvPort = myUserCmds["port"] || myConfig.serverPort || mySrvPort;

    var logFileName = "debug.log";
    var logExceptionFileName = "exceptions.log";
    if(myConfig.log) {
        myLogLevel   = myConfig.log.level || myLogLevel;
        logFileName = myConfig.log.fileName || logFileName;
        logExceptionFileName = myConfig.log.exceptionFileName || logExceptionFileName;
    }
    myLogger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)({
                colorize    : true,
                timestamp   : true
            }),
            new (winston.transports.File)({
                filename    : logFileName,
                colorize    : true,
                timestamp   : true,
                json        : true,
            }),
        ],
        exceptionHandlers: [
          new winston.transports.File({
            filename        : logExceptionFileName,
            colorize        : true,
            timestamp       : true,
            json            : true,
            handleExceptions: true
          })
        ],
        levels : {
            silly   : 0,
            verbose : 1,
            info    : 2,
            data    : 3,
            warn    : 4,
            debug   : 5,
            error   : 6,
        },
        colors : {
            silly   : 'magenta',
            verbose : 'cyan',
            info    : 'green',
            data    : 'grey',
            warn    : 'yellow',
            debug   : 'blue',
            error   : 'red'
        }
    });

    updateAppMode(myUserCmds["appmode"] || myConfig.appMode || "fast");
    mySetLogLevel(myUserCmds["loglevel"] || myLogLevel);
}

preInit();

var myApp = myExpress();
myApp.use(myExpress.static( myPath.join(__dirname, '../') )); // Indiciating and that can use lot js/css/images and other folders inside MY module
myApp.use(myBodyParser());

function myAddClientPath(basePath) {
    var clientPath = myUserCmds["app"] || myConfig.www || '../www';
    myApp.use(myExpress.static(myPath.join(basePath,clientPath)));
}
function myAddListOfServices(listOfServices) {
    var listOfServicesLen = listOfServices.length;
    for (var i = 0; i < listOfServicesLen; i++) {
        serviceItem = listOfServices[i];
        if(typeof serviceItem.type != "string") {
            var typeList = serviceItem.type.length;
            for(var j = 0; j < typeList; j++) {
                myApp[serviceItem.type[j]](serviceItem.url, serviceItem.cb);
            };
        } else {
            myApp[serviceItem.type](serviceItem.url, serviceItem.cb);
        }
    }
}
function myStartServer() {
    myApp.listen(mySrvPort);
    myLogImpData("SERVICES ARE LISTENING ON PORT: "+mySrvPort);
    var urlToOpen = mySrvHost+":"+mySrvPort+"/";
    myLogImpData("OPENING URL: "+urlToOpen);
    if(myConfig.openUrl) {
        myOpen(urlToOpen);
    }
}

function myGetFileName(filePath, fileName, callback, param1) {
    if(typeof callback === "function") {
        var defaultFileName = myUserCmds["serverPath"] + filePath + fileName;
        if((param1) && (typeof param1 === "string")) {
            var fullFileName    = myUserCmds["serverPath"] + filePath + param1 + "/" + fileName;
            myLogVerbose("REQUESTED FILENAME: "+ fullFileName);
            myPath.exists(fullFileName, function(exists) {
                var retFileName = ((exists)?(fullFileName):(defaultFileName));
                myLogVerbose("RETURNED FILENAME: "+ retFileName);
                callback(retFileName);
            });
        } else {
            myLogVerbose("RETURNED FILENAME: "+ defaultFileName);
            callback(defaultFileName);
        }
    }
}

function mySendFile(response, filePath, fileName, delay, param1) {
    myGetFileName(filePath, fileName, function(outFileName) {
        setTimeout(function(){response[((typeof param1 === "boolean")?("jsonp"):("send"))]((outFileName)?(require(outFileName)):(null));},delay);
    }, param1);
}

function mySendData(response, data, delay, param1) {
    setTimeout(function(){response[((typeof param1 === "boolean")?("jsonp"):("send"))](data);},delay);
}

function getScripts (data) {
    var scripts = [];
    data.replace(/<script[^>]*>((.|\r|\n)*?)<\/script>/gim, function (a,b) {
        scripts.push(b);
    });
    return scripts.join('\n');
};

function myGetFileFromUrl(response,url) {
    var req = myHTTP.get(url, function(res) {
        var dataFromSerer = "";
        res.setEncoding('utf8');
        res.on('data', function(data) {
            dataFromSerer += data;
        });
        res.on('end', function() {
            response.write(getScripts(dataFromSerer));
            response.end();
        });
    }).on('error', function(e) {
        response.send({statue:false,data:"Error"});
    });
    req.end();
}

myApp.use(function(req,res,next) {
    myLogInfo("GOT["+req.method+"]: "+req.url);
    if(myConfig.CORS) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        myLogInfo("CORS ENABLED");
    } else if(myConfig.delayEveryRequest) {
        setTimeout(function(){
            next();
        },myConfig.delayEveryRequest);
	return;
    }
    next();
});

var myNode = {          
	app                 : myApp,
    express             : myExpress,
    sys                 : mySys,
    path                : myPath,
    bodyParser          : myBodyParser,

    userCommads         : myUserCmds,
    srvPort             : mySrvPort,
    config              : myConfig,
    
    logVerbose          : myLogVerbose,
    logInfo             : myLogInfo,
    logImpData          : myLogImpData,
    logWarn             : myLogWarn,
    logError            : myLogError,
    logException        : myLogException,

    addClientPath       : myAddClientPath,
    addListOfServices   : myAddListOfServices,
    startServer         : myStartServer,
    sendFile            : mySendFile,
    sendData            : mySendData,
    getFileFromUrl      : myGetFileFromUrl,

    timeDelaySecs_01    :   myTimeDelaySecs_01,
    timeDelaySecs_05    :   myTimeDelaySecs_05,
    timeDelaySecs_10    :   myTimeDelaySecs_10,
    timeDelaySecs_12    :   myTimeDelaySecs_12,
    timeDelaySecs_15    :   myTimeDelaySecs_15,
    timeDelaySecs_18    :   myTimeDelaySecs_18,
    timeDelaySecs_20    :   myTimeDelaySecs_20,
    timeDelaySecs_25    :   myTimeDelaySecs_25,
    timeDelaySecs_30    :   myTimeDelaySecs_30,
    timeDelaySecs_40    :   myTimeDelaySecs_40,
    timeDelaySecs_50    :   myTimeDelaySecs_50,
    timeDelayMins_01_00 :   myTimeDelayMins_01_00,
    timeDelayMins_01_30 :   myTimeDelayMins_01_30,
    timeDelayMins_02_00 :   myTimeDelayMins_02_00,
};

module.exports = myNode;
