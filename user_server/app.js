const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
//This imports the CORS (Cross-Origin Resource Sharing) middleware,
//which allows AJAX requests to skip the Same-origin policy and access resources from remote hosts.
const cors = require("cors");

//This initializes an instance of the Express application.
//We will use this app object to configure routes, middleware, and start the server
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Get all data
app.get("/api/getAllData", (req, res) => {
  fs.readFile("data.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    //res.json(JSON.parse(data)): If no error occurred, this line parses the JSON data read from the
    //file (data) into a JavaScript object using JSON.parse(), and sends it as a JSON response using res.json().
    //This effectively sends the contents of data.json file back to the client in the HTTP response body.
    res.json(JSON.parse(data));
  });
});

// Get data by name
app.get("/api/getDataByName/:name", (req, res) => {
  const name = req.params.name;
  fs.readFile("data.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    const users = JSON.parse(data);
    const filteredUsers = users.filter((user) => user.name === name);
    res.json(filteredUsers);
  });
});

//Get data by DOB
app.get("/api/getDataByDOB/:dob", (req, res) => {
  const dob = req.params.dob;
  fs.readFile("data.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    const users = JSON.parse(data);
    const filteredUsers = users.filter((user) => user.DOB === dob);
    res.json(filteredUsers);
  });
});

// Get data data by age
app.get("/api/getDataByAge/:age", (req, res) => {
  const age = req.params.age;
  fs.readFile("data.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    const users = JSON.parse(data);
    const filteredUsers = users.filter((user) => user.age === age);
    res.json(filteredUsers);
  });
});

// post data
app.post("/api/saveData", (req, res) => {
  const formData = req.body;
  fs.readFile("data.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    const jsonData = JSON.parse(data);
    jsonData.push(formData);
    fs.writeFile("data.json", JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      res.json({ message: "Data saved successfully" });
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
