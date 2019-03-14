const X = require('express');
const APP = X();
const PORT = 2100;
let bodyParser = require('body-parser');
const mysql = require('mysql');
const CORS = require('cors');


APP.use('/project1', X.static(__dirname + '/_TEMP_/'));
// APP.use('/project2', X.static(__dirname + '/_P2_/'));

APP.listen(PORT, () => {
  	console.log(`\r\nNODE ::: I started my back end server on port ${PORT}.\r\n`);
});

let con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "mysql",
	database: "grade_rating"

});

process.on('uncaughtException', function (err) {
    console.log(err);
});


con.connect( (err)=> {
	if (err) throw err;
});

function getDatabase(){
 	
	con.query("select * from studenten",  (err, result, fields) =>{
	if (err) {throw err;}
		outputstudenten = JSON.stringify(result);
	});
	con.query("select * from fouten",  (err, result, fields) =>{
	if (err) {throw err;}
		outputfouten = JSON.stringify(result);
	});
	con.query("select * from vakken",  (err, result, fields) =>{
	if (err) {throw err;}
		outputvakken = JSON.stringify(result);
	});
	con.query("SELECT stu_naam, stu_voornaam, fou_omschrijving, vak_id, vak_naam "+
	"FROM stu_vak_fou "+
	"JOIN studenten s on stu_vak_fou.fk_stu_id = s.stu_id "+
	"JOIN fouten f on stu_vak_fou.fk_fou_id = f.fou_id "+
	"JOIN vakken v on stu_vak_fou.fk_vak_id = v.vak_id" , (err, result, fields) =>{
		if (err) {throw err;}
		outputchecks = JSON.stringify(result);
	})
	con.query("SELECT (100 / sum(fou_minpunten)) AS procent FROM fouten" , (err, result, fields) => {
		if (err) {throw err;}
		outputprocent = JSON.stringify(result);
	});

	APP.get("/students",CORS(), (req,res)=>{res.send([outputstudenten])});
	APP.get("/fouten",CORS(), (req,res)=>{res.send([outputfouten])});
	APP.get("/vakken",CORS(), (req,res)=>{res.send([outputvakken])});
	APP.get("/checks",CORS(), (req,res)=>{res.send([outputchecks])});
	APP.get("/procent", (req,res)=>{res.send([outputprocent])});

}; // end getDatabase

getDatabase();

APP.get("/dataforangular",CORS(), (req,res)=>{res.send(["10","100","1000","10000"])});


 //var urlencodedParser = bodyParser.urlencoded({ extended: false });
 APP.post("/add",CORS(),bodyParser.text(), (req, res) => { 
		let result = JSON.parse(req.body);
		console.dir(result.foutnaam);
			var sql = "INSERT INTO fouten (fou_omschrijving, fou_minpunten) VALUES ( '" + result.foutnaam + "', '" + result.minpunten + "')";
			console.log(sql);
			con.query(sql, function (err, result) {
				if (err) {
					res.end("Deze foutnaam bestaat al!");
					// throw err;
				}
				else{
					let test = JSON.stringify(result);
					console.dir("1 record inserted" + test);
					getDatabase();
					res.end();
				}
			})
		
	
}); // end add col

//var urlencodedParser = bodyParser.urlencoded({ extended: true });
APP.post("/rem",CORS(), bodyParser.text(), (req, res) => { 
	let result = JSON.parse(req.body);
	console.dir(result.foutCol);
	var sql = "DELETE FROM fouten WHERE fou_omschrijving = '"+ result.foutCol +"'";
	console.log(sql);
	con.query(sql, function (err, result) {
		if (err) {
			res.end("Verwijder eerst alle vinkjes uit deze kolom. En dat voor alle vakken.");
		} else{
				let test = JSON.stringify(result);
				console.dir("1 record deleted" + test);
				getDatabase();
				res.end();
			}
});
		
	
}); // end rem col

APP.post("/checks",urlencodedParser, (req, res)=>{
	// let input = JSON.stringify(res.body);
	for (x in req.body){
		let parsed = JSON.parse(x);
		let checked = parsed.checked;
		let name = parsed.name;
		let vak = parsed.vak;
		let fullname = name.split("-");
		let fname = fullname[0];
		let lname = fullname[1];
		let fout = parsed.val;
		console.log(checked);
		if (checked == "true"){
			let sql = "INSERT INTO stu_vak_fou (fk_stu_id, fk_vak_id, fk_fou_id)"+
			" VALUES ((SELECT stu_id FROM studenten WHERE stu_voornaam ='"+ fname +"' AND stu_naam ='"+ lname +"'),"+
				""+ vak + "," +
				" (SELECT fou_id FROM fouten WHERE fou_omschrijving ='"+ fout +"'))";
				console.log(sql);
			con.query(sql, function (err, result) {
				if (err){
					res.end("Selecteer een vak.");
				} 
				else{
				let test = JSON.stringify(result);
				console.dir(test);
				getDatabase();
				res.end();
				}
			});
		};
		if (checked == "false"){
			let sql = "DELETE FROM stu_vak_fou "+ 
			"WHERE fk_stu_id = (SELECT stu_id FROM studenten WHERE stu_voornaam = '"+ fname +"' AND stu_naam = '"+ lname +"') "+
			"AND fk_fou_id = (SELECT fou_id FROM fouten WHERE fou_omschrijving = '"+ fout +"') "+
			"AND fk_vak_id = "+vak;
			con.query(sql, function (err, result) {
				if (err) throw err;
				else{
				let test = JSON.stringify(result);
				console.dir(test);
				getDatabase();
				res.end();
				}
			});
		};
		

	}
	// console.log(req.body);
	res.end();

	
}); // end checkbox functie

//APP.use(bodyParser.json()); // parse application json
//APP.use(bodyParser.urlencoded({extended: true}));
APP.post("/score",urlencodedParser, (req, res)=>{
	for (x in req.body){
		let parsed = JSON.parse(x);
		let sql = "SELECT stu_voornaam, stu_naam, sum(fou_minpunten) AS minpunten "+
		"FROM stu_vak_fou "+
		"JOIN studenten s on stu_vak_fou.fk_stu_id = s.stu_id "+
		"JOIN fouten f on stu_vak_fou.fk_fou_id = f.fou_id "+
		"WHERE fk_vak_id = "+ parsed.vak + " "+
		"GROUP BY stu_naam";
		console.log(sql);
		con.query(sql, function (err, result) {
			if (err) throw err;
			else{
			let test = JSON.stringify(result);
			getDatabase();
			res.end(test);
			}
		});
	}
}); // end request score