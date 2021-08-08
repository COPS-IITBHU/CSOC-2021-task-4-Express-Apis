const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      index: true,
    },
    collaboratingTodos: [
      {
        type: Schema.Types.ObjectId,
        ref: "ToDo"
      }
    ]
  },
  { timestamps: true }
);

userSchema.plugin(uniqueValidator);

module.exports = model("User", userSchema);
