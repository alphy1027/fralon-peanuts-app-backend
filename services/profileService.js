const Client = require('../models/client');

class ProfileService {
    constructor(clientModel) {
        this.Client = clientModel;
    }

    async getProfile(clientId) {
        return await this.Client.findById(clientId).select('createdAt email membership phoneNumber username _id').exec();
    }

    async updateProfile(clientId, clientDetails) {
        return await this.Client.findByIdAndUpdate(clientId,
            { $set: { ...clientDetails } },
            { new: true, runValidators: true }
        ).exec();
    }
}

module.exports = new ProfileService(Client);