var express = require('express');
var router = express.Router();

var AV = require('avoscloud-sdk');
var Admin=AV.Object.extend("Admin");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/testRelation',function(req,res,next){
	var  query = new AV.Query('Game');
	query.get('55cd4e0240ac645613921817',{
		success:function(game){
			var relation = game.relation('teams');
			console.log(relation);
		
			var teamQuery = relation.query();
			teamQuery.find({
				success:function(teams){
					res.render('gameAdd');
				},
				error:function(error){

				}
			})
		},
		error:function(error){

		}
	})
})

/*登录页面*/
router.get('/login',function(req,res,next){
	res.render('login',{code:'200'});
});
/*处理登录页面的信息*/
router.post('/login',function(req,res,next){
	var query=new AV.Query(Admin);
	query.equalTo("username",req.body.username);
	query.equalTo("password",req.body.password);
	query.find({
		success:function(results){
			if(results.length>0)
			{
				console.log('success');
				//console.log(results);
				var campus=results[0].get('campusId');
				campus.fetch({
				  success: function(data) {
				    	req.session.user={
				    		username:req.body.username,
				    		campusId:data.id,
				    		campusName:data.get('name')
				    	};
				    	console.log(req.session.user);
				    	res.redirect('/games/gameList');
				  }
				});
				
			}
			else
			{
				console.log('password or username error');
				res.render('login',{code:'301'});
			}
		},
		error:function(error){
			console.log('system fail in index.js');
			res.render('login',{code:'401'});
		}
	});
});
/*登出*/
router.post('/logout',function (req,res,next){
	req.session.user=null;
	console.log('delete the session');
	res.redirect('/login');
});
module.exports = router;
