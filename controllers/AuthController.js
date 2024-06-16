import vine, { errors } from "@vinejs/vine";
import { registerSchema } from "../validations/authValidation.js";
import bcrypt from "bcryptjs";
import prisma from "../DB/db.config.js";

class AuthController {
  static async register(req, res) {
    try {
      const body = req.body;

      const validator = vine.compile(registerSchema);
      const payload = await validator.validate(body);

      //   check if email exist
      const findUser = await prisma.users.findUnique({
        where: {
          email: payload.email,
        },
      });

      if (findUser) {
        return res.status(400).json({
          message: "Email already taken. Please try with another email.",
        });
      }

      //   encrypt password
      const salt = bcrypt.genSaltSync(10);
      payload.password = bcrypt.hashSync(payload.password, salt);

      const user = await prisma.users.create({
        data: payload,
      });
      return res.json({ status: 200, message: "user created", data: user });
    } catch (error) {
      console.log({ error });
      if (error instanceof errors.E_VALIDATION_ERROR) {
        // console.log(error.messages);
        return res.status(400).json({ errors: error.messages });
      } else {
        return res.status(500).json({
          status: 500,
          message: "Something went wrong. Please try again!",
        });
      }
    }
  }

  static async login(req, res) {}
}

export default AuthController;
