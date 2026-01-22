const path = require("path");
const WishDao = require("../../dao/wish-dao");
const Ajv = require("ajv").default;
const ajv = new Ajv();

const schema = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string", maxLength: 100 },
    categoryId: { type: "string" },
    priority: { type: "string" },
    link: { type: "string" },
  },
  required: ["id", "name", "categoryId", "priority"],
  additionalProperties: false,
};

async function UpdateAbl(req, res) {
  try {
    let body = req.body;

    if (!body.link) body.link = "";

    const valid = ajv.validate(schema, body);

    if (valid) {
      const dao = new WishDao();
      const wish = await dao.updateWish(body);
      res.json(wish);
    } else {
      res.status(400).send({
        errorMessage: "validation of input failed",
        params: body,
        reason: ajv.errors,
      });
    }
  } catch (e) {
    if (e.message.startsWith("Wish with given id")) {
      res.status(400).json({ error: e.message });
      return;
    }
    res.status(500).send(e);
  }
}

module.exports = UpdateAbl;
