const express = require("express");
const { json, urlencoded } = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const { ToDoRoutes, UserRoutes } = require("./routes");
const app = express();
if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());

// disable powered by cookies
app.disable("x-powered-by");

app.use("/api/auth", UserRoutes);
app.use("/api/todo", ToDoRoutes);
 
const PORT = process.env.PORT || 8000;
const mongoDB = process.env.MONGODB_URL;

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose
  .connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err.message));    
