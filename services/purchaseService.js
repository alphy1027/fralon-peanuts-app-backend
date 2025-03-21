const Purchase = require('../models/purchase');

class PurchaseService {
    constructor(purchaseModel) {
        this.Purchase = purchaseModel;
    }

    async getAllPurchases() {
        return await this.Purchase.find().exec();
    }

    async getSinglePurchase(purchaseId) {
        return await this.Purchase.findById(purchaseId).exec();
    }

    async deletePurchase(purchaseId) {
        return await this.Purchase.findByIdAndUpdate(purchaseId).exec();
    }

    async updatePurchase(purchaseId, purchaseDetails) {
        return await this.Purchase.findByIdAndUpdate(purchaseId,
            { $set: { ...purchaseDetails } },
            { new: true, runValidators: true }
        ).exec();
    }

    async createNewPurchase(purchaseDetails) {
        return await this.Purchase.create({ ...purchaseDetails });
    }

}

module.exports = new PurchaseService(Purchase);