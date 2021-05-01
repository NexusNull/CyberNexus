const sqlite3 = require('sqlite3');
const sqlite = require("sqlite");
const bcrypt = require("bcrypt");

const queries = {
    "findUser": "SELECT * FROM users WHERE username = ?",
    "getUser": "SELECT * FROM users WHERE id = ?",
};

const statements = {};


class DB {
    constructor() {
        this.initialized = false;
        this.db = null;
    }

    async getUserById(id) {
        return await statements.getUser.get([id]);
    }

    async getUserByName(name) {
        return await statements.findUser.get([name]);
    }

    async init() {
        this.db = await sqlite.open({
            filename: './server/data/main.sqlite',
            driver: sqlite3.Database
        });
        await this.db.migrate({migrationsPath: "./server/migrations"});

        for (let name in queries) {
            statements[name] = await this.db.prepare(queries[name]);
        }


        this.initialized = true;
    };
}

module.exports = DB;