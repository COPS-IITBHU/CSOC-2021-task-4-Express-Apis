const express = require("express");
const { json, urlencoded } = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const { ToDoRoutes, UserRoutes } = require("./routes");
const BackendError = require("./utils/BackendError");

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());

// disable powered by cookies
app.disable("x-powered-by");

app.use("/api/auth", UserRoutes);
app.use("/api/todo", ToDoRoutes);
app.use("*", (req, res, next) => {
  next(new BackendError(404, "No such endpoint exists"));
});
app.use((err, req, res, next) => {
  const { message = "An error occurred", statusCode = 500 } = err;
  if (typeof message === "string")
    return res.status(statusCode).send({ message });
  res.status(statusCode).send({ ...message });
});

const PORT = process.env.PORT || 8000;
const mongoDB = process.env.DB_URL || "mongodb://127.0.0.1/my_database";

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
