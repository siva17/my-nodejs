function _list(request, response) {
	my.sendFile(response,'data/home/','list.js',my.timeDelaySecs_05,request.params.listLocation);
}
function _listDetails(request, response) {
	my.sendFile(response,'data/home/','listdetails.js',my.timeDelaySecs_05,"listingId"+request.params.listingId);
}
function _search(request, response) {
	my.sendFile(response,'data/home/','search.js',my.timeDelaySecs_05,request.params.keyword);
}

module.exports = {
	list		: _list,
	listDetails	: _listDetails,
	search 		: _search
}