var AV = require('avoscloud-sdk');

var Competition=AV.Object.extend("Competition");
var Game=AV.Object.extend("Game");


function CompetitionController()
{

}
module.exports=CompetitionController;

/*
显示某场赛事的所有赛事列表
include 了teamAId与teamBId，需要告诉酱
要怎么排序？需要问问酱
*/
CompetitionController.competitionList=function(req,res,next){
	//var gameId=req.query.gameId;
	var gameId='55cd4e0240ac645613921817';
	var query=new AV.Query('Competition');
	var game=new Game();
	game.id=gameId;
	query.equalTo('gameId',game);
	query.include('teamBId');
	query.include('teamAId');
	query.find({
		success:function(result){
			console.log(result[0]);

			res.render('',{result:result,code:'200'});
		},
		error:function(error){
			console.log(error);
			res.render('',{result:'',code:'701'});
		
		}
	});

}
/*添加赛事 ，需要考虑：
比赛层级
双方队伍是否存在在该场赛事中
*/
CompetitionController.CompetitionAdd=function(req,res,next){

}

CompetitionController.CompetitionTest=function searchByGame(gameId,callback){
	var gameQuery = new AV.Query(Game);
	gameQuery.get(gameId,{
		success:function(game){
			var teamsRelation = game.relation('teams');
			var teamQuery = teamsRelation.query();
			teamQuery.find({
				success:function(teams){
					//
					return callback(null,teams);
				},
				error:function(error){
					return callback(error);
				}
			})
		},
		error:function(error){
			return callback(error);
		}
	})
}