var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get("/login",function(req,res,next){
	res.render("login");
})
router.get("/game",function(req,res,next){
	res.render('game');
})
router.get('/gameInfo',function(req,res,next){
	res.render('gameInfo');
})
router.get('/gameAdd',function(req,res,next){
	res.render('gameAdd');
})
router.get('/team',function(req,res,next){
	res.render('team');
})
router.get('/gameProcess',function(req,res,next){
	res.render('game-process');
})
router.get("/teamAdd",function(req,res,next){
	res.render('teamAdd');
})
router.get("/allTeam",function(req,res,next){
	res.render("allTeam");
})
router.get("/newTeamAdd",function(req,res,next){
	res.render("newTeamAdd");
})
router.get("/oldTeamAdd",function(req,res,next){
	res.render("oldTeamAdd");
})
router.get("/competitionInfo",function(req,res,next){
	res.render("competitionInfo");
})
router.get("/allCompetition",function(req,res,next){
	res.render("allCompetition");
})
router.get("/report",function(req,res,next){
	res.render("report");
})
router.get("/statistics",function(req,res,next){
	res.render("statistics");
})
module.exports = router;
