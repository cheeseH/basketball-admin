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
	var type = "report";
	imageUtil.upLoad(req,res,'fileData',type,function(err,url){
		if(err){
			console.log(err);
			var msg = {};
			msg.success = false;
			msg = JSON.stringify(msg);
			res.send(msg);
		}
		else{
			var msg = {};
			msg.success = true;
			msg.file_path=url;
			msg = JSON.stringify(msg);
			console.log(msg);
			res.send(msg);
		}
	});
});
router.post("/coverUpload",multipartMiddleware,function(req,res,next){
	var type = "report";
	imageUtil.upLoad(req,res,"cover",type,function(err,url){
		if(err){
			console.log(err);
			var msg = {};
			msg.success = false;
			msg = JSON.stringify(msg);
			res.json(msg);
		}
		else{
			InformationController.uploadCover(req,res,url,next);
		}
	});
});
router.get('/reportList',util.checkLogin);
router.get("/reportList",function(req,res,next){
	InformationController.reportList(req,res,next);
})
router.get('/reportUpdate',util.checkLogin);
router.get('/reportUpdate',function(req,res,next){
	InformationController.reportUpdate(req,res,next);
})

router.get('/reportDelete',util.checkLogin);
router.get('/reportDelete',function(req,res,next){
	InformationController.reportDelete(req,res,next);
})
module.exports = router;