const CategoryDao = require("../../dao/category-dao");
const Ajv = require("ajv");
const ajv = new Ajv();

const schema = {
  type: "object",
  properties: {
    name: { type: "string", maxLength: 50 },
  },
  required: ["name"],
  additionalProperties: false,
};

async function CreateAbl(req, res) {
  try {
    const body = req.body;
    const valid = ajv.validate(schema, body);

    if (valid) {
      const dao = new CategoryDao();
      const category = await dao.createCategory({
        ...body,
        cts: new Date().toISOString(),
      });
      res.json(category);
    } else {
      res.status(400).send({
        errorMessage: "validation of input failed",
        params: req.body,
        reason: ajv.errors,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
}
module.exports = CreateAbl;
