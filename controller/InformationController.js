var AV = require('avoscloud-sdk');
var Competition = AV.Object.extend("Competition");
var Report = AV.Object.extend("Report");
var Game = AV.Object.extend("Game");
var ReportComment = AV.Object.extend("ReportComment");
var ReportLike = AV.Object.extend("ReportLike");
var imageUtil = require('../util/image');
function InformationController(){

}
module.exports = InformationController;

InformationController.statistics = function(req,res,next){
	var competitionId = req.query.competitionId;
	var teamAName = req.query.teamAName;
	var teamBName = req.query.teamBName;
	var gameId = req.query.gameId;
	var query = new AV.Query(Competition);
	query.equalTo("objectId",competitionId);
	query.find({
		success:function(competitions){
			res.render("statistics",{competitionId:competitionId,teamAName:teamAName,teamBName:teamBName,gameId:gameId,statistics:competitions[0].get("statistics")});		
		},
		error:function(object,error){
			console.log(error);
		}
	})
}

InformationController.editStatistics = function(req,res,next){
	var competitionId = req.body.competitionId;
	var statistics = req.body.statistics;
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
	var query = new AV.Query(Competition);
	query.include("reportId")
	query.equalTo("objectId",competitionId);
	query.find({
		success:function(competitions){
			var title = "";
			var author = "";
			var content = "";
			var reportId = "";
			var year = "";
			var month = "";
			var day = "";
			if(competitions[0].get("reportId")!=null&&competitions[0].get("reportId")){
				title = competitions[0].get("reportId").get("title");
				author = competitions[0].get("reportId").get("author");
				content = competitions[0].get("reportId").get("content");
				reportId = competitions[0].get("reportId").id;
				var time = new Date(competitions[0].get("reportId").get("time"));
				year = time.getFullYear();
				month = time.getMonth()+1;
				day = time.getDate();
			}
			res.render("reportForCompetition",{competitionId:competitionId,teamAName:teamAName,teamBName:teamBName,gameId:gameId,title:title,author:author,content:content,reportId:reportId,year:year,month:month,day:day});
		},
		error:function(object,error){
			console.log(error);
		}
	})
	
}

InformationController.reportForCompetition = function(req,res,next){
	var competitionId = req.body.competitionId?req.body.competitionId:"";
	var content = req.body.content;
	var author = req.body.author;
	var title = req.body.title;
	var reportId = req.body.reportId;
	var year = req.body.year;
	var month =req.body.month;
	var day = req.body.day;
	year = year.split(" ")[0];
	month = month.split(" ")[0];
	month = month<10?"0"+month:month;
	day = day.split(" ")[0];
	day = day<10?"0"+day:day;
	var time = year+"/"+month+"/"+day;
	time = new Date(time);
	if(!coverUrl){
		coverUrl = "";
	}
	var report = new Report();
	report.set("title",title);
	report.set("author",author);
	report.set("content",content);
	report.set("time",time);
	if(reportId!=""){
		report.set("objectId",reportId);
	}
	report.save(null,{
		success:function(data){
			if(competitionId!=""){
				var query = new AV.Query(Competition);
				query.equalTo("objectId",competitionId);
				query.find({
					success:function(competition){
						competition[0].set("reportId",data);
						competition[0].save({
							success:function(data){
								res.json({msg:"ok",reportId:data.id});
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
			}else{
				res.json({msg:"ok"});
				res.end();
			}
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
	var reportId = req.body.reportId;
	var year = req.body.year;
	var month =req.body.month;
	var day = req.body.day;
	year = year.split(" ")[0];
	month = month.split(" ")[0];
	month = month<10?"0"+month:month;
	day = day.split(" ")[0];
	day = day<10?"0"+day:day;
	var time = year+"/"+month+"/"+day;
	time = new Date(time);
	if(!coverUrl){
		coverUrl = "";
	}
	var report = new Report();
	report.set("title",title);
	report.set("author",author);
	report.set("content",content);
	report.set("time",time);
	if(reportId&&reportId!=""){
		report.set("objectId",reportId);
	}
	report.save(null,{
		success:function(data){
			if(reportId==""||!reportId){
				var gameQuery = new AV.Query(Game);
				gameQuery.equalTo("objectId",gameId);
				gameQuery.find({
					success:function(game){
						var relation = game[0].relation("reports");
						relation.add(data);
						game[0].save(null,{
							success:function(game){
								res.json({msg:"ok",reportId:data.id});
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
			}else{
				res.json({msg:"ok"});
			}
		},
		error:function(object,error){
			console.log(error);
		}
	})
}
InformationController.reportList = function(req,res,next){
	var gameId = req.query.gameId;
	var query = new AV.Query(Game);
	query.equalTo("objectId",gameId);
	query.find({
		success:function(games){
			var relation = games[0].relation("reports");
			var relationQuery = relation.query();
			relationQuery.find({
				success:function(reports){
					for(var i=0;i<reports.length;i++){
						var time = new Date(reports[i].get("time"));
						var year = time.getFullYear();
						var month = time.getMonth()+1;
						var day = time.getDate();
						month = month<10?"0"+month:month;
						day = day<10?"0"+day:day;
						reports[i].createdAt = year+"-"+month+"-"+day;
					}
					res.render("reports",{reports:reports,gameId:gameId});
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
InformationController.reportUpdate = function(req,res,next){
	var gameId = req.query.gameId;
	var reportId = req.query.reportId;
	var query = new AV.Query(Report);
	query.equalTo("objectId",reportId);
	query.find({
		success:function(reports){
			var time = new Date(reports[0].get("time"));
			var year = time.getFullYear();
			var month = time.getMonth()+1;
			var day = time.getDate();
			res.render("reportUpdate",{title:reports[0].get("title"),author:reports[0].get("author"),content:reports[0].get("content"),gameId:gameId,reportId:reportId,year:year,month:month,day:day})
		},
		error:function(object,error){
			console.log(error);
		}
	})
}
InformationController.reportDelete = function(req,res,next){
	var reportId = req.query.reportId;
	var query = new AV.Query(Report);
	query.equalTo("objectId",reportId);
	query.find({
		success:function(reports){
			query = new AV.Query(ReportComment);
			query.equalTo("reportId",reports[0]);
			query.find({
				success:function(reportComments){
					AV.Object.destroyAll(reportComments);
				},
				error:function(object,error){
					console.log(error);
				}
			});
			query = new AV.Query(ReportLike);
			query.equalTo("reportId",reports[0]);
			query.find({
				success:function(reportLikes){
					AV.Object.destroyAll(reportLikes);
				},
				error:function(object,error){
					console.log(error);
				}
			})
			AV.Object.destroyAll(reports);
		},
		error:function(object,error){
			console.log(error);
		}
	})
	res.json({});
	res.end();
}
InformationController.uploadCover = function(req,res,url,next){
	var reportId = req.query.reportId;
	var query = new AV.Query(Report);
	query.equalTo("objectId",reportId);
	query.find({
		success:function(reports){
			reports[0].set("coverUrl",url);
			reports[0].save(null,{
				success:function(report){
					console.log("coverUrl finish");
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
}