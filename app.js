import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Set view engine and middleware
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// In-memory data store
let posts = [];

// Route: Home Page (List all posts)
app.get("/", (req, res) => {
  res.render("home", { posts: posts });
});

// Route: Compose New Post Form
app.get("/compose", (req, res) => {
  res.render("compose");
});

// Route: Handle New Post Submission
app.post("/compose", (req, res) => {
  const newPost = {
    id: Date.now(), // simple unique ID
    title: req.body.title,
    content: req.body.content,
  };
  posts.push(newPost);
  res.redirect("/");
});

// Route: View a Single Post
app.get("/posts/:id", (req, res) => {
  const post = posts.find((p) => p.id == req.params.id);
  if (post) {
    res.render("post", { post: post });
  } else {
    res.status(404).send("Post not found");
  }
});

// Route: Edit Post Form
app.get("/edit/:id", (req, res) => {
  const post = posts.find((p) => p.id == req.params.id);
  if (post) {
    res.render("edit", { post: post });
  } else {
    res.status(404).send("Post not found");
  }
});

// Route: Handle Post Update
app.post("/edit/:id", (req, res) => {
  const post = posts.find((p) => p.id == req.params.id);
  if (post) {
    post.title = req.body.title;
    post.content = req.body.content;
    res.redirect("/");
  } else {
    res.status(404).send("Post not found");
  }
});

// Route: Delete Post
app.post("/delete/:id", (req, res) => {
  posts = posts.filter((p) => p.id != req.params.id);
  res.redirect("/");
});

// Start the server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
