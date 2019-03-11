const X = require('express');
const APP = X();
const PORT = 2105;
// const PORT2 = 9999;
// const CORS = require('cors');
// const bodyParser = require('body-parser'); // needed?
// const path = require('path');
// const code = require('code.js');

// const HTTP = require('http');
// HTTP.createServer((req, res) => {
//   res.writeHead(200, {'Content-Type': 'text/html'});
//   res.end('Hello Class!');
// }).listen(PORT);

APP.use('/project1', X.static(__dirname + '/_SITE_/'));
APP.use('/project2', X.static(__dirname + '/_P2_/'));

APP.listen(PORT, () => {
  	console.log(`\r\nNODE ::: I started my back end server on port ${PORT}.\r\n`);
  });

// APP.all('/', CORS(), (req, res) => {
//   let t = Date();
//   res.send(
//     `${t} ::: checking for signs of life from version ${meta.model}`
//   );
// })
//
// APP.get('/generic/:arg', CORS(), (req, res) => {
//   res.send(
//     {antwoord:`you sent ${arg} as argument`}
//   );
// })

let output;
const mysql = require('mysql');
 let con = mysql.createConnection({
 	host: "localhost",
 	user: "root",
 	password: "mysql",
 	database: "grade_rating"
 });
 con.connect(function (err) {
 	if (err) throw err;
 	con.query("select stu_voornaam, stu_naam, vak_naam, fou_minpunten from studenten s inner join stu_vak_fou stf on s.stu_id = stf.fk_stu_id inner join fouten f on stf.fk_fou_id = f.fou_id inner join vakken v on stf.fk_vak_id = v.vak_id group by stu_voornaam, stu_naam, vak_naam order by stu_naam;",  (err, result, fields) =>{
 		if (err) {throw err;}
        output = JSON.stringify(result);
        console.log(output);
 	});
 });

//APP.get('/index', (req,res) => {res.send(output)});
// APP.get('/vakken', (req,res) => {res.send(["HTML","CSS"])});
// APP.get('/fouten', (req,res) => {res.send(["Hoofdletter vergeten","; vergeten"])});

// let database  =  {
// 	"jan":{beroep:"dakwerker",hobby:"diepzeeknikkeren"},
// 	"piet":{beroep:"zeebonk",hobby:"langeafstandschminken"}
// };

// APP.options('/', CORS()) // enable pre-flight request // TODO: security -> curtail allowed origins
// APP.use(bodyParser.json());

// app.all('*', function(req, res, next) {
// 	console.log("entering cors");
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   next();
// });


// const WebSocket = require('ws');
//
// const ws = new WebSocket.Server({ port: 2345 });
//
// ws.on('connection', function connection(ws) {
//     ws.on('message', function incoming(message) {
//         console.log('received: %s', message);
//     });
//     ws.send('something');
// });
