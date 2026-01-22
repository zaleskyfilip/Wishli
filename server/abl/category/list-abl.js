const path = require("path");
const CategoryDao = require("../../dao/category-dao");

async function ListAbl(req, res) {
  try {
    const dao = new CategoryDao();

    const list = await dao.listCategories();
    res.json(list);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
}
module.exports = ListAbl;
