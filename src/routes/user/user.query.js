const connection = require("../../config/db");
const jwt = require('jsonwebtoken');
let isLoggedIn = false;

exports.show_user_info = function(res, id) {
    var id = global.id_db;
    connection.query("SELECT * FROM user WHERE id = ?",id, function(err, results, fields) {
        res.send(results);
    });
}

exports.get_data_for_login = function(req, res, bcrypt, mail, pwd, callback) {
    connection.execute("SELECT id, password FROM user WHERE email = ?", [mail], function(err ,results, fields) {
        if(results.length > 0) {
            var id_db = results[0].id;
            global.id_db = id_db;
            var pwd_db = results[0].password;
            if (bcrypt.compareSync(pwd, pwd_db)) {
                const token = jwt.sign({email:mail, id:id_db}, 'SECRET');
                isLoggedIn = true;
                callback(0);
            } else {
                callback(84);
            }
        } else {
            callback(84);
        }
    });
}

exports.get_info_id_or_email = function(res, info) {
    connection.execute('SELECT * FROM user WHERE id = ?', [info], function(results) {
        if (results.length > 0) {
            res.status(200).json(results);
        } else {
            connection.execute('SELECT * FROM user WHERE email = ?', [info], function(results) {
                res.status(200).json(results);
            });
        }
    });
}

exports.update_user_by_id = function(res, id, email, password, name, fname) {
    db.execute('UPDATE `user` SET email = ?, password = ?, name = ?, firstname = ? WHERE id = ?', [email, pwd, mname, fname, id], function(err, results, fields) {
        db.execute('SELECT id, email, password, created_at, firstname, name FROM user WHERE id = ?', [id], function(err, results, fields) {
            res.status(200).json(results);
        });
    });
}

exports.delete_user_by_id = function(res, id) {
    db.execute('DELETE FROM `user` WHERE id = ?', [id], function(err, results, fields) {
        res.status(200).json({"msg":`succesfully deleted record number: ${id}`});
    });
}

exports.isLoggedIn = isLoggedIn;