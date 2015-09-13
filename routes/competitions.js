var express = require('express');
var router = express.Router();
var CompetitionController=require('../controller/CompetitionController');

/* 显示赛事列表*/
router.get('/competitionList', CompetitionController.competitionList);

module.exports = router;
