var AV = require('avoscloud-sdk');

var Competition=AV.Object.extend("Competition");
var Game=AV.Object.extend("Game");
var Team=AV.Object.extend("Team");
var Score=AV.Object.extend("Score");
var GameFollow=AV.Object.extend("GameFollow");


function CompetitionController()
{

}
module.exports=CompetitionController;

/*
显示某场赛事的所有赛事列表
include 了teamAId与teamBId，需要告诉酱
要怎么排序？需要问问酱
*/
CompetitionController.competitionList=function(req,res,next){
	//var gameId=req.query.gameId;
	var gameId='55cd4e0240ac645613921817';
	var query=new AV.Query('Competition');
	var game=new Game();

	game.id=gameId;
	query.equalTo('gameId',game);
	query.descending('level');
	query.include('teamBId');
	query.include('teamAId');
	query.include('scoreId');
	query.find({
		success:function(result){
			console.log('success to get competitionList');

			var typeArray=new Array();
			var competitions=new Array();
			var ifHave=0;
			var i=0;var j=0;
			console.log(result.length);

			/*var returnData={
				0:{type:"小组赛",number:0,competitions:{}},
				1:{type:"1/16决赛",number:0,competitions:{}},
				2:{type:"1/8 决赛",number:0,competitions:{}},
				3:{type:"1/4 决赛",number:0,competitions:{}},
				4:{type:"半决赛" ,number:0,competitions:{}},
				5:{type:"总决赛",number:0,competitions:{}}
			};*/

			var returnData={};
			var maxLevel=0;
			var allLevel=new Array();
			var kindsOfLevel=0;
			var ifHaveLevel=0;
			for(i=0;i<result.length;i++)						//获得所有比赛的类型,获得所有比赛的level
			{
				if(maxLevel<result[i].get('level'))
					maxLevel=result[i].get('level');
				if(i==0&&j==0)
				{
					typeArray[j]=result[i].get('type');
					allLevel[kindsOfLevel]=result[i].get('level');
					competitions[j]=new Array();
					j++;
					kindsOfLevel++;

				}
				else
				{
					ifHave=0;
					ifHaveLevel=0;
					for(var k=0;k<typeArray.length;k++)
					{
						if(typeArray[k]==result[i].get('type'))
							ifHave=1;
					}
					for(var k=0;k<allLevel.length;k++)
					{
						if(allLevel[k]==result[i].get('level'))
							ifHaveLevel=1;
					}
					if(ifHave!=1)
					{
						typeArray[j]=result[i].get('type');
						competitions[j]=new Array();
						j++;
					}
					if(ifHaveLevel!=1)
					{
						allLevel[kindsOfLevel]=result[i].get('level');
						kindsOfLevel++;
					}
				}
			}
			
			var lenOfcompetition=new Array();
			for(i=0;i<result.length;i++)
			{
				lenOfcompetition[i]=0;
			}
			for(i=0;i<result.length;i++)
			{
				for(j=0;j<typeArray.length;j++)
				{
					if(result[i].get('type')==typeArray[j])
					{
						competitions[j][lenOfcompetition[j]]=result[i];
						lenOfcompetition[j]++;
					}
				}
			}
			for(var levLen=0;levLen<allLevel.length;levLen++)				//返回数据
			{
				returnData[levLen]={};
				for(i=0;i<competitions.length;i++)
				{
					if(allLevel[allLevel[levLen]]==competitions[i][0].get('level'))
					{
						returnData[levLen][i]={
							type:competitions[i][0].get('type'),
							competitions:competitions[i],
							number:competitions[i].length
							//levelKinds:allLevel.length
						};
					}
				}	
			}
			returnData.maxLevel=maxLevel;
			//res.render('',{result:result,code:'200'});
			console.log(typeArray);
			console.log(allLevel);
			res.send(returnData);

		},
		error:function(error){
			console.log(error);
			res.render('',{result:'',code:'701'});
		
		}
	});

}
/*添加赛事 ，需要考虑：如果需要添加其他属性，可以直接添加
比赛层级
双方队伍是否存在在该场赛事中
是否要给与开始时间
传入的时间必须是时间格式
需以POST方式传入以下数据:
teamAName,teamBName,gameId, gameStatus,level,gameType,beginTime
*/
CompetitionController.CompetitionAdd=function(req,res,next){
	
	/* POST传送变量*/
	/*var teamAName=req.body.teamAName;
	var teamBName=req.body.teamBName;
	var gameId=req.body.gameId;
	var gameStatus=req.body.gameStatus;
	var level=req.body.level;
	var gameType=req.body.gameType;
	var beginTime=req.body.beginTime;
	var awardLimit=req.body.awardLimit;
	var awardMinimum=req.body.awardMinimum;

	*/
	var teamAName='凯尔特人';
	var teamBName='底特律活塞';
	var gameId='55cd4e0240ac645613921817';
	var gameStatus='未开始';
	var level=1;
	var gameType='半决赛 ';
	var beginTime=new Date('2015-08-16 14:59:00');
	var awardLimit=200;
	var awardMinimum=500;

	
	var gameQuery=new AV.Query(Game);
	gameQuery.get(gameId,{
		success:function(gameData){
			var teamsRelation=gameData.relation('teams');
			var teamQuery=teamsRelation.query();
			teamQuery.find({
				success:function(teams){
					var teamAId=110;
					var teamBId=110;
					for (var i = teams.length - 1; i >= 0; i--) {
						if(teams[i].get('name')==teamAName)				//此处应用teamName代替
						{
							teamAId=teams[i].id;
						}
						if(teams[i].get('name')==teamBName)				//此处应用teamName代替
						{
							teamBId=teams[i].id;
						}
					};
					console.log(teamAId);
					console.log(teamBId);
					if(teamAId!=110&&teamBId!=110)							//若两支队伍都存在于这场赛事
					{
						var score=new Score();
						score.set('scoreA',0);
						score.set('scoreB',0);
						score.save(null,{
							success:function(scoreData){
								var teamA=new Team();
								var teamB=new Team();
								teamA.id=teamAId;
								teamB.id=teamBId;

								var thisGame=new Game();
								thisGame.id=gameId;

								var newCompetition=new Competition();
								newCompetition.set('type',gameType);
								newCompetition.set('teamAId',teamA);
								newCompetition.set('teamBId',teamB);
								newCompetition.set('level',level);
								newCompetition.set('status',gameStatus);
								newCompetition.set('gameId',thisGame);
								newCompetition.set('scoreId',scoreData);
								newCompetition.set('beginTime',beginTime);
								newCompetition.set('awardMinimum',awardMinimum);
								newCompetition.set('awardLimit',awardLimit);
								newCompetition.set('award',awardLimit);					//默认奖金池的值是奖金池的下限
								newCompetition.save(null,{
									success:function(result)
									{
										console.log(result);
										res.send('success');
									},
									error:function(error)
									{
										console.log('fail');
										res.send(error);
									}
						});
							},
							error:function(error){
								console.log('score build fail');
								res.send(error);
							}
						});

						
						//res.send(teams);
					}
					else
					{
						console.log('team do not exit in this game');
						res.render('',{});
					}
					
				},
				error:function(error){
					console.log(error);
				}
			});
		},
		error:function(error){
			return callback(error);
		}
	});


}


/*删除单场赛事，需以POST传入competitionId
删除顺序：先删除Score,再删除competition

*/
CompetitionController.CompetitionDelete=function(req,res,next){
	//var competitionId=req.body.competitionId;
	var competitionId='55f53582ddb202577ccabde8';
	var queryCompetition=new AV.Query('Competition');
	//queryCompetition.include('scoreId');										//为什么不include反而能取出数据
	queryCompetition.get(competitionId,{
		success:function(result){
			console.log('success to get Competition');
			var theScore=new Score();
			theScore.id=result.get('scoreId').id;
			theScore.destroy({
				success:function(result){
					console.log('success to delete score');
					var competition=new Competition();
					competition.id=competitionId;
					competition.destroy({
						success:function(competitionResult)
						{
							console.log('success to delete competition');
							res.send(competitionResult);
						},
						error:function(competitionError)
						{
							console.log('fail to delete competition');
							res.send(competitionError);
						}
					});
				},
				error:function(error)
				{
					console.log('fail to delete the score');
					res.send(error);
				}
			});
		},
		error:function(error){
			console.log('fail to get Competition');
			res.send(error);
		}
	});
}


/*删除单场赛事，需以POST传入competitionId
删除顺序：先删除Score,再删除competition

*/
CompetitionController.CompetitionDelete=function(req,res,next){
	//var competitionId=req.body.competitionId;
	var competitionId='55f53582ddb202577ccabde8';
	var queryCompetition=new AV.Query('Competition');
	//queryCompetition.include('scoreId');										//为什么不include反而能取出数据
	queryCompetition.get(competitionId,{
		success:function(result){
			console.log('success to get Competition');
			var theScore=new Score();
			theScore.id=result.get('scoreId').id;
			theScore.destroy({
				success:function(result){
					console.log('success to delete score');
					var competition=new Competition();
					competition.id=competitionId;
					competition.destroy({
						success:function(competitionResult)
						{
							console.log('success to delete competition');
							res.send(competitionResult);
						},
						error:function(competitionError)
						{
							console.log('fail to delete competition');
							res.send(competitionError);
						}
					});
				},
				error:function(error)
				{
					console.log('fail to delete the score');
					res.send(error);
				}
			});
		},
		error:function(error){
			console.log('fail to get Competition');
			res.send(error);
		}
	});
}

/*
需以POST方式，传入,比分需要为int型
gameId，
competitionId,
scoreId,

teamAName,
teamBName,

gameStatus，
level，
gameType，
beginTime
award
awardMinimum
awardLimit
isLived
*/
CompetitionController.CompetitionUpdate=function(req,res,next){
	/* POST传送变量*/
	/*
	var gameId=req.body.gameId;
	var competitionId=req.body.competitionId;
	var scoreId=req.body.scoreId;

	var teamAName=req.body.teamAName;
	var teamBName=req.body.teamBName;

	var gameStatus=req.body.gameStatus;
	var level=req.body.level;
	var gameType=req.body.gameType;
	var beginTime=req.body.beginTime;
	var award=req.body.award;
	var awardLimit=req.body.awardLimit;
	var awardMinimum=req.body.awardMinimum;
	var isLived=req.body.isLived;
	var scoreA=req.body.scoreA;
	var scoreB=req.body.scoreB;
	*/
	var gameId='55cd4e0240ac645613921817';
	var competitionId='55d5713e40ac87cfa8a2ddca';
	var scoreId='55cd83f540ac79db356a9ef2';

	var gameStatus='未开始';
	var level=1;
	var gameType='半决赛 ';
	var beginTime=new Date('2015-08-16 14:59:00');
	var award=20;
	var awardLimit=500;
	var awardMinimum=10;
	var isLived=false;


	var teamAName='凯尔特人';
	var teamBName='底特律活塞';

	var scoreA=121;
	var scoreB=111;

	
	var gameQuery=new AV.Query(Game);
	gameQuery.get(gameId,{
		success:function(gameData){
			var teamsRelation=gameData.relation('teams');
			var teamQuery=teamsRelation.query();
			teamQuery.find({
				success:function(teams){
					var teamAId=110;
					var teamBId=110;
					for (var i = teams.length - 1; i >= 0; i--) {
						if(teams[i].get('name')==teamAName)				//此处应用teamName代替
						{
							teamAId=teams[i].id;
						}
						if(teams[i].get('name')==teamBName)				//此处应用teamName代替
						{
							teamBId=teams[i].id;
						}
					};
					console.log(teamAId);
					console.log(teamBId);
					if(teamAId!=110&&teamBId!=110)							//若两支队伍都存在于这场赛事
					{
						var scoreQuery=new AV.Query(Score);
						scoreQuery.get(scoreId,{
							success:function(score)
							{
								console.log('success into score query');
								score.set('scoreA',scoreA);
								score.set('scoreB',scoreB);						//2015-09-13-20:22
								score.save();
								console.log('success save score');
								var teamA=new Team();
								var teamB=new Team();
								teamA.id=teamAId;
								teamB.id=teamBId;

								var competitionQuery=new AV.Query(Competition);
								competitionQuery.get(competitionId,{
									success:function(competitionData){
										console.log('success to competition');
										competitionData.set('type',gameType);
										competitionData.set('teamAId',teamA);
										competitionData.set('teamBId',teamB);
										competitionData.set('level',level);
										competitionData.set('status',gameStatus);
										competitionData.set('beginTime',beginTime);
										competitionData.set('award',award);
										competitionData.set('awardMinimum',awardMinimum);
										competitionData.set('awardLimit',awardLimit);
										competitionData.set('isLived',isLived);
										competitionData.save();
										res.send('success');
									},
									error:function(error){
										console.log('fail to get competition');
										res.send(error);
									}
								});




							},
							error:function(error){
								console.log('fail to get score update');
								res.send(error);
							}
						});
						
						
						//res.send(teams);
					}
					else
					{
						console.log('team do not exit in this game');
						res.render('',{});
					}
					
				},
				error:function(error){
					console.log(error);
				}
			});
		},
		error:function(error){
			return callback(error);
		}
	});
}
/*单场比赛的详情，以POST方式传入改比赛的ID*/
CompetitionController.CompetitionDetail=function(req,res,next){
	//var competitionId=req.body.competitionId;
	var competitionId='55cd830060b22ed7cb93986c';
	var query=new AV.Query(Competition);
	query.include('teamBId');
	query.include('teamAId');
	query.include('reportId');
	query.include('scoreId');
	query.include('gameId');
	query.get(competitionId,{
		success:function(data)
		{
			console.log('success to get competition detail');
			res.send(data);
		},
		error:function(error)
		{
			console.log('fail to get competitionDetail');
			res.send(error);
		}
	});
}