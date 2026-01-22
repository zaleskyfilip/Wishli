const express = require("express");
const router = express.Router();

const CreateAbl = require("../abl/wish/create-abl");
const GetAbl = require("../abl/wish/get-abl");
const ListAbl = require("../abl/wish/list-abl");
const UpdateAbl = require("../abl/wish/update-abl");
const DeleteAbl = require("../abl/wish/delete-abl");

router.post("/create", async (req, res) => {
  await CreateAbl(req, res);
});

router.get("/get", async (req, res) => {
  await GetAbl(req, res);
});

router.post("/update", async (req, res) => {
  await UpdateAbl(req, res);
});

router.get("/list", async (req, res) => {
  await ListAbl(req, res);
});

router.post("/delete", async (req, res) => {
  await DeleteAbl(req, res);
});

module.exports = router;
