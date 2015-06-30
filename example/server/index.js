var myNode = require('my-nodejs');

// Import Handlers
var auth = require('./services/auth');
var home = require('./services/home');

function getProfile(req,res) {
    var srvUrl = req.param("req");
    srvUrl = ((srvUrl)?(srvUrl):("http://localhost:9000/index.html"))
    myNode.getFileFromUrl(res,srvUrl);
}

myNode.addClientPath(__dirname);

myNode.addListOfServices([{
    type: "get",
    url : myNode.config.baseUrl+'/test',
    cb  : function(request, response){response.send({"test":"Test"});}
},{
    type: ["get","post"],
    url : myNode.config.baseUrl+'/getProfile',
    cb  : getProfile
},{
    type: "get",
    url : myNode.config.baseUrl+'/login/username/:username/password/:password',
    cb  : auth.login
},{
    type: "get",
    url : myNode.config.baseUrl+'/signup/username/:username/password/:password/firstname/:firstname',
    cb  : auth.signup
},{
    type: "get",
    url : myNode.config.baseUrl+'/home/location/:listLocation',
    cb  : home.list
},{
    type: "get",
    url : myNode.config.baseUrl+'/listing/listingId/:listingId',
    cb  : home.listDetails
},{
    type: "get",
    url : myNode.config.baseUrl+'/search/keyword/:keyword',
    cb  : home.search
}]);

myNode.logInfo("Config:"+JSON.stringify(myNode.config));

myNode.startServer();
