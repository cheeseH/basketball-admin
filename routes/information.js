var express = require('express');
var router = express.Router();
var InformationController=require('../controller/InformationController');
var util=require('../util/util.js');
var imageUtil = require('../util/image.js');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

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
router.post("/imgUpload",multipartMiddleware,function(req,res,next){
	imageUtil.upLoad(req,res,'fileData',function(err,url){
		if(err){
			console.log(err);
		}
		else{
			var msg = "{success:true,file_path:"+url+"}";
			console.log(msg);
			res.json({msg:msg});
			res.end();
		}
	});
});
router.get('/reportList',util.checkLogin);
router.get("/reportList",function(req,res,next){
	InformationController.reportList(req,res,next);
})
module.exports = router;