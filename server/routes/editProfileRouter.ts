import { Router } from "express";
import { schemaValidator } from "../middleware/schemaValidator";
import { editProfileValidator } from "../validators/editProfileValidator";
import { z } from "zod";
import Users from "../models/UserModel";
import mongoose, { Model } from "mongoose";

const editProfileRouter = Router();

type User = mongoose.Document & {
  name: string;
  username: string;
  password: string;
  image: string;
};

editProfileRouter.use(schemaValidator(editProfileValidator));

editProfileRouter.post("/", async (req, res, next) => {
  try {
    const { type, value, id }: z.infer<typeof editProfileValidator> = req.body;

    let user: User | null = {} as never;
    if (type === "name") {
      user = await Users.findByIdAndUpdate(
        { _id: id },
        { name: value },
        { new: true }
      );
    } else if (type === "username") {
      user = await Users.findByIdAndUpdate(
        { _id: id },
        { username: value },
        { new: true }
      );
    }

    const newUser = {
      name: user?.name,
      username: user?.username,
      image: user?.image,
      id: user?._id,
    };

    res
      .status(200)
      .json({ message: "Profile updated successfully", user: newUser });
  } catch (error) {
    next({ error: "Some error occured. Please try again later!", status: 500 });
  }
});

export { editProfileRouter };
