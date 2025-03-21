const express = require('express');
const clientController = require('../controllers/clientController');
const router = express.Router();

router
    .route('/')
    .get(clientController.getAllClients_get)
router
    .route('/:clientId')
    .get(clientController.getClient_get)
    .delete(clientController.deleteClient_delete)
    .put(clientController.updateClient_put)
    .patch(clientController.flagClient_patch)

module.exports = router;