const WishDao = require("../../dao/wish-dao");
const Ajv = require("ajv").default;
const ajv = new Ajv();

const schema = {
  type: "object",
  properties: {
    name: { type: "string", maxLength: 100 },
    categoryId: { type: "string" },
    priority: { type: "string" },
    link: { type: "string" },
  },
  required: ["name", "categoryId", "priority"],
  additionalProperties: false,
};

async function CreateAbl(req, res) {
  try {
    let body = req.body;
    if (!body.link) body.link = "";

    const valid = ajv.validate(schema, body);
    if (valid) {
      const dao = new WishDao();
      const wish = await dao.createWish({
        ...body,
        cts: new Date().toISOString(),
      });
      res.json(wish);
    } else {
      res.status(400).send({
        errorMessage: "validation of input failed",
        params: body,
        reason: ajv.errors,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
}
module.exports = CreateAbl;
