var express = require('express');
var router = express.Router();
var InformationController=require('../controller/InformationController');
var util=require('../util/util.js');

router.get('/statistics',util.checkLogin);
router.get("/statistics",InformationController.statistics)
router.post("/editStatistics",InformationController.editStatistics);

router.get('/report',util.checkLogin);
router.get("/report",function(req,res,next){
	var pos = req.query.pos;
	if(pos=="competition"){
		InformationController.competitionReport(req,res,next);
	}else if(pos="game"){
		InformationController.gameReport(req,res,next);
	}
})
router.post("/editReport",function(req,res,next){
	var pos = req.query.pos;
	if(pos=="competition"){
		InformationController.reportForCompetition(req,res,next);
	}else if(pos=="game"){
		InformationController.reportForGame(req,res,next);
	}
	
});

module.exports = router;