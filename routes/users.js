const express = require("express");
const router = express.Router();
const Client = require("pg").Client;

// get all users
router.get("/", async (req, res) => {
  const client = new Client({
    user: "postgres",
    host: "127.0.0.1",
    database: "test",
    password: "12345678",
    port: 5432,
  });
  await client.connect();

  try {
    const result = await getUsers(client);
    res.send(result);
  } catch (error) {
    return res.status(500).send("Server error");
  }
});

// Add user
router.post("/add-user", async (req, res) => {
  const client = new Client({
    user: "postgres",
    host: "127.0.0.1",
    database: "test",
    password: "12345678",
    port: 5432,
  });
  await client.connect();

  const { user } = req.body;
  const { email, username } = user;

  const userNameVaildation = username.length > 5 && username.length < 31;
  const emailValidation = String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

  if (!userNameVaildation) {
    res.send("Usernane is not valid");
    return "Username is not valid";
  }

  if (!emailValidation) {
    res.send("Email is not valid");
    return "Email is not valid";
  }

  try {
    const result = await addUser(user, client);
    res.json(result);
  } catch (error) {
    return res.status(500).send("Server error");
  }
});

// edit user
router.put("/edit-user", async (req, res) => {
  const client = new Client({
    user: "postgres",
    host: "127.0.0.1",
    database: "test",
    password: "12345678",
    port: 5432,
  });
  await client.connect();

  const { user } = req.body;
  const { username, email } = user;

  const userNameVaildation = username.length > 5 && username.length < 31;
  const emailValidation = String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  if (!userNameVaildation) {
    res.send("data is not valid");
    return "data is not valid";
  }

  if (!emailValidation) {
    res.send("data is not valid");
    return "data is not valid";
  }

  try {
    const result = await editUser(user, client);
    res.json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
});

// delete user
router.delete("/delete-user/:userId", async (req, res) => {
  const client = new Client({
    user: "postgres",
    host: "127.0.0.1",
    database: "test",
    password: "12345678",
    port: 5432,
  });
  await client.connect();

  const userId = req.params.userId;

  try {
    await deleteUser(userId, client);
    res.send("User deleted");
  } catch (error) {
    return res.status(500).send("Server error");
  }
});

// get a specific user
router.get("/:userId", async (req, res) => {
  const client = new Client({
    user: "postgres",
    host: "127.0.0.1",
    database: "test",
    password: "12345678",
    port: 5432,
  });
  await client.connect();

  const userId = req.params.userId;

  try {
    let result = await getUserById(userId, client);
    if (result.rows.length === 0) {
      res.send("No match found!");
    } else {
      res.send(result.rows);
    }
  } catch (error) {
    return res.status(500).send("Server error");
  }
});

/*
Helper methods
*/
/////////////////////////////////////
async function addUser(user, client) {
  const { username, password, phone, email, name } = user;

  return await client.query(
    `INSERT INTO general.users ( username, password, phone, email, name) VALUES ($1, $2, $3, $4, $5)`,
    [username, password, phone, email, name]
  );
}

async function editUser(user, client) {
  const { username, password, phone, email, name, id } = user;

  return await client.query(
    `UPDATE general.users SET username = $1, password = $2, phone = $3, email = $4,  name = $5 WHERE id = $6`,
    [username, password, phone, email, name, id]
  );
}

async function deleteUser(userId, client) {
  return await client.query("DELETE FROM general.users WHERE id = $1", [
    userId,
  ]);
}

async function getUserById(userId, client) {
  return await client.query(`SELECT * FROM general.users WHERE id = ${userId}`);
}

async function getUsers(client) {
  return await client.query(`SELECT * FROM general.users ORDER BY id ASC`);
}

module.exports = router;
