const {show_user_info,update_user_by_id, delete_user_by_id, get_info_id_or_email} = require('./user.query');
const express = require("express");
const app = express();

    app.get('/user', (req, res) => {
        show_user_info(res);
    });

    app.get("/user:info", (req, res) => {
        var info = req.params.info;
        get_info_id_or_email(res, info)
    });

    app.put("/user/:id", (req, res) => {
        var id = req.params.id;
        var mail = req.body["email"];
        var name = req.body["name"];
        var fname = req.body["firstname"];
        var password = req.body["password"];
        update_user_by_id(res, id, mail, password, name, fname);
    })

    app.delete('/user/:id', (req, res) => {
        var id = req.params.id;
        delete_user_by_id(res, id);
    });
module.exports = app;