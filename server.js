import express from "express";
import "dotenv/config";
import rootRoutes from "./routes/api.js";

const app = express();
const PORT = process.env.PORT || 4000;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

app.use("/api", rootRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
