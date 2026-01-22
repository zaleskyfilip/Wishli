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
  additionalProperties: false,
};

async function GetAbl(req, res) {
  try {
    const dao = new WishDao();

    const body = req.query.id ? req.query : req.body;
    const valid = ajv.validate(schema, body);

    if (valid) {
      const wishId = body.id;
      const wish = await dao.getWish(wishId);
      if (!wish) {
        res
          .status(400)
          .send({ error: `wish with id '${wishId}' doesn't exist` });
        return;
      }
      res.json(wish);
    } else {
      res.status(400).send({
        errorMessage: "validation of input failed",
        params: body,
        reason: ajv.errors,
      });
    }
  } catch (e) {
    res.status(500).send(e);
  }
}

module.exports = GetAbl;