function getJSONObject(jsonString) {
    try { return jQuery.parseJSON(jsonString); } catch (e) {}
    return null;
}
function getAsObject(inValue) {
    if(inValue) {
        if(typeof inValue === "function") {
            return inValue();
        } else if(typeof inValue === "object") {
            return inValue;
        }
    }
    return null;
}
function getUrlValue(config) {
    var urlValue = config.url;
    if((config.preFn) && (typeof config.preFn === "function")) {
        urlValue = config.preFn(urlValue);
    }
    return urlValue;
}

function recurseProcessJSONData(data) {
    var htmlRetStr = "<ul class='jsonParseNodeCls'>"; 
    for (var key in data) {
        if (typeof(data[key])== 'object' && data[key] != null) {
            htmlRetStr += "<li><span  class='jsonParseKeyCls' >" + key + " : </span>";
            htmlRetStr += recurseProcessJSONData( data[key] );
            htmlRetStr += '</li>';
        } else {
            htmlRetStr += ("<li><span class='jsonParseKeyCls'>" + key + " : </span>&quot;<span class='jsonParseValueCls'>" + data[key] + '</span>&quot;</li>' );
        }
    };
    htmlRetStr += '</ul>';    
    return( htmlRetStr );
}

function processJSONDataAndDisplay(jsonDataObject, config) {
    try {
        var urlValue = ((config.type == 1)?("POST"):("GET")) + ": Response for " + getUrlValue(config);
        var postBody = '';
        if((config.type == 1) && (config.data != "<xmlData></xmlData>")) {
            postBody = '<br>Body: '+ JSON.stringify(config.data);
        }
        $('#jsonParsedTitleID').html(urlValue + postBody);

        if(jsonDataObject) {
            if(typeof jsonDataObject === "object") {
                $('.jsonParsedDataCls').html(recurseProcessJSONData(jsonDataObject));
            } else if(typeof jsonDataObject === "string") {
                if(config.JsonP) {
                    try {
                        $('.jsonParsedDataCls').html(recurseProcessJSONData(eval(jsonDataObject.split(config.JsonP)[2])));
                    } catch(e) {
                        $('.jsonParsedDataCls').text(jsonDataObject);
                    }
                } else {
                    try {
                        var jsonData = JSON.parse(jsonDataObject);
                        if(jsonData) {
                            $('.jsonParsedDataCls').html(recurseProcessJSONData(jsonData));
                        } else {
                            $('.jsonParsedDataCls').text(jsonDataObject);
                        }
                    } catch(e) {
                        $('.jsonParsedDataCls').text(jsonDataObject);
                    }
                }
            }
        } else {
            $('.jsonParsedDataCls').text(jsonDataObject);
        }
        $('.jsonRawDataCls').text(jsonDataObject);
    } catch(e) {
        console.error("processJSONDataAndDisplay: Exception:"+e);       
    }
}

function ajaxRequest(config) {
    if(config) {
        
        var ajaxObject = {
            method      : ((config.type == 1)?("POST"):("GET")),
            contentType : "application/json",
            url         : getUrlValue(config)
        };

        var headers = getAsObject(config.headers);
        if(headers) {
            ajaxObject.headers = headers;
        }
        var data = getAsObject(config.data);
        if(data) {
            data = JSON.stringify(data);
            if(data) {
               ajaxObject.data = data;
            }
        }

        var callBackName = ((config.type == 1)?("done"):("complete"));

        $.ajax(ajaxObject)[callBackName](function(data) {
            data = ((config.type == 1)?(data):(data.responseText));
            ((config.callback)?(config.callback):(processJSONDataAndDisplay))(data,config);
        });
    }
}

$(function() {

    // Creating Menu List
    var menuListEl = $('.menuCls ul');
    menuListEl.append('<li><input id="param1ID" placeholder="param1" style="color:black"/></li>');
    menuListEl.append('<li><input id="param2ID" placeholder="param2" style="color:black"/></li>');
    menuListEl.append('<li><input id="param3ID" placeholder="param3" style="color:black"/></li>');
    for (var i = 0; i < menuListData.length; i++) {
        menuListEl.append('<li>'+menuListData[i].label+'<span>></span></li>');
    };

    // Handling the Menu Click
    $('.menuCls ul li').click(function(e) {
        var bgColor = "#777";
        var highlightEl = $('.menuCls ul li span');
        highlightEl.css({color : bgColor});
        var indexOfItemClicked = $(this).index() - 3; //!!! as first 3 element are Input element
        if((indexOfItemClicked >= 0) && (indexOfItemClicked < menuListData.length)) {
            highlightEl[indexOfItemClicked].style.color = "white"
            ajaxRequest(menuListData[indexOfItemClicked]);
        }
    });
});
