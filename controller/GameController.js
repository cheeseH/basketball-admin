var AV = require('avoscloud-sdk');

var Game=AV.Object.extend("Game");
var Campus=AV.Object.extend("Campus");

var Competition=AV.Object.extend("Competition");
var Team=AV.Object.extend("Team");
var Score=AV.Object.extend("Score");
var Comment=AV.Object.extend("CompetitionComment");
var Report=AV.Object.extend("Report");
var ReportComment = AV.Object.extend("ReportComment");

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
	var gameId=req.query.gameId;
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
					res.redirect("/games/gameList");
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
			var college = req.body.college;
			var stage = req.body.stage;
			game.set('college',college);
			game.set('name',name);
			game.set('stage',stage);
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
				if(url == null){
					return res.redirect('/games/gameDetail?gameId='+gameId);
				}
				game.set('coverUrl',logoUrl);
				game.save(null,{
					success:function(game){
						res.redirect('/games/gameDetail?gameId='+gameId);
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
	var stage = req.body.stage
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
			game.set('stage',stage);
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
	var queryCompetition=new AV.Query(Competition);
	queryCompetition.equalTo('gameId',game);
	queryCompetition.find({
		success:function(CompetitionData)
		{
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
							comment.destroy({
								success:function(commentResult){
									console.log('success to delete the comment');
								},
								error:function(error)
								{
									console.log(error);
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


				var reportLikeQuery = new Query(ReportLike);
				var report = new Report();
				report.id = CompetitionData[i].get('reportId').id
				reportLikeQuery.equalTo("reportId",report);
				reportLikeQuery.find({
					success:function(reportLikes){
						for(var i=0;i<reportLikes.length;i++){
							reportLikes[i].destroy({
								success:function(object){

								},
								error:function(object,error){
									console.log(error);
								}
							})
						}
					},
					error:function(object,error){
						console.log(error);
					}
				})

				/*删除所有战报*/
				if(CompetitionData[i].get('reportId')!=null)
				{
					var reportComment = new ReportComment();
					var report=new Report();
					report.id=CompetitionData[i].get('reportId').id;
					reportComment.reportId = report;
					reportComment.destroyAll({
						success:function(results){
							report.destroy({
								success:function(results){
									console.log('success to delete the report');
								},
								error:function(error){
									console.log('fail to delete the report');
								}
							});
						},
						error:function(object,error){
							consloe.log(error);
						}
					})
					
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
			var relation = game.get("reports");
			relation.query().find({
				success:function(list){
					if(list.length>0){
						for(var i=0;i<list.length;i++){
							var reportLikeQuery = new Query(ReportLike);
							var report = new Report();
							report.id = list[i].id
							reportLikeQuery.equalTo("reportId",report);
							reportLikeQuery.find({
								success:function(reportLikes){
									for(var i=0;i<reportLikes.length;i++){
										reportLikes[i].destroy({
											success:function(object){

											},
											error:function(object,error){
												console.log(error);
											}
										})
									}
								},
								error:function(object,error){
									console.log(error);
								}
							});
							report.destroy({
								success:function(result){

								},
								error:function(objcet,error){
									console.log(error);
								}
							})
						}
					}
				},
				error:function(object,error){
					console.log(error);
				}
			})
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
	res.json({});

}