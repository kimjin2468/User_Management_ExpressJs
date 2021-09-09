const mysql = require("mysql");

// Connectino Pool
const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// View Users
exports.view = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected!
    console.log("Connected as ID" + connection.threadId);
    // User the Connection
    connection.query(
      `SELECT * FROM user WHERE status = "active"`,
      (err, rows) => {
        //When done with the connection, release it
        connection.release();
        if (!err) {
          let removedUser = req.query.removed;
          res.render("home", { rows, removedUser });
        } else {
          console.log(err);
        }
      }
    );
  });
};

//Find User by Search
exports.find = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected!
    console.log("Connected as ID" + connection.threadId);

    let searchTerm = req.body.search;
    // User the Connection
    connection.query(
      `SELECT * FROM user WHERE first_name LIKE '%${searchTerm}%' or last_name LIKE '%${searchTerm}%'`,
      (err, rows) => {
        //When done with the connection, release it
        connection.release();
        if (!err) {
          res.render("home", { rows });
        } else {
          console.log(err);
        }
      }
    );
  });
};

// Add new User form
exports.form = (req, res) => {
  res.render("add-user");
};

// Add new User
exports.create = (req, res) => {
  const { first_name, last_name, email, phone, comments } = req.body;

  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected!

    // User the Connection
    connection.query(
      `INSERT INTO user SET first_name = '${first_name}', last_name = '${last_name}', email = '${email}', phone = '${phone}', comments = '${comments}'`,
      (err, rows) => {
        //When done with the connection, release it
        connection.release();
        if (!err) {
          res.render("add-user", { alert: "User added successefully." });
        } else {
          console.log(err);
        }
      }
    );
  });
};

//Edit User
exports.edit = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected!

    // User the Connection
    connection.query(
      `SELECT * FROM user where id ='${req.params.id}'`,
      (err, rows) => {
        //When done with the connection, release it
        connection.release();
        if (!err) {
          res.render("edit-user", { rows });
        } else {
          console.log(err);
        }
      }
    );
  });
};

//Update User
exports.update = (req, res) => {
  const { first_name, last_name, email, phone, comments } = req.body;

  pool.getConnection((err, connection) => {
    if (err) throw err;

    connection.query(
      `UPDATE user SET first_name = '${first_name}', last_name='${last_name}',email = '${email}', phone='${phone}', comments='${comments}' WHERE id = '${req.params.id}'`,
      (err, rows) => {
        //When done with the connection, release it
        connection.release();
        if (!err) {
          pool.getConnection((err, connection) => {
            if (err) throw err;

            connection.query(
              `SELECT * FROM user where id ='${req.params.id}'`,
              (err, rows) => {
                //When done with the connection, release it
                connection.release();
                if (!err) {
                  res.render("edit-user", { rows, alert: "Update successed!" });
                } else {
                  console.log(err);
                }
              }
            );
          });
        } else {
          console.log(err);
        }
      }
    );
  });
};

//DELETE User
exports.delete = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    let id = req.params.id;

    connection.query(
      `UPDATE user SET status ="removed" WHERE id =${id}`,
      (err, rows) => {
        connection.release();
        if (!err) {
          let removedUser = encodeURIComponent("User successfully removed.");

          res.redirect("/?removed=" + removedUser);
        } else {
          console.log(err);
        }
      }
    );
  });
};

//VIEW User
exports.profile = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected!
    console.log("Connected as ID" + connection.threadId);
    // User the Connection
    connection.query(
      `SELECT * FROM user WHERE status = "active" and id = '${req.params.id}'`,
      (err, rows) => {
        //When done with the connection, release it
        connection.release();
        if (!err) {
          if (rows[0]["comments"] === "") {
            rows[0]["comments"] = "코멘트가 없습니다";
          }

          console.log(rows[0]["comments"]);

          res.render("view-user", { rows });
        } else {
          console.log(err);
        }
      }
    );
  });
};
