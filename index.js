const { faker } = require('@faker-js/faker');

const mysql = require('mysql2');

const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const methodOverride = require('method-override');
const app = express();
const port = 8080;

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(methodOverride("_method"));


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta',
  password: '12345'
});


// let createRandomUser =  () => {
//   return [
//     faker.string.uuid(),
//     faker.internet.userName(),
//     faker.internet.email(),
//     faker.internet.password(),

//   ];
// }





//Home Route
app.get("/", (req, res) => {

  let q = `SELECT count(*) FROM user`;


  try {
    connection.query(q, (err, result) => {

      if (err) throw err;
      console.log(result[0]['count(*)']);

      let users = result[0]['count(*)'];
      res.render("home.ejs", { users });
    });

  } catch (err) {
    console.log(err);
    res.send("Error in Database!");
  }


})

//Show Route
app.get("/user", (req, res) => {

  let q = `SELECT * FROM user`;


  try {
    connection.query(q, (err, result) => {

      if (err) throw err;
      let users = result;
      res.render("showUser.ejs", { users });
    });

  } catch (err) {
    console.log(err);
    res.send("Error in Database!");
  }


});


//Edit Route
app.get("/user/:id/edit", (req, res) => {

  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id = '${id}' `;


  try {
    connection.query(q, (err, result) => {

      if (err) throw err;
      let user = result[0];
      res.render("edit.ejs", { user });
    });

  } catch (err) {
    console.log(err);
    res.send("Error in Database!");
  }


});



//Úpdate Route
app.patch("/user/:id", (req, res) => {

  let { id } = req.params;
  let { username: newUsername, password: newPassword } = req.body;

  let q = `SELECT * FROM user WHERE id = '${id}' `;


  try {
    connection.query(q, (err, result) => {

      if (err) throw err;
      let user = result[0];

      if (newPassword != user.password) {

        res.send("Wrong Password");

      } else {

        let q2 = `UPDATE user SET username = '${newUsername}' WHERE id = '${id}' `;

        try {
          connection.query(q2, (err, result) => {

            if (err) throw err;
            res.redirect("/user");
          });

        } catch (err) {
          console.log(err);
          res.send("Error in Database!");
        }
      }

    });

  } catch (err) {
    console.log(err);
    res.send("Error in Database!");
  }


});




//Create User Route
app.get("/user/form", (req, res) => {

  res.render("form.ejs");


});


//user in db
app.post("/user/form", (req, res) => {
  let id = uuidv4();
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;

  let q = `INSERT INTO user(id, username, email, password) VALUES ( '${id}', '${username}', '${email}', '${password}' )`;


  try {
    connection.query(q, (err, result) => {

      if (err) throw err;
      console.log("Successful");
      res.redirect("/user");
    });

  } catch (err) {
    console.log(err);
    res.send("Error in Database!");
  }

  console.log(req.body);


});








//Delete form serve
app.get("/user/:id/delete", (req, res) => {

  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id = '${id}' `;


  try {
    connection.query(q, (err, result) => {

      if (err) throw err;
      let user = result[0];
      res.render("delete.ejs", { user });
    });

  } catch (err) {
    console.log(err);
    res.send("Error in Database!");
  }


});








//Delete Route
app.delete("/user/:id", (req, res) => {

  let { id } = req.params;
  let { password: newPassword } = req.body;

  let q = `SELECT * FROM user WHERE id = '${id}' AND password = '${newPassword}' `;
  


  try {
    connection.query(q, (err, result) => {

      if (err) throw err;
      let user = result[0];
      console.log(user);

      if (user === undefined) {

        res.send("Wrong Password");

      } else {

        let q2 = `DELETE FROM user WHERE id = '${id}' AND password = '${newPassword}'  `;
        

        try {
          connection.query(q2, (err, result) => {

            if (err) throw err;
            res.redirect("/user");
          });

        } catch (err) {
          console.log(err);
          res.send("Error in Database!");
        }
      }

    });

  } catch (err) {
    console.log(err);
    res.send("Error in Database!");
  }


});







app.listen(port, () => {

  console.log(`Server is started on port ${port}`);

});




