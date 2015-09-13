var express = require('express');
var router = express.Router();
var AV = require('../avos');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/testRelation',function(req,res,next){
	var  query = new AV.Query('Game');
	query.get('55cd4e0240ac645613921817',{
		success:function(game){
			var relation = game.relation('teams');
			console.log(relation);
		
			var teamQuery = relation.query();
			teamQuery.find({
				success:function(teams){
					res.render('gameAdd');
				},
				error:function(error){

				}
			})
		},
		error:function(error){

		}
	})
})

module.exports = router;
