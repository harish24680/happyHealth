const db = require('../../database');
const moment = require('moment');

let currentDate = moment(new Date()).format('L').toString();

// exports.getUserProgress = (req, res) => {
// 	let userId = req.session.userId;
// 	const stetpQuery = `Select sum(stepCount) as stepCount, sum(stepGoal) as stepGoal, sum(sleepHours) as sleepHours, sum(sleepGoal) as sleepGoal,  sum(meTime) as meTime, sum(meTimeGoal) as meGoal, sum(water) as water, sum(waterGoal) as waterGoal, sum(fruits) as fruits, sum(fruitGoal) as fruitGoal, sum(veggies) as veggies, sum(veggieGoal) as veggieGoal, sum(physicalActivityMinutes) as physical, sum(physicalActivityGoal) as physicalGoal from happyhealth.usermetricstbl where UserId = ${userId};`;
// 	db.query(stetpQuery, function (err, result) {
// 		if (err) {
// 			console.log(err);
// 		} else {
// 			let u = result[0];
// 			let stats = {
// 				step: Math.round((u.stepCount / u.stepGoal) * 100 * 10) / 10,
// 				sleep: Math.round((u.sleepHours / u.sleepGoal) * 100 * 10) / 10,
// 				meTime: Math.round((u.meTime / u.meGoal) * 100 * 10) / 10,
// 				water: Math.round((u.water / u.waterGoal) * 100 * 10) / 10,
// 				fruits: Math.round((u.fruits / u.fruitGoal) * 100 * 10) / 10,
// 				veggies: Math.round((u.veggies / u.veggieGoal) * 100 * 10) / 10,
// 				physical: Math.round((u.physical / u.physicalGoal) * 100 * 10) / 10,
// 			};

// 			console.log(stats, '===========> step stat');

// 			console.log(result, '--------db user table result');
// 			res.render('userViews/userProgress', {
// 				layout: 'layouts/userLayout',
// 				title: 'User Personal Progress',
// 				result,
// 				stats,
// 			});
// 		}
// 	});
// };


exports.getTodayProgress = (req, res) => {
    const userId = req.session.userId;

    const metricQuery = `Select * from happyhealth.usermetricstbl where UserId = ${userId} and date = '${currentDate}';`;
    db.query(metricQuery, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result, '--------db userMetrics table result');
            res.render('userViews/userProgress', {
                layout: 'layouts/userLayout',
                title: 'User Progress',
                result
            });
        }

    });
};

exports.getProgress = (req, res) => {


    console.log(req.query.datepicker1);
    console.log(req.query.datepicker2);
    const user = req.session.userId;

    const startDate = req.query.datepicker1;
    const endDate = req.query.datepicker2;

    console.log("startdate: ", startDate);
    console.log("enddate: ", endDate);
    console.log("userId: ", user);
    //console.log(req);
    const metricSum =
        `SELECT 
    SUM( happyhealth.usermetricstbl.stepCount) as total,
    SUM( happyhealth.usermetricstbl.sleepHours) as totalSleep,
    SUM( happyhealth.usermetricstbl.meTime) as totalMe,
    SUM( happyhealth.usermetricstbl.fruits) as totalFruits,
    SUM( happyhealth.usermetricstbl.veggies) as totalVeggies,
    SUM( happyhealth.usermetricstbl.water) as totalWater
    from 
    happyhealth.usermetricstbl
    where
    (happyhealth.usermetricstbl.userId = ${user}
    AND
    STR_TO_DATE(usermetricstbl.date, "%m/%d/%Y")
    BETWEEN
    '${startDate}' AND '${endDate}');`;


    db.query(metricSum, function (err, result) {
        if (err) {
            throw err;
        } else {
            console.log("****metric sum result**** ", result);
            res.render('userViews/userProgressDate', {
                layout: 'layouts/userLayout',
                title: 'Custom Progress',
                result,
                startDate,
                endDate
            });
        }
    });
};