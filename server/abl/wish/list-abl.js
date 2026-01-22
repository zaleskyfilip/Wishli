const path = require("path");
const WishDao = require("../../dao/wish-dao");

async function ListAbl(req, res) {
  try {
    const dao = new WishDao();

    const list = await dao.listWishes();
    res.json(list);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
}
module.exports = ListAbl;
