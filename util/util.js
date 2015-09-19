/*检查是否已登录*/
exports.checkLogin=function(req,res,next){
	if(!req.session.user)
	{
		console.log('not login');
		res.redirect('/login');
	}
	next();
}

/*检查是否未登录*/
exports.checkLogout=function(req,res,next){
	if(req.session.user)
	{
		console.log('aleardy login');
		res.redirect('/games/gameList');
	}
	next();
}