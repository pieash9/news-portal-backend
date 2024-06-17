import express from "express";
import "dotenv/config";
import rootRoutes from "./routes/api.js";
import fileUpload from "express-fileupload";

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(fileUpload());

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

app.use("/api", rootRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
