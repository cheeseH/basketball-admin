var express = require('express');
var router = express.Router();
var CompetitionController=require('../controller/CompetitionController');

/* 显示赛事列表*/
router.get('/competitionList', CompetitionController.competitionList);

/*添加新的单场赛事,
这里应该是router.post，为了后台测试方便，暂时用了router.get*/ 
router.get('/competitionAdd',CompetitionController.CompetitionAdd);

/*删除某场比赛
这里应该是router.post，为了后台测试方便，暂时用了router.get
*/
router.get('/competitionDelete',CompetitionController.CompetitionDelete);
/*修改某场比赛的信息*/
router.get('/competitionUpdate',CompetitionController.CompetitionUpdate);
module.exports = router;
