const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema({
    
    fromAccount:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true,"Transaction must be associated with a from Account"],
        index: true
    },
    toAccount:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true," Transaction must be associated wtih a to account"],
        index: true
    },
    status:{
        type: String,
        enum:{
            values: ["PENDING" , "COMPLETED", "FAILED", "REVERSED" ],
            message: "Status can either be PENDING , COMPLETED , FAILED or REVERSED ",
        },
        default: "PENDING"
    },
    amount:{
        type: Number,
        required: [true," Amount is required for creating a transaction "],
        min:[0, "Transaction amount cannot be in Negative "]
    },
    idempotencyKey:{
        type: String,
        required: [true, " Idempotency Key is required to create a transaction "],
        index: true,
        unqiue: true
    }
},{
    timestamps: true
})

const transactionModel = mongoose.model("transaction", transactionSchema)

module.exports = transactionModel