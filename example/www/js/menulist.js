// Manual Config (optional) -> Begin
var baseUrl = "";
// Manual Config (optional) -> End

/*
 * type     : 0 or 1 indicatin GET or POST
 * url      : url value (with out baseUrl, i.e http://localhost:8000/)
 * headers  : function or object to put in Headers of POST request
 * data     : function or object to put in body of POST request 
 */
var menuListData = [
    {
        type : 0,
        label: "Signup<br>username = param1<br>password = param2<br>FirstName = param3",
        url  : baseUrl+"signup/",
        preFn: function(url) {
            var un = $('#param1ID').val();
            var pwd = $('#param2ID').val();
            var fn = $('#param3ID').val();
            return url + "username/"+un + "/password/"+pwd + "/firstname/"+fn;
        }
    },{
        type : 0,
        label: "Login<br>username = param1<br>password = param2",
        url  : baseUrl+"login/",
        preFn: function(url) {
            var un = $('#param1ID').val();
            var pwd = $('#param2ID').val();
            return url + "username/"+un + "/password/"+pwd;
        }
    },{
        type : 0,
        label: "Home List<br>location = param1",
        url  : baseUrl+"home/location/",
        preFn: function(url) {return url + $('#param1ID').val();}
    },{
        type : 0,
        label: "List Details<br>listingId = param1",
        url  : baseUrl+"listing/listingId/",
        preFn: function(url) {return url + $('#param1ID').val();}
    },{
        type : 0,
        label: "Search<br>keyword = param1",
        url  : baseUrl+"search/keyword/",
        preFn: function(url) {return url + $('#param1ID').val();}
    }
];
