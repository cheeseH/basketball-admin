var AV = require('avoscloud-sdk');

var Game=AV.Object.extend("Game");
var Campus=AV.Object.extend("Campus");

var Competition=AV.Object.extend("Competition");
var CompetitionShare=AV.Object.extend("CompetitionShare");
var Team=AV.Object.extend("Team");
var Score=AV.Object.extend("Score");
var GameFollow=AV.Object.extend("GameFollow");
var Comment=AV.Object.extend("Comment");
var CommentLike=AV.Object.extend("CommentLike");
var Report=AV.Object.extend("Report");

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
			results.save(null,{
				success:function(data){
					res.redirect('/games/gameList');
				},
				error:function(data,error){
					console.log(error);
					res.render("error");
				}
			});
			
		},
		error:function(error){
			console.log("fail to get game");
		}
	});
}
/*编辑赛事。润狗，留着给你了*/

GameController.gameBaseUpdate=function(req,res,next){
	var gameId=req.query.gameId;
	var query=new AV.Query('Game');
	query.get(gameId,{
		success:function(game){
		
			var name = req.body.name;
			console.log(req.body);
			var college = req.body.college;
			var awardLimit = parseInt(req.body.awardLimit);
			game.set('college',college);
			game.set('name',name);
			game.set('awardLimit',awardLimit);
			game.save(null,{
				success:function(game){
					//
					res.redirect('/games/gameDetail?gameId='+gameId)
				},
				error:function(game,error){
					console.log(error);
				}
			})

		},
		error:function(error){
			console.log('fail to get gameUpdate');
		}
	});
}

GameController.gameImageUpdate=function(req,res,next){
	var gameId = req.query.gameId;
	var query = new AV.Query('Game');
	query.get(gameId,{
		success:function(game){
			imageUtil.upLoad(req,res,'coverUrl',function(err,url){

				var logoUrl = url;
				game.set('coverUrl',logoUrl);
				game.save(null,{
					success:function(game){
						res.redirect('/games/gameDetail?gameId='+gameId)
					},
					error:function(game,error){
						console.log(error);
					}
				})
			})
		},
		error:function(err){
			next(err);
		}
	})
}

GameController.gameAdd = function(req,res,next){
	var college = req.body.college;
	var name = req.body.name;
	var awardLimit = parseInt(req.body.awardLimit);
	var coverUrl ;
	var campusId = req.session.user.campusId;
	var campus = new Campus();
	campus.id = campusId;
	imageUtil.upLoad(req,res,'coverUrl',function(err,url){
		if(err){

		}
		else{
			coverUrl = url;
			var game = new 	Game();
			game.set('college',college);
			game.set('name',name);
			game.set('coverUrl',coverUrl);
			game.set('campusId',campus);
			game.set('awardLimit',awardLimit);
			game.set('award',0);
			game.set('follows',0);
			game.save(null,{
				success:function(game){
					//
					res.redirect('/games/gameList');
				},
				error:function(game,error){
					console.log(error);
				}
			})
		}
	})


}
/*需以POST传入gameId*/
GameController.gameDelete=function(req,res,next){
	var gameId= req.query.gameId;
	var game=new Game();
	game.id=gameId;
	var queryGameFollow=new AV.Query(GameFollow);
	queryGameFollow.equalTo('gameId',game);
	queryGameFollow.destroyAll({
		success:function(){
			console.log('success to delete all gameFollow');
			var queryCompetition=new AV.Query(Competition);
			queryCompetition.equalTo('gameId',game);
			queryCompetition.find({
				success:function(CompetitionData)
				{
					console.log('success to get the Competitions');
					for(var i=0;i<CompetitionData.length;i++)
					{
						var competitionId=CompetitionData[i].id;
						var competition=new Competition();
						competition.id=competitionId;
						var commentQuery=new AV.Query(Comment);
						commentQuery.equalTo('competitionId',competition);			//删除所有评价与点赞
						commentQuery.find({
							success:function(commentData)
							{
								console.log('success to find the comment');
								console.log(commentData.length);
								for(var j=0;j<commentData.length;j++)
								{
									var comment=new Comment();
									comment.id=commentData[j].id;
									var commentLikeQuery=new AV.Query(CommentLike);
									commentLikeQuery.equalTo('commentId',comment);
									commentLikeQuery.destroyAll({
										success:function(){
											console.log('success to delete the commentLikes');
											comment.destroy({
												success:function(commentResult){
													console.log('success to delete the comment');
												},
												error:function(error)
												{
													console.log(error);
												}
											});
										},
										error:function(error){
											console.log('fail to delete the commentLikes');

										}
									});
									
								}
							},
							error:function(error)
							{
								console.log('fail to get comments');
								res.send(error);
							}
						});

						
						competitionShareQuery=new AV.Query(CompetitionShare);				//删除所有分享
						competitionShareQuery.equalTo('competitionId',competition);
						competitionShareQuery.destroyAll({
							success:function(){
								console.log('success to delete comprtitionShare');
							},
							error:function(error){
								console.log('fail to delete competitionShare');
							}
						});


						/*删除所有比分与战报*/
						if(CompetitionData[i].get('reportId')!=null)
						{
							console.log(CompetitionData[i].get('reportId').id);
							var report=new Report();
							report.id=CompetitionData[i].get('reportId').id;
							report.destroy({
								success:function(results){
									console.log('success to delete the report');
								},
								error:function(error){
									console.log('fail to delete the report');
								}
							});
						}
						if(CompetitionData[i].get('scoreId')!=null)
						{
							console.log(CompetitionData[i].get('scoreId'));
							var score=new Score();
							score.id=CompetitionData[i].get('scoreId').id;
							score.destroy({
								success:function(results){
									console.log('success to delete the score');
								},
								error:function(error){
									console.log('fail to delete the score');
								}
							});
						}
						
						competition.destroy({
							success:function(results){
								console.log('success to delete the competition');
							},
							error:function(error){
								console.log('fail to delete the competition');
							}
						});


					}
					game.destroy({
						success:function(results){
							console.log('success to delete the game');
						},
						error:function(error){
							console.log('fail to delete the game');
						}
					});	

					
				},
				error:function(error)
				{
					console.log('fail to get the Competition');
					res.send(error);
				}
			});
			res.redirect('/games/gameList');
		},
		error:function(error){
			console.log('fail to delete gameFollow');
			res.send(error);
		}
	});

}