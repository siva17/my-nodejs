// Put all Config parameters here under module.exports and access then using require('my-nodejs').config
module.exports = {

	serverHost : "http://localhost",
	serverPort : 8888,

	appMode : "fast", // "fast" or "slow"
	
	delayEveryRequest : 0, // Value in milliseconds

	baseUrl : "",

	www : "../www",

	CORS : false,
	openUrl : true,

	log : {
		/*
		 * MY_LOGMODE_NONE     = 0,
		 * MY_LOGMODE_ERROR    = 0x01,
		 * MY_LOGMODE_WARN     = 0x02,
		 * MY_LOGMODE_IMP_DATA = 0x04,
		 * MY_LOGMODE_INFO     = 0x08,
		 * MY_LOGMODE_VERBOSE  = 0x10;
		 * Can have combination of above values to enable and disable
		 */
		level 				: (0x01 | 0x02 | 0x04 | 0x08),
		fileName 			: 'debug.log',
		exceptionFileName	: 'exceptions.log'
	}
};
