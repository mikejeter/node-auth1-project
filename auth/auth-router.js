const bcrypt = require('bcryptjs');
const router = require("express").Router();

const Users = require("../users/users-model.js");

router.post("/register", (req, res) => {

    const user = req.body;
    const hash = bcrypt.hashSync(user.password, 16);

    user.password = hash;

    Users.add(user)
        .then(saved => {
            res.status(201).json({ saved });
        })
        .catch(err => {
            res.status(500).json({ message: 'problem with the database', error: err});
        });
});

router.post("/login", (req, res) => {
    const {username, password} =req.body;

    Users.findBy({username})
    .then(([user]) => {
        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.user = username;
            res.status(200).json({ message: "welcome!"}); 
        } else {
            res.status(401).json({ message: 'invalid creds'});
        }
    })
    .catch(err => {
        res.status(500).json({ message: 'problem with the database', error: err});
    });
});

module.exports = router;