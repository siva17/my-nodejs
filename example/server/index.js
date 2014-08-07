var myNode = require('my-nodejs');
global.my = global.MY = myNode;

// Import Handlers
var auth = require('./services/auth');
var home = require('./services/home');

myNode.addClientPath(__dirname, '../www');

myNode.addListOfServices([{
    type: "get",
    url : '/test',
    cb  : function(request, response){response.send({"test":"Test"});}
},{
    type: "get",
    url : MY.config.baseUrl+'/login/username/:username/password/:password',
    cb  : auth.login
},{
    type: "get",
    url : MY.config.baseUrl+'/signup/username/:username/password/:password/firstname/:firstname',
    cb  : auth.signup
},{
    type: "get",
    url : MY.config.baseUrl+'/home/location/:listLocation',
    cb  : home.list
},{
    type: "get",
    url : MY.config.baseUrl+'/listing/listingId/:listingId',
    cb  : home.listDetails
},{
    type: "get",
    url : MY.config.baseUrl+'/search/keyword/:keyword',
    cb  : home.search
}]);

MY.logInfo("Config:"+JSON.stringify(MY.config));

myNode.startServer();
