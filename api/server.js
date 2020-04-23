const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require('express-session');
const knexSessionStore = require('connect-session-knex')(session);

const usersRouter = require("../users/users-router.js");
const authRouter = require("../auth/auth-router.js");

const server = express();

const sessionConfig = {
    name: 'auth-project',
    secret: 'myhsdbcjaeieutysecret',
    cookie: {
        maxAge: 3600 * 1000,
        secure: false,  // should be true in production
        httpOnly: true
    },
    resave: false,
    saveUninitialized: false,

    store: new knexSessionStore(
      {
        knex: require("../data/db-config.js"),
        tablename: "sessions",
        sidfieldname: "sid",
        createtable: true,
        clearInterval: 3600 * 1000

      }
    )
}

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use("/api/users", usersRouter);
server.use("/api/auth", authRouter);

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

module.exports = server;