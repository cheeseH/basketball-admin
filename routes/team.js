var express = require('express');
var router = express.Router();
var AV = require('../avos.js');
/* GET users listing. */
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var fs = require('fs');
var TeamController = require('../controller/TeamController');
var teamController = TeamController();
router.post('/testImg',multipartMiddleware,function(req,res,next){
	var img = req.files.img_file;
	var path = img.path;
	var file = new AV.File.withURL('cheese.png',path);
	file.save();
	res.render('gameAdd');


});

router.get('/test',function(req,res,next){
	res.render('gameAdd.jade');
})
module.exports = router;
