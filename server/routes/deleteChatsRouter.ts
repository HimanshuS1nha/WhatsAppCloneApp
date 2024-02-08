import { Router } from "express";
import Chats from "../models/ChatModel";
import { z } from "zod";
import { deleteChatsValidator } from "../validators/deleteChatsValidator";
import { schemaValidator } from "../middleware/schemaValidator";

const deleteChatsRouter = Router();

deleteChatsRouter.use(schemaValidator(deleteChatsValidator));

deleteChatsRouter.post("/", async (req, res, next) => {
  try {
    const { id, messages }: z.infer<typeof deleteChatsValidator> = req.body;

    messages.map(async (message) => {
      if (message.sentBy === id) {
        await Chats.deleteOne({ _id: message._id });
      }
    });
    res.status(200).json({ message: "Chats deleted successfully!" });
  } catch (error) {
    next({ error: "Some error occured. Please try again later!", status: 500 });
  }
});

export { deleteChatsRouter };
