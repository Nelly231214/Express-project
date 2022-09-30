const express = require('express');
const sqlite = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();
const db = new sqlite.Database('data.db');
db.run("CREATE TABLE IF NOT EXISTS people (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT VARCHAR(255) NOT NULL, surname TEXT NOT NULL, age INTEGER NOT NULL, profesion TEXT NOT NULL)");
// CREATE
app.post("/people", bodyParser.json(), (req, res) => {
  let name = req.body["name"]
  let surname = req.body["surname"]
  let age = req.body["age"]
  let profesion = req.body["profesion"]
  db.run("INSERT INTO people(name,surname, age,profesion) VALUES(?,?,?,?)", name, surname, age, profesion)
  res.send(JSON.stringify({ message: 'success' }))
});
//  READ WITH ID
app.get("/people/:id", bodyParser.json(), (req, res) => {
  db.get(`SELECT * FROM people where id = ?`, [req.params.id], (err, row) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.status(200).json(row);
  });
});
// READ
app.get("/people", bodyParser.json(), (req, res) => {
  db.all("SELECT * FROM people", (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.status(200).json(rows);
  });
});
// UPDATE
app.patch("/people/:id", bodyParser.json(), (req, res) => {
  db.run(`UPDATE people SET name = ?, surname = ?, age = ?, profesion = ? WHERE id = ?`,
    [req.body.name, req.body.surname, req.body.age, req.body.profesion, req.params.id],
    function (err, result) {
      if (err) {
        res.status(400).json({ "error": res.message })
        return;
      }
      res.status(200).json({ updatedID: this.changes });
    });
});
// DELETE
app.delete("/people/:id", (req, res, next) => {
  db.run(`DELETE FROM people WHERE id = ?`,
    req.params.id,
    function (err, result) {
      if (err) {
        res.status(400).json({ "error": res.message })
        return;
      }
      res.status(200).json({ deletedID: this.changes })
    });
});

app.listen(3000)