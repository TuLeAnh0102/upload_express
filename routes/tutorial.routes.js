// const auth = require('../middleware/auth.middleware');
module.exports = app => {
    const tutorials = require("../controllers/tutorial.controller.js");

    var router = require("express").Router();

    // Create a new Tutorial
    router.post("/create", tutorials.create);

    // Retrieve all Tutorials
    router.get("/findAll", tutorials.findAll);

    // Retrieve all published Tutorials
    router.get("/published", tutorials.findAllPublished);

    // Retrieve a single Tutorial with id
    router.get("/:id", tutorials.findOne);

    // Update a Tutorial with id
    router.put("/:id", tutorials.update);

    // Delete a Tutorial with id
    router.delete("/:id", tutorials.delete);

    // delete a new Tutorial
    // router.delete("/", tutorials.deleteAll);

    // find all by id_user
    router.get("/findByUser/:id_user", tutorials.findAllByIdUser);

    app.use('/api/tutorials', router);
};