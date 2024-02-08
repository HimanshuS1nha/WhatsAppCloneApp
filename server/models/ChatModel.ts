import { Schema, model } from "mongoose";

const chatSchema = new Schema({
  message: {
    type: String,
    required: true,
  },
  sentBy: {
    type: String,
    required: true,
  },
  sentTo: {
    type: String,
    required: true,
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
  replyingTo: {
    name: {
      type: String,
    },
    message: {
      type: String,
    },
  },
  isSeen: {
    type: Boolean,
    default: false,
  },
});

const Chats = model("Chats", chatSchema);

export default Chats;
