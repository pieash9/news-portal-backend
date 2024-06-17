import express from "express";
import "dotenv/config";
import rootRoutes from "./routes/api.js";
import fileUpload from "express-fileupload";
import helmet from "helmet";
import cors from "cors";
import { limiter } from "./config/ratelimit.js";

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(fileUpload());
app.use(helmet());
app.use(cors());
app.use(limiter);

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

app.use("/api", rootRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
