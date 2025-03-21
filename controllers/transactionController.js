const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../middleware/errorResponse');
const successResponse = require('../middleware/successResponse');
const transactionService = require('../services/transactionService');
const validateId = require('../utils/validateId');

//get all transactions
const getTransactions_get = asyncHandler(async (req, res, next) => {
    const transactions = await transactionService.getAllTransactions(req.query);
    if (transactions.length === 0)
        return next(new ErrorResponse('No transactions found', 404));
    return successResponse(res, 'Transactions retrieved successfully', { transactions });
})
// get a transaction
const getSingleTransaction_get = asyncHandler(async (req, res, next) => {
    const transactionId = req.params.transactionId;
    const { user } = req;
    validateId(transactionId, next);
    const transaction = await transactionService.getTransactionById(transactionId);
    if (!transaction)
        return next(new ErrorResponse('Transaction not found', 404));
    if (!user.role.includes('admin') && transaction.client.toString() !== user.userId.toString()) {
        return next(new ErrorResponse('You do not have permission to view this transaction', 403))
    }
    return successResponse(res, 'Transaction retrieved successfully', { transaction });
})
// creating a new transaction
const addNewTransaction_post = asyncHandler(async (req, res, next) => {
    // const { client, order, senderName, senderNumber, amount, code, status, notes } = req.body;
    const transactionDetails = req.body;
    const newTransaction = await transactionService.createTransaction(transactionDetails);
    if (!newTransaction)
        return next(new ErrorResponse('Transaction not found', 404));
    return successResponse(res, 'New transaction successfully created', { newTransaction }, 201);
})

module.exports = {
    getTransactions_get,
    getSingleTransaction_get,
    addNewTransaction_post
}