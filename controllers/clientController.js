const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../middleware/errorResponse');
const successResponse = require('../middleware/successResponse');
const clientService = require('../services/clientService');

const getAllClients_get = asyncHandler(async (req, res, next) => {
    const clients = await clientService.getAllClients(req.query);
    if (clients.length === 0)
        return next(new ErrorResponse('No clients found', 404));
    return successResponse(res, 'Clients retrieved successfully', { clients });
})

const getClient_get = asyncHandler(async (req, res, next) => {
    const clientId = req.params.clientId;
    const client = await clientService.getClientById(clientId);
    if (!client)
        return next(new ErrorResponse('Client not found', 404));
    return successResponse(res, 'Client retrieved successfully', { client });
})

const updateClient_put = asyncHandler(async (req, res, next) => {
    const clientId = req.params.clientId;
    const updatedUser = await clientService.updateClient(clientId, req.body);
    if (!updatedUser)
        return next(new ErrorResponse('No Client with that ID', 404));
    return successResponse(res, 'Client updated successfully', { upadatedClient });
})

const deleteClient_delete = asyncHandler(async (req, res, next) => {
    const clientId = req.params.clientId;
    const client = await clientService.deleteClient(clientId);
    if (!client)
        return next(new ErrorResponse('No Client with that ID', 404));
    return successResponse(res, 'Client successfully deleted');
})

const flagClient_patch = asyncHandler(async (req, res, next) => {
    const clientId = req.params.clientId;
    const flaggedClient = await clientService.flagClient(clientId);
    if (!flaggedClient)
        return next(new ErrorResponse('No Client with that ID', 404));
    return successResponse(res, 'Client flagged successfully', { flaggedClient });
})

module.exports = {
    getAllClients_get,
    getClient_get,
    deleteClient_delete,
    updateClient_put,
    flagClient_patch
};