import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader === undefined || authHeader === null) {
    return res.status(400).json({
      status: 401,
      message: "Unauthorized",
    });
  }

  const token = authHeader.split(" ")[1];

  //   verify the jwt token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(400).json({
        status: 401,
        message: "Unauthorized",
      });
    }
    req.user = user;
    next();
  });
};

export default authMiddleware;
