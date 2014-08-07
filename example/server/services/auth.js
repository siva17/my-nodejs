function _login(request, response) {
	my.sendFile(response,'data/login/','login.js',my.timeDelaySecs_05,request.params.username);
}

function _signup(request, response) {
	my.sendFile(response,'data/signup/','signup.js',my.timeDelaySecs_05,request.params.username);
}

module.exports = {
	login	: _login,
	signup	: _signup
}