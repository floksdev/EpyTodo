const express = require("express");
const app = express();
const connection = require("../config/db");

module.exports = (res, req, next) => {
    var id = req.params.id;
    if (id) {
    connection.execute("SELECT * FROM todo WHERE id = ?", [id], function(results) {
            if (!results.lenght) {
            res.status(404).json("404: Not found");
            } else {
            next();
            }
        });
    } else {
        res.status(500).json("Error: Internal server error");
    }
}