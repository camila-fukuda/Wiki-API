const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//connect to data base
mongoose.connect('mongodb://localhost/wikiDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


app.set('view engine', 'ejs');

//create database model and schema
const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});
const Article = mongoose.model('Article', articleSchema);

//route for ALL ARTICLES
app.route('/articles')
.get(function(req,res){
  Article.find(function(err,foundArticles){
    if(err){
      res.send(err);
    }else{
      res.send(foundArticles);
    }
  });
})
.post(function(req,res){
  const newArticle=new Article({
    title:req.body.title,
    content: req.body.content,
  });
    newArticle.save(function(err){
      if(!err){
        res.send("Successfully added new article.");
      } else{
        res.send(err);
      }
    });
})
.delete( function(req,res){
  Article.deleteMany(function(err){
    if (!err){
      res.send("Successfully deleted all articles.");
    } else{
      res.send(err);
    };
  });
});


//route for especific articles
app.route('/articles/:articleTitle')
.get(function(req,res){
  Article.findOne({title:req.params.articleTitle},function(err, foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    } else{
      res.send("No articles matching that title were found.")
    };
  });
})
.put(function(req,res){
  Article.update(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully updated.");
      }else{
        res.send(err);
      }
    }
  )
})
.patch(function(req,res){
  Article.update(
    {title:req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully patched.");
      }else{
        res.send(err);
      }
    }
  );
})
.delete(function(req,res){
    Article.deleteOne(
      {title: req.params.articleTitle},
      function(err){
        if(!err){
          res.send("Successfully deleted article.");
        }else{
          res.send(err);
        }
      }
    );
});



//listening on port 3000
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
