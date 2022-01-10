module.exports = app => {
    const user = require('../controllers/user.controller.js');
    var router = require("express").Router();

    // create a new user
    router.post('/create', user.create)

    // delete the user
    router.delete('/:id', user.delete);

    // login 
    router.post('/login', user.login);

    // get all the users
    router.get('/all', user.getAllUser);

    // get user by id
    router.get('/:id', user.getUserById);

    // update user
    router.post('/:id', user.updateUser);

    app.use('/api/user', router)
}