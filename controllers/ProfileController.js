class ProfileController {
  static async index(req, res) {
    try {
      const user = req.user;
      return res.json({ status: 200, data: user });
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong." });
    }
  }

  static async store(req, res) {}

  static async show(req, res) {}

  static async update(req, res) {}

  static async destroy(req, res) {}
}

export default ProfileController;
