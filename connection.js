const mysql = require("mysql");
const util = require("util");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Zaqbshcju9435!",
    database: "employees_db"
});

connection.connect();

connection.query = util.promisify(connection.query);

module.exports = connection;