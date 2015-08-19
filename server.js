var express = require('express');
var session = require('express-session');
var fs = require('fs');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var fs = require('fs');
var app = express();



app.use(cookieParser());
app.use(session(
    {secret: 'i am a beer and i hate it',
    resave: true,
    saveUninitialized: true,
    cookie : { secure : false }
  }
));

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/login', function(req, res){

    var username = req.body.username;
    var password = req.body.password;

    var users = JSON.parse(fs.readFileSync('json/users.json','utf8'));
    req.session.loggedin = 'false';
   
    for(var i = 0; i < users.length; ++i){
        if(users[i].username == username && users[i].password == password){
          req.session.username = username;
          req.session.loggedin = 'true';
          break;
        }
    }
   //response
    //console.log(req.session.loggedin);
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(req.session.loggedin);

});

app.get('/beers', function(req, res){
    beers = fs.readFileSync('json/beers.json','utf8');
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(beers);
});

app.get('/beerDetails/:id', function(req, res){
    var beer_id = req.params.id;
    var result = '';

    beers = JSON.parse(fs.readFileSync('json/beers.json','utf8'));

    for(var i = 0; i < beers.length; ++i){
      if(beers[i].id == beer_id)
      {
        result = beers[i];
        break;
      }
    }
  
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(JSON.stringify(result));


});



port = 8080;
app.listen(port);
console.log('Listening at http://localhost:' + port)

