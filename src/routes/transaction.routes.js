const {Router} = require('express');
const authMiddelware = require("../middelware/auth.middelware");
const transactionController = require("../controllers/transaction.controller");

const transactionRoutes = Router();


/**
 * - POST /api/transactions
 * - create a new transaction
 */

transactionRoutes.post("/",authMiddelware.authMiddelware, transactionController.createTransaction);

/**
 * - POST /api/transactions/system/initial-funds
 * - create initial funds transaction from system user 
 */
transactionRoutes.post("/system/initial-funds", authMiddelware.authSystemMiddelware, transactionController.createInitialFundsTransaction);

module.exports = transactionRoutes;