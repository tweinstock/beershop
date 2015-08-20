var express = require('express');
var session = require('express-session');
var fs = require('fs');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var app = express();

app.use(express.static(__dirname + '/public')); 

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


app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/main.html');
});

app.use(function(req, res, next) {
    res.header('Content-Type', 'text/html');
    next();
});

app.get('/isLoggedIn', function(req, res){

    if(req.session.loggedin != 'undefined' && req.session.loggedin == 'true'){
      res.end('true');
    }
    res.end('false');
});

app.post('/login', function(req, res){

    var username = req.body.username;
    var password = req.body.password;

    var users = JSON.parse(fs.readFileSync('public/json/users.json','utf8'));
    req.session.loggedin = 'false';
   
    for(var i = 0; i < users.length; ++i){
        if(users[i].username == username && users[i].password == password){
          req.session.regenerate(function(data){
            req.session.username = username;
            req.session.loggedin = 'true';
            res.end(req.session.loggedin);
          });
          break;
        }
    }

});

app.get('/beers', function(req, res){
    beers = fs.readFileSync('public/json/beers.json','utf8');
    res.end(beers);
});

app.get('/beerDetails/:id', function(req, res){
    var beer_id = req.params.id;
    var result = '';

    beers = JSON.parse(fs.readFileSync('public/json/beers.json','utf8'));

    for(var i = 0; i < beers.length; ++i){
      if(beers[i].id == beer_id)
      {
        result = beers[i];
        break;
      }
    }
  
    res.end(JSON.stringify(result));
});

app.put('/addToCart', function(req, res){
   
   var cart = req.body;

   if(req.session.loggedin == 'true'){
      req.session.cart = cart; 
      res.end('true'); 
   }
   res.end('false');

});

app.get('/getCart', function(req, res){

  if(req.session.loggedin == 'true' ){
    res.end(JSON.stringify(req.session.cart));
  }
  res.end(JSON.stringify({})); 
});

app.delete('/deleteCart', function(req, res){
  req.session.cart = {};
  res.end(JSON.stringify(req.session.cart));
});





port = 80;
app.listen(port);
console.log('Listening at http://localhost:' + port)

