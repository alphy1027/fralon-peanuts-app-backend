const Transaction = require('../models/transaction');

class TransactionService {
    constructor(transactionModel) {
        this.Transaction = transactionModel;
    }

    async getAllTransactions(query) {
        const { limit = 5, page = 0 } = query;
        const pageLimit = parseInt(limit)

        const pipeline = [
            { $sort: { createdAt: -1 } },
            { $limit: pageLimit },
            {
                $project: {
                    senderName: 1,
                    amount: 1,
                    code: 1,
                    status: 1
                }
            }
        ]

        return await this.Transaction.aggregate(pipeline)
    }

    async getTransactionById(transactionId) {
        return await this.Transaction.findById(transactionId).exec();
    }

    async createTransaction(transactionDetails) {
        return await this.Transaction.create({ ...transactionDetails });
    }

}

module.exports = new TransactionService(Transaction);