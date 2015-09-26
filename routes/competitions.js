var express = require('express');
var router = express.Router();
var CompetitionController=require('../controller/CompetitionController');
var util=require('../util/util.js');
/* 显示赛事列表*/
router.get('/competitionList',util.checkLogin);
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


router.get('/competitionDetail',util.checkLogin);
router.get('/competitionDetail',CompetitionController.CompetitionDetail);
router.get('/nextLevel',function(req,res,next){
	var gameId = req.query.gameId;
	var level = parseInt(req.query.level)+1;
	res.render('addLevel',{gameId:gameId,level:level})
})
module.exports = router;
