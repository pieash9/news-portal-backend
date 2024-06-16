import vine, { errors } from "@vinejs/vine";
import { registerSchema } from "../validations/authValidation.js";

class AuthController {
  static async register(req, res) {
    try {
      const body = req.body;

      const validator = vine.compile(registerSchema);
      const payload = validator(body);
      return res.json({ payload });
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        // console.log(error.messages);
        res.status(400).json({ errors: error.messages });
      }
    }
  }
}

export default AuthController;
