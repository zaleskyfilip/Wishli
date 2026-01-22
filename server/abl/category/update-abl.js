const path = require("path");
const Ajv = require("ajv").default;
const CategoryDao = require("../../dao/category-dao");

const ajv = new Ajv();

const schema = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string", maxLength: 50 },
  },
  required: ["id", "name"],
  additionalProperties: false,
};

async function UpdateAbl(req, res) {
  try {
    const dao = new CategoryDao();

    const body = req.body;
    const valid = ajv.validate(schema, body);

    if (valid) {
      const category = await dao.updateCategory(body);
      res.json(category);
    } else {
      res.status(400).send({
        errorMessage: "validation of input failed",
        params: body,
        reason: ajv.errors,
      });
    }
  } catch (e) {
    if (e.message.startsWith("Category with given id")) {
      res.status(400).json({ error: e.message });
      return;
    }
    res.status(500).send(e);
  }
}
module.exports = UpdateAbl;
