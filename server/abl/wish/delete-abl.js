const path = require("path");
const Ajv = require("ajv").default;
const WishDao = require("../../dao/wish-dao");
const ajv = new Ajv();

const schema = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
};

async function DeleteAbl(req, res) {
  try {
    const dao = new WishDao();

    const valid = ajv.validate(schema, req.body);

    if (valid) {
      const wishId = req.body.id;
      await dao.deleteWish(wishId);
      res.json({});
    } else {
      res.status(400).send({
        errorMessage: "validation of input failed",
        params: req.body,
        reason: ajv.errors,
      });
    }
  } catch (e) {
    res.status(500).send(e.message);
  }
}

module.exports = DeleteAbl;