import { Router } from "express";
import Users from "../models/UserModel";
import Chats from "../models/ChatModel";
import { Types } from "mongoose";

const getAllUsersRouter = Router();

type Users = {
  name: string;
  image: string;
  message: string | undefined;
  username: string;
  _id: Types.ObjectId;
};

getAllUsersRouter.get("/", async (req, res, next) => {
  try {
    const users = await Users.find();

    res.status(200).json({ users });
  } catch (error) {
    return next({
      error: "Some error occured. Please try again later!",
      status: 500,
    });
  }
});

getAllUsersRouter.post("/", async (req, res, next) => {
  try {
    const { id } = req.body;

    const users = await Users.find({ _id: { $ne: id } });

    let newUsers: Users[] = [];

    for (let i = 0; i < users.length; i++) {
      const chat = await Chats.findOne({
        $or: [
          { sentBy: id, sentTo: users[i]._id },
          { sentBy: users[i]._id, sentTo: id },
        ],
      }).sort({
        sentAt: "desc",
      });
      const newUser = {
        name: users[i].name,
        _id: users[i]._id,
        image: users[i].image,
        username: users[i].username,
        message: chat?.message,
      };

      newUsers.push(newUser);
    }

    res.status(200).json({ users: newUsers });
  } catch (error) {
    return next({
      error: "Some error occured. Please try again later!",
      status: 500,
    });
  }
});

export { getAllUsersRouter };
