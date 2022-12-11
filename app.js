//jshint esversion:6

const express = require("express");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');
require('dotenv').config()

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hello, my name is Sadko Djozo.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
//const posts = [];

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//mongoose.connect('mongodb://localhost:27017/blogDB', { useNewUrlParser: true });
mongoose.connect(process.env.ATLAS_URL)


const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);


app.get('/', function (req, res) {

  Post.find({}, function (err, posts) {
    if (!err) {
      res.render("home", { home: homeStartingContent, posts: posts });
    } else {
      console.log(err);
    }
  });

});

app.get('/about', function (req, res) {
  res.render('about', { about: aboutContent });

});

app.get('/contact', function (req, res) {
  res.render('contact', { contact: contactContent });

});

app.get('/compose', function (req, res) {

  res.render('compose');

});

app.get('/posts/:postId', function (req, res) {

  const requestedPostId = req.params.postId;

  Post.findOne({ _id: requestedPostId }, function (err, docs) {
    if (!err) {
      res.render('post', { title: docs.title, content: docs.content, postId:requestedPostId });
    }else{
      console.log(err);
    }


  });

  // posts.forEach(function (post) {
  //   if (_.kebabCase(post.title) === reqParam) {

  //     res.render('post', 
  //     {
  //       title: post.title,
  //       content: post.content
  //     });
  //   };
  // });

});

app.post('/compose', function (req, res) {

  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function (err) {
    if (!err) {
      res.redirect('/');
    }
  });
});

app.post('/delete', function (req,res){
 const postId = req.body.deletePost;
 console.log(postId);

 Post.findByIdAndRemove(postId, function (err, post) {
  if (err) {
    console.log(err);
  } else {
    res.redirect('/');
    console.log("Succesfully deleted " + post.title);
  }
});

});



app.listen(3000, function () {
  console.log("Server started on port 3000");
});
