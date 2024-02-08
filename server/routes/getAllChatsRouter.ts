import { Router } from "express";
import Chats from "../models/ChatModel";

const getAllChatsRouter = Router();

getAllChatsRouter.post("/", async (req, res, next) => {
  try {
    const { id, chatId } = req.body;

    const messages = await Chats.find({
      $or: [
        { sentBy: chatId, sentTo: id },
        { sentBy: id, sentTo: chatId },
      ],
    }).sort({
      sentAt: "desc",
    });

    res.status(200).json({ messages });
  } catch (error) {
    return next({
      error: "Some error occured. Please try again later!",
      status: 500,
    });
  }
});

export { getAllChatsRouter };
