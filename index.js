const express = require("express");
const { json, urlencoded } = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const { ToDoRoutes, UserRoutes } = require("./routes");
const app = express();
if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

var port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());

// disable powered by cookies
app.disable("x-powered-by");

app.get("/",function(req, res){
  res.json({"Details: " :"Use endpoints '/api/auth/login' and '/api/auth/signup' to login,signup and get user profile.\nUse endpoints '/api/todo' to fetch todos and edit todos."})
})

app.use("/api/auth", UserRoutes);
app.use("/api/todo", ToDoRoutes);
const mongoDB = process.env.MONGODB_URL;

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose
  .connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => console.log(err.message));    
