var express = require("express");
var bodyParser = require("body-parser");
// var logger = require("morgan");
var mongoose = require("mongoose");



var axios = require("axios");
var cheerio = require("cheerio");


// var db = require("./models");

var PORT = 3000;

var app = express();


// app.use(logger("dev"));

var articleModel = require("./models/article.js")

var commentModel = require("./models/comment.js")

var exphbs = require("express-handlebars");

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(express.static("public"));

app.engine("handlebars",
exphbs({ 
defaultLayout: "main" }));

app.set("view engine",
"handlebars");


mongoose.connect("mongodb://localhost/timeArticles");

app.get("/scrape", function(req, res) {
 
  axios.get("http://time.com/section/world/").then(function(response) {
   
    var $ = cheerio.load(response.data);

    $(".headline").each(function(i, element) {
     
      var thingToSave = {};
        console.log($(this).children("a").text());
        thingToSave.title = $(this).children("a").text()

        articleModel.create(thingToSave).then(function(dataWeGotBack){
          console.log(dataWeGotBack);
        })

    //   result.title = $(this)
    //     .children("a")
    //     .text();
    //   result.link = $(this)
    //     .children("a")
    //     .attr("href");

     
    //   db.Article.create(result)
    //     .then(function(dbArticle) {
         
    //       console.log(dbArticle);
    //     })
    //     .catch(function(err) {
         
    //       return res.json(err);
    //     });
    });

   
    res.send("Scrape Complete");
  });
});

app.get("/articles", function(req, res) {
 
});


app.get("/home", function(req, res){
  
  // res.render("home")
  articleModel.find({})
    .then(function(articles) {
     
      res.render("home",{
        articles:articles
      })
    
    })
    .catch(function(err) {
    
      res.json(err);
    });
})

app.get("/articles/:id", function(req, res) {
  console.log("we hit the route");
 
  articleModel.findOne({ _id: req.params.id })
   
    .populate("comment")
    .then(function(dbArticle) {
     
      res.json(dbArticle);
      console.log(dbArticle);
    })
    .catch(function(err) {
    console.log(err);
      res.json(err);
    });
});


app.post("/articles/:id", function(req, res) {
  console.log("about to save note");
  // console.log(commentModel);
  console.log(req.body);

  commentModel.create(req.body)
    .then(function(dbNote) {
     console.log("saved");
     console.log(dbNote);
     return articleModel.findOneAndUpdate({ _id: req.params.id }, { $push: { comments: dbNote._id } }, { new: true });
      // return articleModel.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    
    })
    .then(function(dbArticle) {

      res.json(dbArticle);
    })
    .catch(function(err) {
     console.log(err);
      res.json(err);
    });
});


app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
