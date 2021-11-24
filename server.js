const express = require("express");
const bodyParser = require("body-parser");

const UsersRoutes = require("./master/users");
const BlogRoutes = require("./master/add-blog");
const commentRoutes = require("./master/comments");
const commentreplayRoutes = require("./master/commentreplay");


var app = express();
app.use(bodyParser.json());

app.use("/api/users", UsersRoutes );
app.use("/api/blogs", BlogRoutes );
app.use("/api/comments", commentRoutes );
app.use("/api/commentsreply", commentreplayRoutes );


app.listen(9000);