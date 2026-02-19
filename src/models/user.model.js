const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//user Schema 
const userSchema =  new mongoose.Schema({
    email:{
        type: String,
        required:[true,"Email is required for creating a User"],
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please use a valid email address"],
        unique: [true, " Email already in use. Please use a different one or try login."]

    },
    name:{
        type: String,
        required: [true, " Name is required to create a account "]
    },
    password:{
        type: String,
        required: [true," Password is required to create an account"],
        minlength:[6,"Password should contain more than 6 character"],
        select: false
    },
    systemUser:{
        type: Boolean,
        default: false,
        immutable: true,
        select: false
    }
},  {
    timestamps: true
})

//checking if in case user has changed the password 
userSchema.pre("save", async function(){
    //if not return to the next function 
    if(!this.isModified("password")){
        return 
    }

    //if yes , update it and save it 
    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash

    return
})

//comparing the password entered by the user that if it matches with the one saved 
userSchema.methods.comparePassword = async function (password){

    return await bcrypt.compare(password,this.password)

}

const userModel = mongoose.model("user", userSchema)

module.exports = userModel