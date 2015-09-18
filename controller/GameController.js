var AV = require('avoscloud-sdk');

var Game=AV.Object.extend("Game");
var Campus=AV.Object.extend("Campus");
var imageUtil = require('../util/image');
function GameController(){

}
module.exports=GameController;
/* 返回赛事列表,根据campusId返回不同校区的赛事 */
GameController.gameList=function(req, res, next) {
	var query=new AV.Query(Game);
	var campus=new Campus();
	campus.id=req.session.user.campusId;
	query.equalTo('campusId',campus);
	query.ascending('isFinished');
	
	query.find({
	  	success: function(results) {
	    //res.send(results);
	    res.render('game',{gameList:results,code:'200'});
	  },
	  error: function(error) {
	    res.render('error',{results:'',code:'701'});
	  }
	});
}
/*根据传过来的gameId来查询获得该场赛事的信息*/
GameController.gamrDetail=function(req,res,next){
	if(req.query.gameId==''||req.query.gameId==null)
	{	}
	else
		req.session.gameId=req.query.gameId;
	var gameId=req.session.gameId;
	// var gameId='55cd4e0240ac645613921817';
	var query=new AV.Query(Game);
	query.get(gameId,{
		success:function(results){
			res.render('gameInfo',{gameInfo:results,gameId:gameId,code:'200'});
		},
		error:function(error){
			res.render('error',{data:'',code:'701'});
		}	
	});
}
/* 结束某场赛事*/
GameController.finishGame=function(req,res,next){
	var gameId=req.query.gameId;
	//var gameId='55cd4e0240ac645613921817';
	var query=new AV.Query('Game');
	query.get(gameId,{
		success:function(results){
			results.set('isFinished',true);
			results.save();
			res.redirect('/');
		},
		error:function(error){
			console.log("fail to get game");
		}
	});
}
/*编辑赛事。润狗，留着给你了*/
GameController.gameUpdate=function(req,res,next){
	var gameId=req.query.gameId;
	var query=new AV.Query('Game');
	query.get(gameId,{
		success:function(game){
			imageUtil.upLoad(req,res,'imageFile',function(err,url){
				var name = req.body.name;
				var coverUrl = url;
				var college = req.body.college;
				game.set('college',college);
				game.set('name',name);
				game.set('coverUrl',coverUrl);
				game.save(null,{
					success:function(game){
						//
						res.send("success");
					},
					error:function(game,error){

					}
				})
			})
		},
		error:function(error){
			console.log('fail to get gameUpdate');
		}
	});
}

GameController.gameAdd = function(req,res,next){
	var college = req.body.college;
	var name = req.body.name;
	var coverUrl ;
	imageUtil.upLoad(req,res,'imageFile',function(err,url){
		if(err){

		}
		else{
			coverUrl = url;
			var game = new 	Game();
			game.set('college',college);
			game.set('name',name);
			game.set('coverUrl',coverUrl);
			game.save(null,{
				success:function(game){
					//
					res.send("success");
				},
				error:function(game,error){

				}
			})
		}
	})


}