import { Router } from "express";
import { compare } from "bcryptjs";
import { z } from "zod";

import { schemaValidator } from "../middleware/schemaValidator";
import { loginValidator } from "../validators/loginValidator";
import Users from "../models/UserModel";

const loginRouter = Router();

loginRouter.use(schemaValidator(loginValidator));

loginRouter.post("/", async (req, res, next) => {
  try {
    const { username, password }: z.infer<typeof loginValidator> = req.body;

    const user = await Users.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }

    const doesPasswordMatch = await compare(password, user?.password!);

    if (doesPasswordMatch) {
      const newUser = {
        name: user?.name,
        username: user?.username,
        image: user?.image,
        id: user?._id,
      };
      res
        .status(200)
        .json({ message: "Logged in successfully", user: newUser });
    } else {
      res.status(401).json({ error: "Invalid Credentials" });
    }
  } catch (error) {
    next({ error: "Some error occured. Please try again later!", status: 500 });
  }
});

export { loginRouter };
