var express = require('express');
var router = express.Router();

var AV = require('avoscloud-sdk');
var Game=AV.Object.extend("Game");
var Campus=AV.Object.extend("Campus");
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var GameController=require('../controller/GameController');

/* 返回赛事列表,根据campusId返回不同校区的赛事 */
router.get('/gameList', GameController.gameList);
/*以get传入gameId，返回某场赛事的详情*/
router.get('/gameDetail',GameController.gamrDetail);
/*以get传入gameId， 结束某场赛事*/
router.get('/gameFinshed',GameController.finishGame);
/*以get传入gameId，修改某场赛事的信息*/
router.get('/gameAdd',function(req,res,next){
	res.render("gameAdd");
})

router.post('/add',multipartMiddleware,GameController.gameAdd);
router.post('/baseUpdate',GameController.gameBaseUpdate);
router.post('/imageUpdate',multipartMiddleware,GameController.gameImageUpdate);

/*传入gameId删除整个赛事*/
router.get('/gameDelete',GameController.gameDelete);

module.exports = router;
