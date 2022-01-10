const db = require('../models');
const User = db.users;

// create and save new user
exports.create = async (req, res) => {
    // check duplicate username
    const username = req.body.username;
    const user = await User.findOne({ username });
    if (user) {
        return res.status(200).send({ message: 'Duplicate username' });
    } else {
        // create a new user
        const user = new User(req.body);
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    }
};

// delete user
exports.delete = (req, res) => {
    const id = req.params.id;
    User.findByIdAndRemove(id).then(data => {
        if (!data) {
            res.status(404).send({
                message:
                    `Cannot delete user with id=${id}. Maybe user was not found!`
            })
        } else {
            res.send({
                message: "User was deleted successfully!"
            });
        }
    })
}

// change password
exports.updatePassword = (req, res) => {
    const id = req.params.id;
    User.findByIdAndUpdate(id, req.body, { useFindAndModify: false }).then(data => {
        if (req.body.password = data.password) {
            res.status(200).send({ message: "Trùng mật khẩu cũ" })
        } else {

        }
    })
}

// login user
exports.login = async (req, res) => {
    //Login a registered user
    try {
        const { username, password } = req.body
        const user = await User.findByCredentials(username, password)
        if (!user) {
            return res.status(401).send({ error: 'Login failed! Check authentication credentials' })
        }
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (error) {
        res.status(400).send({error: error})
    }
}

// get all users
exports.getAllUser = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).send({ user: users});
    } catch (error) {
        res.status(400).send({ error: error })
    }
}

// get user by id_user
exports.getUserById = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id);
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send({ error: error})
    }
}

// get user by id_user
exports.updateUser = async (req, res) => {
    User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Tutorial with id=${id}. Maybe user was not found!`
                });
            } else res.send({ message: "user was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Tutorial with id=" + id
            });
        });
}



