var express = require('express');
var router = express.Router();
var CompetitionController=require('../controller/CompetitionController');

/* 显示赛事列表*/
router.get('/competitionList', CompetitionController.competitionList);

/*添加新的单场赛事,
这里应该是router.post，为了后台测试方便，暂时用了router.get*/ 
router.post('/competitionAdd',CompetitionController.CompetitionAdd);

/*删除某场比赛
这里应该是router.post，为了后台测试方便，暂时用了router.get
*/
router.get('/competitionDelete',CompetitionController.CompetitionDelete);
/*修改某场比赛的信息*/
router.post('/competitionUpdate',CompetitionController.CompetitionUpdate);
router.get("/statistics",function(req,res,next){
	var competitionId = req.query.competitionId;
	var teamAName = req.query.teamAName;
	var teamBName = req.query.teamBName;
	res.render("statistics",{competitionId:competitionId,teamAName:teamAName,teamBName:teamBName});
});
router.post("/editStatistics",function(req,res,next){
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
});
router.get("/report",function(req,res,next){
	var competitionId = req.query.competitionId;
	var teamAName = req.query.teamAName;
	var teamBName = req.query.teamBName;
	res.render("report",{competitionId:competitionId,teamAName:teamAName,teamBName:teamBName});
})
router.post("/editReport",function(req,res,next){
	var competitionId = req.body.competitionId;
	var content = req.body.content;
	var author = req.body.author;
	var title = req.body.title;
	var coverUrl = req.body.coverUrl;
	var report = new Report();
	report.set("title",title);
	report.set("author",author);
	report.set("content",content);
	report.set("coverUrl",coverUrl);
	report.save(null,{
		success:function(data){
			var query = new AV.Query(Competition);
			query.equalTo("objectId",competitionId);
			query.find({
				success:function(competition){
					competition[0].set("reportId",data);
					competition[0].save({
						success:function(data){
							res.json({msg:"ok"});
							res.end();
						},
						error:function(object,error){
							res.jspn({msg:error});
							res.end();
						}
					});
				},
				error:function(object,error){
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
});
router.get('/competitionDetail',CompetitionController.CompetitionDetail);
router.get('/nextLevel',function(req,res,next){
	var gameId = req.query.gameId;
	var level = parseInt(req.query.level)+1;
	res.render('addLevel',{gameId:gameId,level:level})
})
module.exports = router;
