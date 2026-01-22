const express = require("express");
const app = express();
const port = 8000;

const categoryController = require("./controller/category-controller");
const wishController = require("./controller/wish-controller");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/category", categoryController);
app.use("/wish", wishController);

app.get("/", (req, res) => {
  res.send("WishLi is running!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
