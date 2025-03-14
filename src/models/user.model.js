import mongoose from "mongoose"; 

const userSchema = new mongoose.Schema(
    {
        realName: {
            type: String, 
            required: true, 
            trim: true, 
        },
        lastName: {
            type: String, 
            required: true,
            trim: true,
        },
        email: {
            type: String, 
            required: true,
            trim: true, 
            unique: true, 
        },
        phoneNumber: {
            type: String, 
            required: true, 
            trim: true, 
        },
        password: {
            type: String, 
            required: true,
        },
        secretWord: {
            type: String, 
            required: true, 
            trim: true, 
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        verificationCode: {
            type: String,
            default: null
        },
        verificationCodeExpires: {
            type: Date,
            default: null
        }, 
        role: {
            type: String,
            enum: ["admin", "cliente"],
            default: "cliente", 
            required: true
        }
    },
    {
        timestamps: true, 
    }
);


export default mongoose.model('User', userSchema);

