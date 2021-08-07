const express = require("express");
const { json, urlencoded } = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const { ToDoRoutes, UserRoutes } = require("./routes");

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());

// disable powered by cookies
app.disable("x-powered-by");

app.use("/api/auth", UserRoutes);
app.use("/api/todo", ToDoRoutes);

const PORT = process.env.PORT || 8000;
const mongoDB = "mongodb://127.0.0.1/my_database";
// app.post('/signup', (req,res) => {
//   console.log(req.body)
// })

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose
  .connect('mongodb+srv://Ksathwik03:Ksathwik03@cluster0.xtzux.mongodb.net/todo?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err.message));
