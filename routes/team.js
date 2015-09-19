var express = require('express');
var router = express.Router();
var AV = require('../avos.js');
/* GET users listing. */
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var fs = require('fs');
var qiniu = require('qiniu');
var TeamController = require('../controller/TeamController');
var teamController = TeamController();
var imageUtil = require('../util/image');
var util=require('../util/util.js');

router.get('/',function(req,res,next){
    var pos = req.query.pos;
    if(pos == 'game'){
        TeamController.GameIndex(req,res,next);
    }else if(pos == 'campus'){

        TeamController.CampusIndex(req,res,next);
    }
})

router.post('/add',multipartMiddleware,function(req,res,next){
    var pos = req.query.pos;
    if(pos == 'game'){
        TeamController.AddInGame(req,res,next);
    }else if(pos == 'campus'){
        TeamController.AddInCampus(req,res,next);
    }
})
router.get('/info',util.checkLogin);
router.get('/info',TeamController.TeamInfo);

router.post('/update',multipartMiddleware,TeamController.Update);

router.get('/select',util.checkLogin);
router.get('/select',TeamController.Select);

router.get('/pick',util.checkLogin);
router.get('/pick',TeamController.Pick);




module.exports = router;
