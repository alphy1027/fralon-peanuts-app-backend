const Client = require('../models/client');
const ErrorResponse = require('../middleware/errorResponse');

class ClientService {
    constructor(clientModel) {
        this.Client = clientModel;
    }

    async createNewClient(clientDetails) {
        return await this.Client.create({ ...clientDetails });
    }

    async getClient(clientDetails) {
        return await this.Client.findOne({ ...clientDetails }).exec();
    }

    async getAllClients(query) {
        const limit = parseInt(query.limit) || 5
        return await this.Client.aggregate([
            { $match: {} },
            { $sort: { createdAt: -1 } },
            { $limit: limit }
        ])
    }

    async getClientById(clientId) {
        return await this.Client.findById(clientId).select('username email phoneNumber orders transactions membership flagged createdAt').exec();
    }

    async deleteClient(clientId) {
        return await this.Client.findByIdAndDelete(clientId).exec();
    }

    async updateClient(clientId, clientDetails) {
        return await this.Client.findByIdAndUpdate(clientId,
            { $set: clientDetails },
            { new: true, runValidators: true }
        ).exec()
    }

    async flagClient(clientId) {
        const flaggedClient = await this.Client.findById(clientId).select('username email phoneNumber membership flagged createdAt').exec();
        if (!flaggedClient)
            return null;
        flaggedClient.flagged = !flaggedClient.flagged;
        await flaggedClient.save();
        return flaggedClient;
    }

}

module.exports = new ClientService(Client);