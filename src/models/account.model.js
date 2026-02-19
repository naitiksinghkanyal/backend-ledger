const mongoose = require("mongoose");
const ledgerModel = require("./ledger.model");

const accountSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [ true, "Account must be associated with a user"],
        index: true
    },
    status:{
        type: String,
        enum: {
            values: ["ACTIVE", "FROZEN", "CLOSED"],
            message: "Status must be ACTIVE , FROZEN or CLOSED",
        },
        default: "ACTIVE"
    },
    currency:{
        type: String,
        required: [true, "Currency is required for creating an acccount"],
        default: "GBP"
    }
},{
    timestamps: true
})

accountSchema.index({ user: 1, status: 1 })

accountSchema.methods.getBalance = async function(){

    //calculate the user balance 
    const balanceData = await ledgerModel.aggregate([
        {$match: {account: this._id}},
        {
            $group: {
                _id:null,
                totalDebit:{
                    $sum:{
                        $cond:[
                            {$eq: ["$type", "DEBIT"]},
                            "$amount",
                            0
                        ]
                    }
                },
                totalCredit: {
                    $sum:{
                        $cond:[
                            {$eq: ["$type", "CREDIT"]},
                            "$amount",
                            0
                        ]
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                balance: {$subtract: ["$totalCredit", "$totalDebit"]}
            }
        }
    ])

    //if there is no ledger entry meaning first user transaction
    if(balanceData.length === 0 ){
        return 0;
    }
    return balanceData[0].balance;
}

const  accountModel = mongoose.model("accounts", accountSchema)

module.exports = accountModel