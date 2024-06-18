import vine, { errors } from "@vinejs/vine";
import { loginSchema, registerSchema } from "../validations/authValidation.js";
import bcrypt from "bcryptjs";
import prisma from "../DB/db.config.js";
import jwt from "jsonwebtoken";
import { sendEMail } from "../config/mailer.js";
import logger from "../config/logger.js";

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

  static async login(req, res) {
    try {
      const body = req.body;
      const validator = vine.compile(loginSchema);
      const payload = await validator.validate(body);

      //   find  user with email
      const findUser = await prisma.users.findUnique({
        where: {
          email: payload.email,
        },
      });

      if (findUser) {
        if (!bcrypt.compareSync(payload.password, findUser.password)) {
          return res.status(400).json({ message: "Wrong email or password" });
        }
        // issue token to user
        const payloadData = {
          id: findUser.id,
          name: findUser.name,
          email: findUser.email,
          profile: findUser.profile,
        };

        const token = jwt.sign(payloadData, process.env.JWT_SECRET, {
          expiresIn: "365d",
        });

        return res.json({
          message: "Logged in",
          access_token: `Bearer ${token}`,
        });
      }

      return res.status(400).json({ message: "No user found with this email" });
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

  // send test email
  static async sendTestEmail(req, res) {
    try {
      const { email } = req.query;

      const payload = {
        toEmail: email,
        subject: "Test Email",
        body: "<h1>Test Email. From news portal</h1>",
      };

      await sendEMail(payload.toEmail, payload.subject, payload.body);

      return res.status(200).json({
        message: "Email sent successfully",
      });
    } catch (error) {
      logger.error({
        type: "Email error",
        error: error,
      });
      return res.status(500).json({
        message: "Something went wrong. Please try again!",
      });
    }
  }
}

export default AuthController;
