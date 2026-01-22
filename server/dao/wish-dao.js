"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const rf = fs.promises.readFile;
const wf = fs.promises.writeFile;

const DEFAULT_STORAGE_PATH = path.join(__dirname, "storage", "Wish.json");

class WishDao {
  constructor(storagePath) {
    this.storagePath = storagePath ? storagePath : DEFAULT_STORAGE_PATH;
  }

  async createWish(wish) {
    let list = await this._loadAll();
    wish.id = crypto.randomBytes(8).toString("hex");
    list.push(wish);
    await wf(this._getStorageLocation(), JSON.stringify(list, null, 2));
    return wish;
  }

  async getWish(id) {
    let list = await this._loadAll();
    return list.find((x) => x.id === id);
  }

  async updateWish(wish) {
    let list = await this._loadAll();
    const index = list.findIndex((x) => x.id === wish.id);
    if (index < 0) {
      throw new Error(`Wish with given id ${wish.id} does not exist`);
    }
    list[index] = { ...list[index], ...wish };
    await wf(this._getStorageLocation(), JSON.stringify(list, null, 2));
    return list[index];
  }

  async deleteWish(id) {
    let list = await this._loadAll();
    const index = list.findIndex((x) => x.id === id);
    if (index >= 0) {
      list.splice(index, 1);
    }
    await wf(this._getStorageLocation(), JSON.stringify(list, null, 2));
    return {};
  }

  async listWishes() {
    return await this._loadAll();
  }

  async _loadAll() {
    let list;
    try {
      list = JSON.parse(await rf(this._getStorageLocation()));
    } catch (e) {
      if (e.code === "ENOENT") {
        console.info("No storage found, initializing new one...");
        list = [];
      } else {
        throw new Error(
          "Unable to read from storage. Wrong data format. " +
            this._getStorageLocation()
        );
      }
    }
    return list;
  }

  _getStorageLocation() {
    return this.storagePath;
  }
}

module.exports = WishDao;
