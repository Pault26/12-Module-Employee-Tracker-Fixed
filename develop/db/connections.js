const mysql = require('mysql2');

const db = mysql.createConnection(
    {
      host: "localhost",
      user: "root",
      password: "",
      database: "employee_tracker_db"
    },
    console.log("successfully connected to database")
);

module.exports = db;