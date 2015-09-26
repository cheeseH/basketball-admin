var AV = require('avoscloud-sdk');
var Competition = AV.Object.extend("Competition");
var Report = AV.Object.extend("Report");
var Game = AV.Object.extend("Game");
function InformationController(){

}
module.exports = InformationController;

InformationController.statistics = function(req,res,next){
	var competitionId = req.query.competitionId;
	var teamAName = req.query.teamAName;
	var teamBName = req.query.teamBName;
	var gameId = req.query.gameId;
	res.render("statistics",{competitionId:competitionId,teamAName:teamAName,teamBName:teamBName,gameId:gameId});
}

InformationController.editStatistics = function(req,res,next){
	var competitionId = req.body.competitionId;
	var statistics = req.body.statistics;
	console.log(statistics);
	var query = new AV.Query(Competition);
	query.equalTo("objectId",competitionId);
	query.find({
		success:function(competition){
			competition[0].set("statistics",statistics);
			competition[0].save({
				success:function(data){
					res.json({msg:"ok"});
					res.end();
				},
				error:function(object,error){
					res.json({msg:"error"});
					res.end();
				}
			})
			
		},
		error:function(object,error){
			res.json({msg:"error"});
			res.end();
		}
	});
}

InformationController.gameReport = function(req,res,next){
	var gameId = req.query.gameId;
	res.render("reportForGame",{gameId:gameId});
}
InformationController.competitionReport = function(req,res,next){
	var competitionId = req.query.competitionId;
	var teamAName = req.query.teamAName;
	var teamBName = req.query.teamBName;
	var gameId = req.query.gameId;
	res.render("reportForCompetition",{competitionId:competitionId,teamAName:teamAName,teamBName:teamBName,gameId:gameId});
}

InformationController.reportForCompetition = function(req,res,next){
	var competitionId = req.body.competitionId;
	var content = req.body.content;
	var author = req.body.author;
	var title = req.body.title;
	var coverUrl = req.body.coverUrl;
	console.log(coverUrl);
	if(!coverUrl){
		coverUrl = "";
	}
	var report = new Report();
	report.set("title",title);
	report.set("author",author);
	report.set("content",content);
	report.set("coverUrl",coverUrl);
	report.save(null,{
		success:function(data){
			console.log(data);
			var query = new AV.Query(Competition);
			query.equalTo("objectId",competitionId);
			query.find({
				success:function(competition){
					if(competition[0].get("reportId")!=null){
						competition[0].get("reportId").destroy({
							success:function(oldReport){

							},
							error:function(object,error){
								console.log(error);
							}
						})

					}
					competition[0].set("reportId",data);
					competition[0].save({
						success:function(data){
							res.json({msg:"ok"});
							res.end();
						},
						error:function(object,error){
							console.log(error);
							res.json({msg:error});
							res.end();
						}
					});
				},
				error:function(object,error){
					console.log(error);
					res.json({msg:"error"});
					res.end();
				}
			});
		},
		error:function(object,error){
			res.json({msg:"error"});
			res.end();
		}
	})
}

InformationController.reportForGame = function(req,res,next){
	var gameId = req.body.gameId;
	var content = req.body.content;
	var author = req.body.author;
	var title = req.body.title;
	var coverUrl = req.body.coverUrl;
	if(!coverUrl){
		coverUrl = "";
	}
	var report = new Report();
	report.set("title",title);
	report.set("author",author);
	report.set("content",content);
	report.set("coverUrl",coverUrl);
	report.save(null,{
		success:function(data){
			var gameQuery = new AV.Query(Game);
			gameQuery.equalTo("objectId",gameId);
			gameQuery.find({
				success:function(game){
					var relation = game[0].relation("reports");
					relation.add(data);
					game[0].save(null,{
						success:function(data){
							res.json({msg:"ok"});
							res.end();
						},
						error:function(object,error){
							console.log(error);
						}
					})
					
				},
				error:function(object,error){
					console.log(error);
				}
			})
		},
		error:function(object,error){
			console.log(error);
		}
	})
}