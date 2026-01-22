const path = require("path");
const Ajv = require("ajv").default;
const CategoryDao = require("../../dao/category-dao");
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
    const dao = new CategoryDao();
    
    const body = req.query.id ? req.query : req.body;
    const valid = ajv.validate(schema, body);
    
    if (valid) {
      const categoryId = body.id;
      const category = await dao.getCategory(categoryId);
      if (!category) {
        res
          .status(400)
          .send({ error: `category with id '${categoryId}' doesn't exist` });
        return;
      }
      res.json(category);
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