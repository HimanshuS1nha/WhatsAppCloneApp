import { Router } from "express";
import { z } from "zod";
import { hash } from "bcryptjs";

import { signupValidator } from "../validators/signupValidator";
import { schemaValidator } from "../middleware/schemaValidator";
import Users from "../models/UserModel";

const signupRouter = Router();

signupRouter.use(schemaValidator(signupValidator));

signupRouter.post("/", async (req, res, next) => {
  try {
    const { name, username, image, password }: z.infer<typeof signupValidator> =
      req.body;

    const hashedPassword = await hash(password, 10);

    await Users.create({
      image,
      name,
      password: hashedPassword,
      username,
    });

    res.status(201).json({ message: "Account created successfully" });
  } catch (error) {
    next({ error: "Some error occured. Please try again later!", status: 500 });
  }
});

export { signupRouter };
