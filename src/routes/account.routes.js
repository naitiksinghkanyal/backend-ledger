const express = require("express")
const authMiddelware = require("../middelware/auth.middelware")
const accountController = require("../controllers/account.controller")

const router = express.Router()


/**
 * - POST /api/account/
 * - create a new account 
 * - protected route 
 */
router.post("/",authMiddelware.authMiddelware, accountController.createAccountController)

/**
 * - GET /api/accounts/
 * - get all the accounts of the logged-in user 
 * - protected routes 
 */
router.get("/", authMiddelware.authMiddelware, accountController.getUserAccountsController)

/**
 * - GET /api/accounts/balance/:accountId
 */
router.get("/balance/:accountId", authMiddelware.authMiddelware, accountController.getAccountBalanceController)

module.exports = router