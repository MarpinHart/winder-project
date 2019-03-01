const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const savedWineSchema = new Schema(
  {
    _wine: {
      type: Schema.Types.ObjectId,
      ref: "Wine",
      required: true
    },
    _user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const SavedWine = mongoose.model("SavedWine", savedWineSchema);
module.exports = SavedWine;
