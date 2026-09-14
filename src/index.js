
import express from "express";

const app = express();
app.get("/", (req, res) => {
  res.send("Homepage!, server is active.");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});